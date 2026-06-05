import AsyncStorage from '@react-native-async-storage/async-storage';

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function ensureUserId(): Promise<string> {
  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    userId = uuidv4();
    await AsyncStorage.setItem('userId', userId);
  }
  return userId;
}
