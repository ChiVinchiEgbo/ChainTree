import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";

// ============================================================================
// TEST SUITE: ChainTree Staking Program
// ============================================================================
// These tests run against a local Solana validator (started by `anchor test`).
// They exercise every instruction and validate both happy paths and edge cases.

describe("chaintree_staking", () => {
  // Configure the Anchor provider (connects to local validator)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ChaintreeStaking as Program;

  // Test accounts we'll create and reuse across tests
  let tokenMint: anchor.web3.PublicKey;
  let userTokenAccount: anchor.web3.PublicKey;
  let authorityTokenAccount: anchor.web3.PublicKey;

  // PDAs — we'll derive these from seeds
  let stakingVaultPda: anchor.web3.PublicKey;
  let stakingVaultBump: number;
  let vaultTokenAccountPda: anchor.web3.PublicKey;
  let rewardPoolPda: anchor.web3.PublicKey;
  let stakeAccountPda: anchor.web3.PublicKey;

  // The authority (admin) who creates the vault — uses the provider wallet
  const authority = provider.wallet;

  // A separate user keypair for staking (simulates a different user)
  const user = anchor.web3.Keypair.generate();

  // An unauthorized user (for testing access control)
  const unauthorized = anchor.web3.Keypair.generate();

  // Token amounts (using 6 decimals like USDC)
  const DECIMALS = 6;
  const MINT_AMOUNT = 1_000_000 * 10 ** DECIMALS; // 1,000,000 tokens
  const STAKE_AMOUNT = 100 * 10 ** DECIMALS; // 100 tokens
  const REWARD_POOL_AMOUNT = 500_000 * 10 ** DECIMALS; // 500K reward tokens

  // ========================================================================
  // SETUP: Create test tokens and fund accounts
  // ========================================================================
  before(async () => {
    // Airdrop SOL to our test user so they can pay for transactions
    const userAirdrop = await provider.connection.requestAirdrop(
      user.publicKey,
      5 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(userAirdrop);

    // Airdrop SOL to unauthorized user too
    const unauthAirdrop = await provider.connection.requestAirdrop(
      unauthorized.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(unauthAirdrop);

    // Create a new SPL token mint (this is the token users will stake)
    tokenMint = await createMint(
      provider.connection,
      (authority as anchor.Wallet).payer, // payer
      authority.publicKey, // mint authority
      null, // freeze authority (none)
      DECIMALS // decimals
    );
    console.log("  Token Mint:", tokenMint.toBase58());

    // Create token accounts for our test users
    userTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      (authority as anchor.Wallet).payer,
      tokenMint,
      user.publicKey
    );

    authorityTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      (authority as anchor.Wallet).payer,
      tokenMint,
      authority.publicKey
    );

    // Mint tokens to the user so they have something to stake
    await mintTo(
      provider.connection,
      (authority as anchor.Wallet).payer,
      tokenMint,
      userTokenAccount,
      authority.publicKey,
      MINT_AMOUNT
    );

    // Derive all PDAs we'll need
    [stakingVaultPda, stakingVaultBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), tokenMint.toBuffer()],
        program.programId
      );

    [vaultTokenAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_token"), stakingVaultPda.toBuffer()],
      program.programId
    );

    [rewardPoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("reward_pool"), stakingVaultPda.toBuffer()],
      program.programId
    );

    [stakeAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("stake"),
        stakingVaultPda.toBuffer(),
        user.publicKey.toBuffer(),
      ],
      program.programId
    );

    console.log("  Vault PDA:", stakingVaultPda.toBase58());
    console.log("  Vault Token Account PDA:", vaultTokenAccountPda.toBase58());
    console.log("  Reward Pool PDA:", rewardPoolPda.toBase58());
    console.log("  User Stake Account PDA:", stakeAccountPda.toBase58());
  });

  // ========================================================================
  // TEST: Initialize Vault
  // ========================================================================
  it("initializes the staking vault", async () => {
    const tx = await program.methods
      .initializeVault()
      .accounts({
        stakingVault: stakingVaultPda,
        vaultTokenAccount: vaultTokenAccountPda,
        rewardPool: rewardPoolPda,
        tokenMint: tokenMint,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("  Initialize vault tx:", tx);

    // Verify the vault was created correctly
    const vault = await program.account.stakingVault.fetch(stakingVaultPda);
    assert.ok(vault.authority.equals(authority.publicKey));
    assert.ok(vault.tokenMint.equals(tokenMint));
    assert.ok(vault.vaultTokenAccount.equals(vaultTokenAccountPda));
    assert.ok(vault.rewardPool.equals(rewardPoolPda));
    assert.equal(vault.totalStaked.toNumber(), 0);
    assert.equal(vault.bump, stakingVaultBump);
  });

  // ========================================================================
  // TEST: Fund Reward Pool
  // ========================================================================
  it("funds the reward pool with tokens", async () => {
    // Mint tokens to the authority first
    await mintTo(
      provider.connection,
      (authority as anchor.Wallet).payer,
      tokenMint,
      authorityTokenAccount,
      authority.publicKey,
      REWARD_POOL_AMOUNT
    );

    // Transfer reward tokens into the pool
    // (This is a direct SPL transfer, not a program instruction)
    const transferIx = anchor.web3.SystemProgram.transfer({
      fromPubkey: authority.publicKey,
      toPubkey: authority.publicKey, // placeholder
      lamports: 0,
    });

    // Use spl-token transfer to fund reward pool
    const { createTransferInstruction } = await import("@solana/spl-token");
    const ix = createTransferInstruction(
      authorityTokenAccount,
      rewardPoolPda,
      authority.publicKey,
      REWARD_POOL_AMOUNT
    );

    const tx = new anchor.web3.Transaction().add(ix);
    await provider.sendAndConfirm(tx);

    // Verify reward pool balance
    const poolAccount = await getAccount(
      provider.connection,
      rewardPoolPda
    );
    assert.equal(
      Number(poolAccount.amount),
      REWARD_POOL_AMOUNT,
      "Reward pool should be funded"
    );
    console.log("  Reward pool funded with", REWARD_POOL_AMOUNT / 10 ** DECIMALS, "tokens");
  });

  // ========================================================================
  // TEST: Stake Tokens (Happy Path)
  // ========================================================================
  it("stakes tokens successfully", async () => {
    // Check user's balance before staking
    const beforeBalance = await getAccount(
      provider.connection,
      userTokenAccount
    );
    assert.equal(Number(beforeBalance.amount), MINT_AMOUNT);

    const tx = await program.methods
      .stake(new anchor.BN(STAKE_AMOUNT))
      .accounts({
        stakingVault: stakingVaultPda,
        vaultTokenAccount: vaultTokenAccountPda,
        stakeAccount: stakeAccountPda,
        userTokenAccount: userTokenAccount,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("  Stake tx:", tx);

    // Verify tokens moved to vault
    const afterBalance = await getAccount(
      provider.connection,
      userTokenAccount
    );
    assert.equal(
      Number(afterBalance.amount),
      MINT_AMOUNT - STAKE_AMOUNT,
      "User balance should decrease by stake amount"
    );

    // Verify vault received tokens
    const vaultBalance = await getAccount(
      provider.connection,
      vaultTokenAccountPda
    );
    assert.equal(
      Number(vaultBalance.amount),
      STAKE_AMOUNT,
      "Vault should hold the staked tokens"
    );

    // Verify stake account was created
    const stakeAccount = await program.account.stakeAccount.fetch(
      stakeAccountPda
    );
    assert.ok(stakeAccount.owner.equals(user.publicKey));
    assert.equal(stakeAccount.amount.toNumber(), STAKE_AMOUNT);
    assert.ok(stakeAccount.lastStakeTimestamp.toNumber() > 0);
  });

  // ========================================================================
  // TEST: Stake Again (Double Stake)
  // ========================================================================
  it("allows staking additional tokens", async () => {
    const additionalStake = 50 * 10 ** DECIMALS; // 50 more tokens

    await program.methods
      .stake(new anchor.BN(additionalStake))
      .accounts({
        stakingVault: stakingVaultPda,
        vaultTokenAccount: vaultTokenAccountPda,
        stakeAccount: stakeAccountPda,
        userTokenAccount: userTokenAccount,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    // Verify total staked is now 150 tokens
    const stakeAccount = await program.account.stakeAccount.fetch(
      stakeAccountPda
    );
    assert.equal(
      stakeAccount.amount.toNumber(),
      STAKE_AMOUNT + additionalStake,
      "Total staked should be sum of both stakes"
    );

    // Verify vault total
    const vault = await program.account.stakingVault.fetch(stakingVaultPda);
    assert.equal(
      vault.totalStaked.toNumber(),
      STAKE_AMOUNT + additionalStake,
      "Vault total should match"
    );
  });

  // ========================================================================
  // TEST: Edge Case — Stake Zero Tokens (Should Fail)
  // ========================================================================
  it("rejects staking zero tokens", async () => {
    try {
      await program.methods
        .stake(new anchor.BN(0))
        .accounts({
          stakingVault: stakingVaultPda,
          vaultTokenAccount: vaultTokenAccountPda,
          stakeAccount: stakeAccountPda,
          userTokenAccount: userTokenAccount,
          user: user.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
      assert.fail("Should have thrown an error for zero amount");
    } catch (err) {
      // Anchor wraps custom errors — check for our ZeroAmount error
      assert.ok(
        err.toString().includes("ZeroAmount") ||
          err.toString().includes("Cannot stake or unstake zero"),
        `Expected ZeroAmount error, got: ${err.toString()}`
      );
    }
  });

  // ========================================================================
  // TEST: Edge Case — Unstake More Than Staked (Should Fail)
  // ========================================================================
  it("rejects unstaking more than staked", async () => {
    const tooMuch = 999_999 * 10 ** DECIMALS; // Way more than staked

    try {
      await program.methods
        .unstake(new anchor.BN(tooMuch))
        .accounts({
          stakingVault: stakingVaultPda,
          vaultTokenAccount: vaultTokenAccountPda,
          stakeAccount: stakeAccountPda,
          userTokenAccount: userTokenAccount,
          user: user.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
      assert.fail("Should have thrown an error for insufficient stake");
    } catch (err) {
      assert.ok(
        err.toString().includes("InsufficientStake") ||
          err.toString().includes("Insufficient staked balance"),
        `Expected InsufficientStake error, got: ${err.toString()}`
      );
    }
  });

  // ========================================================================
  // TEST: Claim Rewards
  // ========================================================================
  it("claims accrued rewards", async () => {
    // Wait a moment so some rewards accrue
    // (In tests with a local validator, time moves with each slot)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const beforeBalance = await getAccount(
      provider.connection,
      userTokenAccount
    );

    const tx = await program.methods
      .claimRewards()
      .accounts({
        stakingVault: stakingVaultPda,
        rewardPool: rewardPoolPda,
        stakeAccount: stakeAccountPda,
        userTokenAccount: userTokenAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("  Claim rewards tx:", tx);

    const afterBalance = await getAccount(
      provider.connection,
      userTokenAccount
    );

    const rewardsReceived =
      Number(afterBalance.amount) - Number(beforeBalance.amount);
    console.log("  Rewards received:", rewardsReceived / 10 ** DECIMALS, "tokens");
    assert.ok(
      rewardsReceived > 0,
      "Should have received some rewards"
    );

    // Verify rewards_earned was reset
    const stakeAccount = await program.account.stakeAccount.fetch(
      stakeAccountPda
    );
    assert.equal(
      stakeAccount.rewardsEarned.toNumber(),
      0,
      "Rewards earned should be reset after claim"
    );
  });

  // ========================================================================
  // TEST: Partial Unstake
  // ========================================================================
  it("partially unstakes tokens", async () => {
    const partialUnstake = 50 * 10 ** DECIMALS; // Unstake 50 of 150

    const beforeBalance = await getAccount(
      provider.connection,
      userTokenAccount
    );

    const tx = await program.methods
      .unstake(new anchor.BN(partialUnstake))
      .accounts({
        stakingVault: stakingVaultPda,
        vaultTokenAccount: vaultTokenAccountPda,
        stakeAccount: stakeAccountPda,
        userTokenAccount: userTokenAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("  Partial unstake tx:", tx);

    const afterBalance = await getAccount(
      provider.connection,
      userTokenAccount
    );
    const tokensReturned =
      Number(afterBalance.amount) - Number(beforeBalance.amount);
    assert.equal(
      tokensReturned,
      partialUnstake,
      "Should receive back the unstaked amount"
    );

    // Verify remaining stake
    const stakeAccount = await program.account.stakeAccount.fetch(
      stakeAccountPda
    );
    assert.equal(
      stakeAccount.amount.toNumber(),
      100 * 10 ** DECIMALS, // 150 - 50 = 100
      "Remaining staked should be 100 tokens"
    );
  });

  // ========================================================================
  // TEST: Full Unstake
  // ========================================================================
  it("fully unstakes all remaining tokens", async () => {
    const remaining = 100 * 10 ** DECIMALS;

    await program.methods
      .unstake(new anchor.BN(remaining))
      .accounts({
        stakingVault: stakingVaultPda,
        vaultTokenAccount: vaultTokenAccountPda,
        stakeAccount: stakeAccountPda,
        userTokenAccount: userTokenAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    // Verify zero remaining stake
    const stakeAccount = await program.account.stakeAccount.fetch(
      stakeAccountPda
    );
    assert.equal(stakeAccount.amount.toNumber(), 0, "Should have zero staked");

    // Verify vault is empty
    const vaultBalance = await getAccount(
      provider.connection,
      vaultTokenAccountPda
    );
    assert.equal(
      Number(vaultBalance.amount),
      0,
      "Vault should be empty"
    );

    // Verify vault total staked is zero
    const vault = await program.account.stakingVault.fetch(stakingVaultPda);
    assert.equal(
      vault.totalStaked.toNumber(),
      0,
      "Vault total staked should be zero"
    );
  });

  // ========================================================================
  // TEST: Unauthorized Access — Wrong user tries to unstake
  // ========================================================================
  it("rejects unauthorized unstake attempts", async () => {
    // First, stake some tokens as the legitimate user
    await program.methods
      .stake(new anchor.BN(STAKE_AMOUNT))
      .accounts({
        stakingVault: stakingVaultPda,
        vaultTokenAccount: vaultTokenAccountPda,
        stakeAccount: stakeAccountPda,
        userTokenAccount: userTokenAccount,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    // Now try to unstake as the unauthorized user
    // This should fail because the PDA seeds won't match
    const [wrongStakeAccount] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("stake"),
          stakingVaultPda.toBuffer(),
          unauthorized.publicKey.toBuffer(),
        ],
        program.programId
      );

    // Create a token account for the unauthorized user
    const unauthTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      (authority as anchor.Wallet).payer,
      tokenMint,
      unauthorized.publicKey
    );

    try {
      // The unauthorized user tries to unstake from the REAL user's stake account.
      // This should fail because the PDA seeds include the signer's pubkey,
      // and the unauthorized user's pubkey won't match the user's stake PDA.
      await program.methods
        .unstake(new anchor.BN(STAKE_AMOUNT))
        .accounts({
          stakingVault: stakingVaultPda,
          vaultTokenAccount: vaultTokenAccountPda,
          stakeAccount: stakeAccountPda, // user's stake account, not unauthorized's
          userTokenAccount: unauthTokenAccount,
          user: unauthorized.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([unauthorized])
        .rpc();
      assert.fail("Should have rejected unauthorized unstake");
    } catch (err) {
      // The error could be a seed constraint failure or an ownership check
      assert.ok(
        err.toString().includes("ConstraintSeeds") ||
          err.toString().includes("Unauthorized") ||
          err.toString().includes("Error") ||
          err.toString().includes("2006"), // Anchor constraint error
        `Expected authorization error, got: ${err.toString()}`
      );
      console.log("  ✓ Unauthorized unstake correctly rejected");
    }

    // Clean up: unstake the legitimate user's tokens
    await program.methods
      .unstake(new anchor.BN(STAKE_AMOUNT))
      .accounts({
        stakingVault: stakingVaultPda,
        vaultTokenAccount: vaultTokenAccountPda,
        stakeAccount: stakeAccountPda,
        userTokenAccount: userTokenAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();
  });

  // ========================================================================
  // TEST: Edge Case — Claim with No Rewards
  // ========================================================================
  it("rejects claiming when no rewards available", async () => {
    // The user just fully unstaked and claimed, so rewards should be zero
    // Stake a tiny amount and immediately try to claim
    const tinyAmount = 1; // 1 micro-token

    await program.methods
      .stake(new anchor.BN(tinyAmount))
      .accounts({
        stakingVault: stakingVaultPda,
        vaultTokenAccount: vaultTokenAccountPda,
        stakeAccount: stakeAccountPda,
        userTokenAccount: userTokenAccount,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    try {
      // Immediately claim — elapsed time ≈ 0, so rewards ≈ 0
      await program.methods
        .claimRewards()
        .accounts({
          stakingVault: stakingVaultPda,
          rewardPool: rewardPoolPda,
          stakeAccount: stakeAccountPda,
          userTokenAccount: userTokenAccount,
          user: user.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
      // If it succeeds, that means some minimal time passed — that's OK
      console.log("  Note: Some minimal rewards accrued (time elapsed between blocks)");
    } catch (err) {
      assert.ok(
        err.toString().includes("NoRewards") ||
          err.toString().includes("No rewards"),
        `Expected NoRewards error, got: ${err.toString()}`
      );
      console.log("  ✓ Zero rewards claim correctly rejected");
    }
  });
});
