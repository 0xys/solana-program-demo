use thiserror::Error;
use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum HelloError {
    #[error("Invalid Instruction")]
    InvalidInstruction,
}

impl From<HelloError> for ProgramError {
    fn from(e: HelloError) -> Self {
        ProgramError::Custom(e as u32)
    }
}