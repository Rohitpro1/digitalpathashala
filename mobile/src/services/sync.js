import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { getToken } from './auth';
import Constants from 'expo-constants';

const SYNC_QUEUE_KEY = 'sync_queue';
const API_URL = Constants.expoConfig.extra.apiUrl;

// Add request to sync queue
export const addToSyncQueue = async (requestConfig) => {
  try {
    const queue = await getSyncQueue();
    const timestamp = Date.now();
    
    const queueItem = {
      id: `${timestamp}_${Math.random()}`,
      config: requestConfig,
      timestamp,
      retries: 0,
    };
    
    queue.push(queueItem);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    return true;
  } catch (error) {
    console.error('Error adding to sync queue:', error);
    return false;
  }
};

// Get sync queue
export const getSyncQueue = async () => {
  try {
    const queueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return queueData ? JSON.parse(queueData) : [];
  } catch (error) {
    console.error('Error getting sync queue:', error);
    return [];
  }
};

// Clear sync queue
export const clearSyncQueue = async () => {
  try {
    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing sync queue:', error);
    return false;
  }
};

// Process sync queue
export const processSyncQueue = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('No internet connection, skipping sync');
      return { success: false, reason: 'offline' };
    }

    const queue = await getSyncQueue();
    if (queue.length === 0) {
      return { success: true, count: 0 };
    }

    console.log(`Processing ${queue.length} queued requests`);
    const token = await getToken();
    let successCount = 0;
    let failedItems = [];

    for (const item of queue) {
      try {
        const config = {
          ...item.config,
          baseURL: API_URL,
          headers: {
            ...item.config.headers,
            Authorization: `Bearer ${token}`,
          },
        };

        await axios(config);
        successCount++;
      } catch (error) {
        console.error('Error syncing item:', error);
        item.retries++;
        
        // Keep in queue if retries < 3
        if (item.retries < 3) {
          failedItems.push(item);
        }
      }
    }

    // Update queue with failed items
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(failedItems));

    return {
      success: true,
      synced: successCount,
      failed: failedItems.length,
    };
  } catch (error) {
    console.error('Error processing sync queue:', error);
    return { success: false, error: error.message };
  }
};

// Start background sync listener
export const startSyncListener = () => {
  return NetInfo.addEventListener(state => {
    if (state.isConnected) {
      console.log('Connection restored, processing sync queue');
      processSyncQueue();
    }
  });
};
