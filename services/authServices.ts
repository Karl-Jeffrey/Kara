// services/authService.ts
import auth from '@react-native-firebase/auth';

/**
 * Sign up a new user with email and password.
 */
export const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    console.log('User signed up successfully!', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

/**
 * Log in an existing user with email and password.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    console.log('User logged in successfully!', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};
