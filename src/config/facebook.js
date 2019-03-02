import { Facebook } from 'expo';

import firebase from './firebase';

import keys from './keys';

const loginWithFacebook = async () => {
    try {
        const response = await Facebook.logInWithReadPermissionsAsync(keys.facebookAppId, {
            permissions: ['public_profile', 'email'],
        });

        const { type, token } = response;

        if (type === 'success') {
            return firebase.loginWithFacebook(token);
        }
        else {
            throw { message: "You cannot login since you cancelled!" }
        }
    }
    catch (error) {
        throw error
    }
}

const facebook = {
    loginWithFacebook,
}

export default facebook;