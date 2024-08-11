import React from 'react';
import MainView from '../components/MainView';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="app">
      {connected ? (
        <MainView />
      ) : (
        <div className="login-container">
          <div className="login-title">Log in to TikTok</div>
          <div className="login-subtitle">
            Manage your account, check notifications, comment on videos, and more
          </div>
          <WalletMultiButton />
        </div>
      )}
    </div>
  );
}
