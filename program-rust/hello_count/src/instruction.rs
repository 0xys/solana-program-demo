use std::convert::TryInto;
use solana_program::program_error::ProgramError;

use crate::error::HelloError::InvalidInstruction;

pub enum HelloInstruction {
    HelloCount {
        count: u64
    }
}

impl HelloInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => Self::HelloCount {
                count: Self::unpack_count(rest)?,
            },
            _ => return Err(InvalidInstruction.into())
        })
    }

    fn unpack_count(input: &[u8]) -> Result<u64, ProgramError> {
        let count = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(count)
    }
}