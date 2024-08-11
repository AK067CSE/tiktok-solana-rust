import React, { useState } from 'react';
import styles from '../styles/Signup.module.css';
import { useWallet } from '@solana/wallet-adapter-react';

const Signup = ({ signup, onSignupSuccess }) => {
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { connected } = useWallet();

    const signUpClicked = async () => {
        if (!connected) {
            setError('Wallet not connected. Please connect your wallet.');
            return;
        }

        if (!username || !profileImage) {
            setError('All fields are required.');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            console.log("SIGNING UP!");
            // Update this line to match the expected parameters
            await signup(username, profileImage);
            if (onSignupSuccess) {
                onSignupSuccess();
            }
        } catch (error) {
            setError('Failed to sign up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.title}>Sign up to use TikTok</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.signupForm}>
                <div className={styles.inputField}>
                    <div className={styles.inputTitle}>Username</div>
                    <div className={styles.inputContainer}>
                        <input
                            className={styles.input}
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                </div>
                <div className={styles.inputField}>
                    <div className={styles.inputTitle}>Profile Image URL</div>
                    <div className={styles.inputContainer}>
                        <input
                            className={styles.input}
                            type="text"
                            value={profileImage}
                            onChange={e => setProfileImage(e.target.value)}
                            placeholder="Enter image URL"
                        />
                    </div>
                </div>
            </div>
            <div 
                className={`${styles.loginButton} ${loading ? styles.loading : ''}`}
                onClick={signUpClicked}
                disabled={loading}
            >
                {loading ? 'Signing up...' : 'Sign up'}
            </div>
        </div>
    );
};

export default Signup;
