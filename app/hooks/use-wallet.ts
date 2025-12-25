'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';

interface Wallet {
  publicKey: PublicKey | null;
  connected: boolean;
}

// Extend Window interface for Solana wallet
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      publicKey?: PublicKey | null;
      isConnected: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: (args: any) => void) => void;
      removeListener: (event: string, callback: (args: any) => void) => void;
    };
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>({
    publicKey: null,
    connected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const isPhantomInstalled = typeof window !== 'undefined' && !!window.solana?.isPhantom;

  const connect = useCallback(async () => {
    if (!window.solana) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      const response = await window.solana.connect();
      setWallet({
        publicKey: response.publicKey,
        connected: true,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (window.solana) {
      try {
        await window.solana.disconnect();
        setWallet({
          publicKey: null,
          connected: false,
        });
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.solana) {
      return;
    }

    // Check if already connected
    if (window.solana.isConnected && window.solana.publicKey) {
      setWallet({
        publicKey: window.solana.publicKey,
        connected: true,
      });
    }

    // Listen for account changes
    const handleAccountChange = (publicKey: PublicKey | null) => {
      if (publicKey) {
        setWallet({
          publicKey: publicKey instanceof PublicKey ? publicKey : new PublicKey(publicKey),
          connected: true,
        });
      } else {
        setWallet({
          publicKey: null,
          connected: false,
        });
      }
    };

    window.solana.on('accountChanged', handleAccountChange);

    // Listen for disconnect
    const handleDisconnect = () => {
      setWallet({
        publicKey: null,
        connected: false,
      });
    };

    window.solana.on('disconnect', handleDisconnect);

    return () => {
      if (window.solana) {
        window.solana.removeListener('accountChanged', handleAccountChange);
        window.solana.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  return {
    wallet,
    connect,
    disconnect,
    isConnecting,
    isPhantomInstalled,
  };
}

