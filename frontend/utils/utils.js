import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { TIKTOK_IDL, TIKTOK_PROGRAM_ID } from './const';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

export function getProgramInstance(connection, wallet) {
    if (!connection) {
        throw new Error("Connection object is not provided or invalid.");
    }

    if (!wallet || !wallet.publicKey) {
        throw new WalletNotConnectedError();
    }

    try {
        const provider = new anchor.AnchorProvider(
            connection,
            wallet,
            anchor.AnchorProvider.defaultOptions()
        );

        const idl = TIKTOK_IDL;
        const programId = TIKTOK_PROGRAM_ID;

        const program = new anchor.Program(idl, programId, provider);

        return program;
    } catch (error) {
        console.error("Failed to create the program instance:", error);
        throw error;
    }
}

const MainView = () => {
    const { wallet, connected, publicKey } = useWallet();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

    useEffect(() => {
        const fetchProgramInstance = async () => {
            if (connected && publicKey) {
                try {
                    const programInstance = getProgramInstance(connection, wallet);
                    setProgram(programInstance);
                    setError(null); // Clear any previous errors
                } catch (error) {
                    console.error("Error getting program instance:", error);
                    setError('Failed to initialize the program.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                if (!connected) {
                    setError('Please connect your wallet.');
                }
            }
        };

        fetchProgramInstance();
    }, [connected, publicKey, wallet]);

    if (!connected) {
        return <div>Please connect your wallet</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {/* Render your main view here */}
            {program ? <p>Program initialized successfully</p> : <p>Initializing program...</p>}
        </div>
    );
};

export default MainView;
