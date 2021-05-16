use solana_program::{
    program_pack::{IsInitialized, Pack, Sealed},
    program_error::ProgramError
};

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

pub struct Hello {
    pub is_initialized: bool,
    pub count: u64
}

impl Sealed for Hello {}

impl IsInitialized for Hello {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Hello {
    const LEN: usize = 9;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Hello::LEN];

        let (is_initialized, count) = array_refs![src, 1, 8];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        Ok(Hello {
            is_initialized,
            count: u64::from_le_bytes(*count)
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Hello::LEN];

        let (is_initialized_dst, count_dst) = mut_array_refs![dst, 1, 8];

        is_initialized_dst[0] = self.is_initialized() as u8;
        *count_dst = self.count.to_le_bytes();
    }
}