import React, { useRef, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import styles from '../styles/Video.module.css';
import Comments from './Comments';
import { getProgramInstance } from '../utils/utils';
import { SOLANA_HOST } from '../utils/const'; // Import your SOLANA_HOST constant

const Video = ({
    address,
    url,
    channel,
    description,
    index,
    likes,
    shares,
    likeVideo,
    likesAddress,
    createComment,
    getComments,
    commentCount,
}) => {
    const [playing, setPlaying] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const videoRef = useRef(null);
    const { publicKey, connected, sendTransaction } = useWallet();
    const [program, setProgram] = useState(null);
    const connection = new anchor.web3.Connection(SOLANA_HOST, 'confirmed'); // Use your custom RPC endpoint

    useEffect(() => {
        const initializeProgram = async () => {
            if (connected && publicKey) {
                try {
                    const programInstance = getProgramInstance(connection, { publicKey, sendTransaction });
                    setProgram(programInstance);
                } catch (error) {
                    console.error('Error initializing program:', error);
                    alert('Failed to initialize program');
                }
            }
        };

        initializeProgram();
    }, [connected, publicKey]);

    const onVideoPress = () => {
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play();
            setPlaying(true);
        }
    };

    const hideComments = () => {
        setShowCommentsModal(false);
    };

    const showComments = () => {
        setShowCommentsModal(true);
    };

    const handleLikeVideo = async () => {
        if (!program) return alert('Program not initialized');
        if (!connected || !publicKey) return alert('Wallet not connected');

        try {
            console.log('Starting like video transaction...');
            const txId = await likeVideo(address);
            console.log('Transaction ID:', txId);
            alert('Video liked successfully!');
        } catch (error) {
            console.error('Error liking video:', error);
            alert('Failed to like video');
        }
    };

    const handleCreateComment = async (comment) => {
        if (!program) return alert('Program not initialized');
        if (!connected || !publicKey) return alert('Wallet not connected');

        try {
            console.log('Starting create comment transaction...');
            const txId = await createComment(address, commentCount, comment);
            console.log('Transaction ID:', txId);
            alert('Comment created successfully!');
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Failed to create comment');
        }
    };

    return (
        <div className={styles.wrapper}>
            <video
                className={styles.videoPlayer}
                loop
                onClick={onVideoPress}
                ref={videoRef}
                src={url}
                style={{ objectFit: 'cover' }}
            />
            <div className={styles.sidebar}>
                <button onClick={handleLikeVideo}>Like</button>
                <button onClick={showComments}>Comments</button>
            </div>

            {showCommentsModal && (
                <Comments
                    hideComments={hideComments}
                    handleCreateComment={handleCreateComment}
                    getComments={getComments}
                    index={index}
                />
            )}
        </div>
    );
};

export default Video;
