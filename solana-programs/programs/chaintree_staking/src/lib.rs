use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("11111111111111111111111111111111");

const REWARD_RATE_PER_SECOND: u64 = 1;

const VAULT_SEED: &[u8] = b"vault";
const VAULT_TOKEN_SEED: &[u8] = b"vault_token";
const STAKE_SEED: &[u8] = b"stake";
const REWARD_POOL_SEED: &[u8] = b"reward_pool";

#[program]
pub mod chaintree_staking {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault = &mut ctx.accounts.staking_vault;
        vault.authority = ctx.accounts.authority.key();
        vault.token_mint = ctx.accounts.token_mint.key();
        vault.vault_token_account = ctx.accounts.vault_token_account.key();
        vault.reward_pool = ctx.accounts.reward_pool.key();
        vault.bump = ctx.bumps.staking_vault;
        vault.total_staked = 0;

        msg!(
            "✅ Vault initialized! Mint: {}, Authority: {}",
            vault.token_mint,
            vault.authority
        );
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakingError::ZeroAmount);

        let stake_account = &mut ctx.accounts.stake_account;
        let vault = &mut ctx.accounts.staking_vault;

        if stake_account.amount > 0 {
            let now = Clock::get()?.unix_timestamp;
            let elapsed = (now - stake_account.last_stake_timestamp) as u64;
            let pending = stake_account
                .amount
                .checked_mul(elapsed)
                .ok_or(StakingError::Overflow)?
                .checked_mul(REWARD_RATE_PER_SECOND)
                .ok_or(StakingError::Overflow)?
                .checked_div(1_000_000)
                .ok_or(StakingError::Overflow)?;
            stake_account.rewards_earned = stake_account
                .rewards_earned
                .checked_add(pending)
                .ok_or(StakingError::Overflow)?;
        }

        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.vault_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        stake_account.owner = ctx.accounts.user.key();
        stake_account.vault = vault.key();
        stake_account.amount = stake_account
            .amount
            .checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        stake_account.last_stake_timestamp = Clock::get()?.unix_timestamp;
        stake_account.bump = ctx.bumps.stake_account;

        vault.total_staked = vault
            .total_staked
            .checked_add(amount)
            .ok_or(StakingError::Overflow)?;

        msg!(
            "✅ Staked {} tokens. Total staked by user: {}",
            amount,
            stake_account.amount
        );
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakingError::ZeroAmount);

        let stake_account = &mut ctx.accounts.stake_account;
        require!(
            amount <= stake_account.amount,
            StakingError::InsufficientStake
        );

        let now = Clock::get()?.unix_timestamp;
        let elapsed = (now - stake_account.last_stake_timestamp) as u64;
        let pending = stake_account
            .amount
            .checked_mul(elapsed)
            .ok_or(StakingError::Overflow)?
            .checked_mul(REWARD_RATE_PER_SECOND)
            .ok_or(StakingError::Overflow)?
            .checked_div(1_000_000)
            .ok_or(StakingError::Overflow)?;
        stake_account.rewards_earned = stake_account
            .rewards_earned
            .checked_add(pending)
            .ok_or(StakingError::Overflow)?;

        let vault = &ctx.accounts.staking_vault;
        let vault_bump = vault.bump;
        let mint_key = vault.token_mint;
        let signer_seeds: &[&[&[u8]]] = &[&[
            VAULT_SEED,
            mint_key.as_ref(),
            &[vault_bump],
        ]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.staking_vault.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_ctx, amount)?;

        stake_account.amount = stake_account
            .amount
            .checked_sub(amount)
            .ok_or(StakingError::Overflow)?;
        stake_account.last_stake_timestamp = now;

        let vault = &mut ctx.accounts.staking_vault;
        vault.total_staked = vault
            .total_staked
            .checked_sub(amount)
            .ok_or(StakingError::Overflow)?;

        msg!(
            "✅ Unstaked {} tokens. Remaining: {}",
            amount,
            stake_account.amount
        );
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;

        let now = Clock::get()?.unix_timestamp;
        let elapsed = (now - stake_account.last_stake_timestamp) as u64;
        let newly_accrued = stake_account
            .amount
            .checked_mul(elapsed)
            .ok_or(StakingError::Overflow)?
            .checked_mul(REWARD_RATE_PER_SECOND)
            .ok_or(StakingError::Overflow)?
            .checked_div(1_000_000)
            .ok_or(StakingError::Overflow)?;

        let total_rewards = stake_account
            .rewards_earned
            .checked_add(newly_accrued)
            .ok_or(StakingError::Overflow)?;

        require!(total_rewards > 0, StakingError::NoRewards);

        let vault = &ctx.accounts.staking_vault;
        let vault_bump = vault.bump;
        let mint_key = vault.token_mint;
        let signer_seeds: &[&[&[u8]]] = &[&[
            VAULT_SEED,
            mint_key.as_ref(),
            &[vault_bump],
        ]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.reward_pool.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.staking_vault.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_ctx, total_rewards)?;

        stake_account.rewards_earned = 0;
        stake_account.last_stake_timestamp = now;

        msg!("✅ Claimed {} reward tokens!", total_rewards);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StakingVault::INIT_SPACE,
        seeds = [VAULT_SEED, token_mint.key().as_ref()],
        bump
    )]
    pub staking_vault: Box<Account<'info, StakingVault>>,

    /// Vault token account holding staked tokens
    #[account(
        init,
        payer = authority,
        token::mint = token_mint,
        token::authority = staking_vault,
        seeds = [VAULT_TOKEN_SEED, staking_vault.key().as_ref()],
        bump
    )]
    pub vault_token_account: Box<Account<'info, TokenAccount>>,

    /// Reward pool token account
    #[account(
        init,
        payer = authority,
        token::mint = token_mint,
        token::authority = staking_vault,
        seeds = [REWARD_POOL_SEED, staking_vault.key().as_ref()],
        bump
    )]
    pub reward_pool: Box<Account<'info, TokenAccount>>,

    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(
        mut,
        seeds = [VAULT_SEED, staking_vault.token_mint.as_ref()],
        bump = staking_vault.bump,
    )]
    pub staking_vault: Box<Account<'info, StakingVault>>,

    #[account(
        mut,
        address = staking_vault.vault_token_account,
    )]
    pub vault_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + StakeAccount::INIT_SPACE,
        seeds = [STAKE_SEED, staking_vault.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub stake_account: Box<Account<'info, StakeAccount>>,

    #[account(
        mut,
        constraint = user_token_account.mint == staking_vault.token_mint @ StakingError::WrongMint,
        constraint = user_token_account.owner == user.key() @ StakingError::WrongOwner,
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(
        mut,
        seeds = [VAULT_SEED, staking_vault.token_mint.as_ref()],
        bump = staking_vault.bump,
    )]
    pub staking_vault: Box<Account<'info, StakingVault>>,

    #[account(
        mut,
        address = staking_vault.vault_token_account,
    )]
    pub vault_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [STAKE_SEED, staking_vault.key().as_ref(), user.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key() @ StakingError::Unauthorized,
    )]
    pub stake_account: Box<Account<'info, StakeAccount>>,

    #[account(
        mut,
        constraint = user_token_account.mint == staking_vault.token_mint @ StakingError::WrongMint,
        constraint = user_token_account.owner == user.key() @ StakingError::WrongOwner,
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        seeds = [VAULT_SEED, staking_vault.token_mint.as_ref()],
        bump = staking_vault.bump,
    )]
    pub staking_vault: Box<Account<'info, StakingVault>>,

    #[account(
        mut,
        address = staking_vault.reward_pool,
    )]
    pub reward_pool: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [STAKE_SEED, staking_vault.key().as_ref(), user.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key() @ StakingError::Unauthorized,
    )]
    pub stake_account: Box<Account<'info, StakeAccount>>,

    #[account(
        mut,
        constraint = user_token_account.mint == staking_vault.token_mint @ StakingError::WrongMint,
        constraint = user_token_account.owner == user.key() @ StakingError::WrongOwner,
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct StakingVault {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub vault_token_account: Pubkey,
    pub reward_pool: Pubkey,
    pub bump: u8,
    pub total_staked: u64,
}

#[account]
#[derive(InitSpace)]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub vault: Pubkey,
    pub amount: u64,
    pub last_stake_timestamp: i64,
    pub rewards_earned: u64,
    pub bump: u8,
}

#[error_code]
pub enum StakingError {
    #[msg("Cannot stake or unstake zero tokens")]
    ZeroAmount,

    #[msg("Insufficient staked balance for this unstake amount")]
    InsufficientStake,

    #[msg("You are not authorized to perform this action")]
    Unauthorized,

    #[msg("Token mint does not match the vault's accepted mint")]
    WrongMint,

    #[msg("Token account owner does not match the signer")]
    WrongOwner,

    #[msg("No rewards available to claim")]
    NoRewards,

    #[msg("Arithmetic overflow in reward calculation")]
    Overflow,
}
