// MainView.js
import React, { useEffect, useState } from 'react';
import UploadModal from './UploadModal';
import Video from './Video';
import BottomBar from './BottomBar';
import styles from '../styles/MainView.module.css';
import Signup from './Signup';
import { useWallet } from '@solana/wallet-adapter-react';
import { SOLANA_HOST } from '../utils/const';
import { getProgramInstance, TOKEN_PROGRAM_ID } from '../utils/utils';
import useAccount from '../hooks/useAccount';
import useTiktok from '../hooks/useTiktok';

const anchor = require('@project-serum/anchor');
const utf8 = anchor.utils.bytes.utf8;
const { BN, web3 } = anchor;
const { SystemProgram } = web3;

const MainView = () => {
    const [isAccount, setAccount] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { publicKey, connected } = useWallet();
    const [program, setProgram] = useState(null);
    const [tiktoks, setTikToks] = useState([]);
    const [newVideoShow, setNewVideoShow] = useState(false);
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [userDetail, setUserDetail] = useState(null);
    const { signup } = useAccount();
    const { getTiktoks, likeVideo, createComment, newVideo, getComments } = useTiktok(
        setTikToks,
        userDetail,
        videoUrl,
        description,
        setDescription,
        setVideoUrl,
        setNewVideoShow,
    );

    useEffect(() => {
        const fetchData = async () => {
            if (connected && publicKey) {
                try {
                    const programInstance = await getProgramInstance(new anchor.web3.Connection(SOLANA_HOST), publicKey);
                    setProgram(programInstance);
                    
                    await checkAccount(programInstance);
                    await getTiktoks();
                } catch (e) {
                    setError('Failed to fetch data');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchData();
    }, [connected, publicKey]);

    const checkAccount = async (programInstance) => {
        try {
            const [userPda] = await anchor.web3.PublicKey.findProgramAddress(
                [utf8.encode('user'), publicKey.toBuffer()],
                programInstance.programId,
            );
            const userInfo = await programInstance.account.userAccount.fetch(userPda);
            console.log(userInfo);
            setUserDetail(userInfo);
            setAccount(true);
        } catch (e) {
            setAccount(false);
        }
    };

    const handleError = (message) => {
        console.error(message);
        setError(message);
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {isAccount ? (
                <div>
                    {newVideoShow && (
                        <UploadModal 
                            description={description}
                            videoUrl={videoUrl}
                            newVideo={newVideo}
                            setDescription={setDescription}
                            setVideoUrl={setVideoUrl}
                            setNewVideoShow={setNewVideoShow}
                        />
                    )}
                    <div className={styles.appVideos}>
                        {tiktoks.length === 0 ? (
                            <h1>No Videos</h1>
                        ) : (
                            tiktoks.map((tiktok, id) => (
                                <Video 
                                    key={id} 
                                    address={tiktok.publicKey.toBase58()}
                                    url={tiktok.account.videoUrl} 
                                    channel={tiktok.account.creatorName}
                                    index={tiktok.account.index.toNumber()}
                                    likes={tiktok.account.likes}
                                    description={tiktok.account.description}
                                    likeVideo={likeVideo}
                                    likesAddress={tiktok.account.peopleWhoLiked}
                                    createComment={createComment}
                                    getComments={getComments}
                                    commentCount={tiktok.account.commentCount.toNumber()}
                                />
                            ))
                        )}
                    </div>
                    <BottomBar 
                        setNewVideoShow={setNewVideoShow}
                        getTiktoks={getTiktoks}
                    />
                </div>
            ) : (
                <Signup signup={signup} wallet={publicKey ? publicKey.toBase58() : ''} />
            )}
        </div>
    );
};

export default MainView;
