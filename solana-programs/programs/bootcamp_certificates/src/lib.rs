use anchor_lang::prelude::*;

declare_id!("BYiTyWDcTk5Be4AQkxoYQhh6TQsrZSJKuePHrfJYDNSm");

#[program]
pub mod bootcamp_certificates {
    use super::*;

    pub fn initialize_course(
        ctx: Context<InitializeCourse>,
        course_id: String,
        course_title: String,
    ) -> Result<()> {
        let course = &mut ctx.accounts.course_account;
        course.authority = ctx.accounts.authority.key();
        course.course_id = course_id;
        course.course_title = course_title;
        course.total_certificates_minted = 0;
        msg!("Course initialized: {}", course.course_title);
        Ok(())
    }

    pub fn mint_certificate(
        ctx: Context<MintCertificate>,
        _student_email_hash: String,
    ) -> Result<()> {
        let course = &mut ctx.accounts.course_account;
        course.total_certificates_minted += 1;

        msg!(
            "Minted certificate #{} for course '{}'",
            course.total_certificates_minted,
            course.course_title
        );
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(course_id: String)]
pub struct InitializeCourse<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 32 + 4 + 64 + 8,
        seeds = [b"course", course_id.as_bytes()],
        bump
    )]
    pub course_account: Account<'info, CourseAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintCertificate<'info> {
    #[account(mut)]
    pub course_account: Account<'info, CourseAccount>,
    pub student_wallet: Signer<'info>,
}

#[account]
pub struct CourseAccount {
    pub authority: Pubkey,
    pub course_id: String,
    pub course_title: String,
    pub total_certificates_minted: u64,
}
