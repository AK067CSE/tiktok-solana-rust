// UploadModal.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/UploadModal.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { getProgramInstance } from '../utils/utils';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const UploadModal = ({
    description,
    videoUrl,
    setDescription,
    setVideoUrl,
    setNewVideoShow,
}) => {
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const { publicKey, sendTransaction, connected } = useWallet();
    
    const connection = new anchor.web3.Connection('https://solana-mainnet.rpcpool.com', 'confirmed');

    useEffect(() => {
        const initializeProgram = async () => {
            if (connected && publicKey) {
                try {
                    const programInstance = await getProgramInstance(connection, connected ? publicKey : null);
                    setProgram(programInstance);
                } catch (error) {
                    console.error('Error initializing program:', error);
                    alert('Failed to initialize program. Please make sure your wallet is connected.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        initializeProgram();
    }, [connected, publicKey]);

    const newVideo = async (description, videoUrl) => {
        if (!program || !publicKey) throw new Error('Program or wallet not initialized');

        const randomKey = anchor.web3.Keypair.generate().publicKey;
        let [videoPDA] = await anchor.web3.PublicKey.findProgramAddress(
            [anchor.utils.bytes.utf8.encode('video'), randomKey.toBuffer()],
            program.programId
        );

        const transaction = new anchor.web3.Transaction().add(
            program.instruction.createVideo(
                description,
                videoUrl,
                {
                    accounts: {
                        video: videoPDA,
                        authority: publicKey,
                        randomKey: randomKey,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    },
                }
            )
        );

        return transaction;
    };

    const handleNewVideo = async () => {
        if (!program) return alert('Program not initialized');
        if (!connected || !publicKey) return alert('Wallet not connected');

        try {
            setLoading(true);
            console.log('Starting video upload...');

            const transaction = await newVideo(description, videoUrl);

            if (transaction.instructions.length === 0) {
                console.error('Transaction has no instructions. Aborting.');
                throw new Error('Transaction has no instructions');
            }

            const txSignature = await sendTransaction(transaction, connection);

            console.log('Transaction Signature:', txSignature);

            const confirmation = await connection.confirmTransaction(txSignature, 'processed');
            console.log('Transaction confirmation:', confirmation);

            console.log('Transaction confirmed');

            alert('Video uploaded successfully!');
            setNewVideoShow(false);
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Failed to upload video');
        } finally {
            setLoading(false);
        }
    };

    const testTransaction = async () => {
        if (!publicKey || !connected) return alert('Wallet not connected');

        const transaction = new anchor.web3.Transaction().add(
            anchor.web3.SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: publicKey,
                lamports: 1000,
            })
        );

        try {
            const txSignature = await sendTransaction(transaction, connection);
            console.log('Test Transaction Signature:', txSignature);
            await connection.confirmTransaction(txSignature, 'processed');
            alert('Test Transaction Successful');
        } catch (error) {
            console.error('Error in test transaction:', error);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Upload New Video</div>
            <div className={styles.inputField}>
                <div className={styles.inputTitle}>Description</div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.inputField}>
                <div className={styles.inputTitle}>Video URL</div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type="text"
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.modalButtons}>
                <button
                    onClick={() => setNewVideoShow(false)}
                    className={`${styles.button} ${styles.cancelButton}`}
                >
                    Cancel
                </button>
                <button
                    onClick={handleNewVideo}
                    className={`${styles.button} ${styles.createButton}`}
                    disabled={loading || !program}
                >
                    Create
                </button>
                <button
                    onClick={testTransaction}
                    className={`${styles.button} ${styles.createButton}`}
                >
                    Test Transaction
                </button>
            </div>
            {loading && <p>Loading program...</p>}
        </div>
    );
};

export default UploadModal;
