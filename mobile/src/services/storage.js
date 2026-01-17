import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  LESSONS: 'offline_lessons',
  MODULES: 'offline_modules',
  ASSIGNMENTS: 'offline_assignments',
  PROGRESS: 'offline_progress',
  LANGUAGE: 'app_language',
};

// Generic storage functions
export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
};

// Lessons storage
export const saveLessons = (lessons) => saveData(KEYS.LESSONS, lessons);
export const getLessons = () => getData(KEYS.LESSONS);

// Modules storage
export const saveModules = (modules) => saveData(KEYS.MODULES, modules);
export const getModules = () => getData(KEYS.MODULES);

// Assignments storage
export const saveAssignments = (assignments) => saveData(KEYS.ASSIGNMENTS, assignments);
export const getAssignments = () => getData(KEYS.ASSIGNMENTS);

// Progress storage
export const saveProgress = (progress) => saveData(KEYS.PROGRESS, progress);
export const getProgress = () => getData(KEYS.PROGRESS);

// Language storage
export const saveLanguage = (language) => saveData(KEYS.LANGUAGE, language);
export const getLanguage = async () => {
  const language = await getData(KEYS.LANGUAGE);
  return language || 'english';
};

// Clear all offline data
export const clearOfflineData = async () => {
  await removeData(KEYS.LESSONS);
  await removeData(KEYS.MODULES);
  await removeData(KEYS.ASSIGNMENTS);
  await removeData(KEYS.PROGRESS);
};
