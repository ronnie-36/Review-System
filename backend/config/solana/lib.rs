use anchor_lang::prelude::*;

declare_id!("Cfzj3oJn8E5vdmEThrb1s8c7M5FE6m9fRnNky8i98TZb");

#[program]
pub mod reviewsystem {

    use super::*;

    pub fn create_organization(
        ctx: Context<CreateOrganization>,
        _organization_id: String,
    ) -> Result<()> {
        let org_account = &mut ctx.accounts.org_account;
        org_account.bump = *ctx.bumps.get("org_account").unwrap();
        org_account.review_count = 0;

        Ok(())
    }

    pub fn create_user(ctx: Context<CreateUser>, _user_id: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.bump = *ctx.bumps.get("user_account").unwrap();
        user_account.review_count = 0;

        Ok(())
    }

    pub fn create_review(
        ctx: Context<AddReview>,
        _organization_id: String,
        _user_id: String,
        review: NewReview,
    ) -> Result<()> {
        require!(review.images.len() < 6, Errors::MaxImageLimitReached);
        require!(review.videos.len() < 6, Errors::MaxVideoLimitReached);
        require!(review.audios.len() < 6, Errors::MaxAudioLimitReached);

        let review_account = &mut ctx.accounts.review_account;
        let user_review_account = &mut ctx.accounts.user_review_account;
        let org_acccount = &mut ctx.accounts.org_account;
        let user_account = &mut ctx.accounts.user_account;

        let org_review_count = org_acccount.review_count.checked_add(1);
        let user_review_count = user_account.review_count.checked_add(1);

        require!(
            org_review_count != None,
            Errors::MaxOrganizationReviewLimitReached
        );

        require!(user_review_count != None, Errors::MaxUserReviewLimitReached);

        org_acccount.review_count = org_review_count.unwrap();
        user_account.review_count = user_review_count.unwrap();

        review_account.bump = *ctx.bumps.get("review_account").unwrap();
        user_review_account.bump = *ctx.bumps.get("user_review_account").unwrap();

        user_review_account.review = review_account.key();

        review_account.rating = review.rating;
        review_account.text = review.text;
        review_account.time = review.time;
        review_account.images = review.images;
        review_account.videos = review.videos;
        review_account.audios = review.audios;
        review_account.organization = _organization_id;
        review_account.user = _user_id;

        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
#[instruction(_organization_id:String)]
pub struct CreateOrganization<'info> {
    #[account(init, payer = user, space = 8 + 8 + 1,seeds=[b"organization",_organization_id.as_bytes()],bump)]
    pub org_account: Account<'info, Organization>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_user_id:String)]
pub struct CreateUser<'info> {
    #[account(init,payer=user,space = 8+8+1 , seeds=[b"user",_user_id.as_bytes()],bump)]
    pub user_account: Account<'info, User>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Transaction instructions
#[derive(Accounts)]
#[instruction(_organization_id:String,_user_id:String,review:NewReview)]
pub struct AddReview<'info> {
    #[account(mut,seeds=[b"organization",_organization_id.as_bytes()],bump=org_account.bump)]
    pub org_account: Account<'info, Organization>,
    #[account(mut,seeds=[b"user",_user_id.as_bytes()],bump=user_account.bump)]
    pub user_account: Account<'info, User>,
    #[account(init,payer=user,space=8+4+64+32+32*2+1+1+12+review.images.len()*64*2+review.videos.len()*64*2+review.audios.len()*64*2,seeds=[b"review",org_account.key().as_ref(),&[org_account.review_count as u8]],bump)]
    pub review_account: Account<'info, Review>,
    #[account(init,payer=user,space=8+32+1,seeds=[b"user_review",user_account.key().as_ref(),&[user_account.review_count as u8]],bump)]
    pub user_review_account: Account<'info, UserReview>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct Organization {
    pub review_count: u64,
    pub bump: u8,
}

#[account]
pub struct User {
    pub review_count: u64,
    pub bump: u8,
}

#[account]
pub struct UserReview {
    pub review: Pubkey,
    pub bump: u8,
}

#[account]
pub struct Review {
    pub text: String,                  //64
    pub rating: u8,                    //1
    pub time: String,                  //32
    pub images: Vec<MultimediaStruct>, //4+size*64*2
    pub videos: Vec<MultimediaStruct>, //4+size*64*2
    pub audios: Vec<MultimediaStruct>, //4+size*64*2
    pub organization: String,          //32
    pub user: String,                  //32
    pub bump: u8,                      //1
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct MultimediaStruct {
    pub mediaref: String, //64
    pub caption: String,  //64
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct NewReview {
    pub text: String,
    pub rating: u8,
    pub time: String,
    pub images: Vec<MultimediaStruct>,
    pub videos: Vec<MultimediaStruct>,
    pub audios: Vec<MultimediaStruct>,
}

#[error_code]
pub enum Errors {
    #[msg("Maximum 5 images can be attached")]
    MaxImageLimitReached,
    #[msg("Maximum 5 videos can be attached")]
    MaxVideoLimitReached,
    #[msg("Maximum 5 audios can be attached")]
    MaxAudioLimitReached,
    #[msg("Maximum Review Limit Reached for organization")]
    MaxOrganizationReviewLimitReached,
    #[msg("Maximum Review Limit Reached for user")]
    MaxUserReviewLimitReached,
}
