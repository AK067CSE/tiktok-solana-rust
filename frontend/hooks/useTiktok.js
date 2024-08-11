import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Connection, Transaction } from "@solana/web3.js";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/utils";

const anchor = require('@project-serum/anchor');
const utf8 = anchor.utils.bytes.utf8;
const { BN, web3 } = anchor;
const { SystemProgram } = web3;

const defaultAccounts = {
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram: SystemProgram.programId,
};

const useTiktok = (
    setTikToks,
    userDetail,
    videoUrl,
    description,
    setDescription,
    setVideoUrl,
    setNewVideoShow,
) => {
    const { publicKey, sendTransaction, connected } = useWallet();
    const connection = new Connection(SOLANA_HOST);
    const program = getProgramInstance(connection, useWallet());

    const getTiktoks = async () => {
        try {
            console.log('Fetching TikToks...');
            const videos = await program.account.videoAccount.all();
            console.log(videos);
            setTikToks(videos);
        } catch (error) {
            console.error("Error fetching TikToks:", error);
        }
    };

    const likeVideo = async (address) => {
        try {
            console.log('Liking video at address:', address);
            // Add actual implementation here
        } catch (error) {
            console.error("Error liking video:", error);
        }
    };

    const createComment = async (address, count, comment) => {
        try {
            console.log('Creating comment on video at address:', address);
            // Add actual implementation here
        } catch (error) {
            console.error("Error creating comment:", error);
        }
    };

    const newVideo = async () => {
        if (!publicKey || !connected) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const randomKey = anchor.web3.Keypair.generate().publicKey;

            // Generate the PDA (Program Derived Address) for the video
            let [video_pda] = await anchor.web3.PublicKey.findProgramAddress(
                [utf8.encode('video'), randomKey.toBuffer()],
                program.programId,
            );

            // Create the transaction instruction
            const transaction = new Transaction().add(
                program.instruction.createVideo(
                    description,
                    videoUrl,
                    userDetail.userName,
                    userDetail.userProfileImageUrl,
                    {
                        accounts: {
                            video: video_pda,
                            randomkey: randomKey,
                            authority: publicKey,
                            ...defaultAccounts,
                        },
                    }
                )
            );

            // Send the transaction through the wallet
            const signature = await sendTransaction(transaction, connection);

            // Wait for confirmation
            await connection.confirmTransaction(signature, 'processed');

            console.log("Video created with transaction signature:", signature);

            // Clear the input fields and close the modal
            setDescription('');
            setVideoUrl('');
            setNewVideoShow(false);
        } catch (error) {
            console.error("Error creating video:", error);
        }
    };

    const getComments = async (address, count) => {
        try {
            console.log('Fetching comments for video at address:', address);
            // Add actual implementation here
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    return { getTiktoks, likeVideo, createComment, newVideo, getComments };
};

export default useTiktok;
