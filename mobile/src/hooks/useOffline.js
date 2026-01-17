import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { startSyncListener, processSyncQueue } from '../services/sync';

export const useOffline = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Check initial connection
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      
      // Auto-sync when connection is restored
      if (state.isConnected) {
        handleSync();
      }
    });

    // Start sync listener
    const syncUnsubscribe = startSyncListener();

    return () => {
      unsubscribe();
      if (syncUnsubscribe) syncUnsubscribe();
    };
  }, []);

  const handleSync = async () => {
    if (!isConnected) {
      return { success: false, reason: 'No internet connection' };
    }

    setIsSyncing(true);
    try {
      const result = await processSyncQueue();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isConnected,
    isOffline: !isConnected,
    isSyncing,
    sync: handleSync,
  };
};
