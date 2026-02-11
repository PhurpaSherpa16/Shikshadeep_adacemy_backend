import * as signUp from './auth/SignUp.js';
import * as signIn from './auth/SignIn.js';
import * as signOut from './auth/SignOut.js';
import * as updateProfile from './auth/UpdateProfile.js';

export const authService = {
    ...signUp,
    ...signIn,
    ...signOut,
    ...updateProfile,
};

