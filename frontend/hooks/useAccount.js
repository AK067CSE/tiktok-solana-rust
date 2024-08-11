import { useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getProgramInstance } from "../utils/utils";
import { SOLANA_HOST } from "../utils/const";

const anchor = require('@project-serum/anchor');
const utf8 = anchor.utils.bytes.utf8;
const { web3 } = anchor;
const { SystemProgram } = web3;

const defaultAccounts = {
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram: SystemProgram.programId,
};

const useAccount = () => {
    const { publicKey, connected, sendTransaction } = useWallet();
    const connection = new anchor.web3.Connection(SOLANA_HOST);
    const program = getProgramInstance(connection, { publicKey, sendTransaction });

    const signup = async (name, profile, profileImage) => {
        if (!connected || !publicKey) {
            console.error("Wallet not connected");
            return;
        }

        try {
            let [user_pda] = await anchor.web3.PublicKey.findProgramAddressSync(
                [utf8.encode('user'), publicKey.toBuffer()],
                program.programId
            );

            const transaction = new anchor.web3.Transaction().add(
                program.instruction.createUser(name, profile, profileImage, {
                    accounts: {
                        user: user_pda,
                        authority: publicKey,
                        ...defaultAccounts,
                    },
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');

            console.log("User is signed up");

            // Redirect to TikTok page
            window.location.href = 'https://www.tiktok.com';
        } catch (error) {
            console.error("Error signing up user:", error);
        }
    };

    return { signup };
};

export default useAccount;
