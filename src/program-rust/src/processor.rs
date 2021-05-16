use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_pack::Pack,
    program_error::ProgramError
};

use crate::instruction::HelloInstruction;
use crate::state::Hello;

pub struct Processor;

impl Processor {
    pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
        msg!("instruction: {:?}", instruction_data);
        
        let instruction = HelloInstruction::unpack(instruction_data)?;

        match instruction {
            HelloInstruction::HelloCount { count } => {
                msg!("Instruction: HelloCount");
                Self::process_hello_count(accounts, count, program_id)
            }
        }
    }

    fn process_hello_count(accounts: &[AccountInfo], count: u64, program_id: &Pubkey) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let account = next_account_info(account_info_iter)?;

        if account.owner != program_id {
            msg!("Greeted account does not have the correct program id");
            return Err(ProgramError::IncorrectProgramId);
        }

        msg!("account state: {:?}", account.data.borrow());
        let mut state = Hello::unpack_from_slice(&account.data.borrow())?;

        if !state.is_initialized {
            msg!("state initialized");
        }
        
        let prev_count = state.count;
        state.is_initialized = true;
        state.count += count;

        state.pack_into_slice(&mut account.data.borrow_mut());
        msg!("state update: {:?} + {:?} = {:?}", prev_count ,count, state.count);

        Ok(())
    }
}