import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const STORE_REVIEW_PROMPTED_KEY = 'storeReviewPrompted';
const FIRST_QR_CODE_CREATED_KEY = 'firstQRCodeCreated';

export const checkAndRequestStoreReview = async () => {
  try {
    const hasBeenPrompted = await AsyncStorage.getItem(STORE_REVIEW_PROMPTED_KEY);
    const hasCreatedFirstQRCode = await AsyncStorage.getItem(FIRST_QR_CODE_CREATED_KEY);
    
    if (!hasCreatedFirstQRCode) {
      await AsyncStorage.setItem(FIRST_QR_CODE_CREATED_KEY, 'true');
      
      if (hasBeenPrompted !== 'true') {
        const hasAction = await StoreReview.hasAction();
        
        if (hasAction) {
          setTimeout(async () => {
            await StoreReview.requestReview();
            await AsyncStorage.setItem(STORE_REVIEW_PROMPTED_KEY, 'true');
          }, 2000);
        }
      }
    }
  } catch (error) {
    // Silent fail
  }
};