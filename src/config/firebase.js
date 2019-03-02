import firebaseLib from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import keys from './keys';

firebaseLib.initializeApp(keys.firebaseConfig);

const loginWithFacebook = async (token) => {
    const credential = firebaseLib.auth.FacebookAuthProvider.credential(token);

    try {
        const response = await firebaseLib.auth().signInAndRetrieveDataWithCredential(credential);

        const user = {
            uid: response.user.uid,
            email: response.additionalUserInfo.profile.email,
            name: response.additionalUserInfo.profile.name,
            firstName: response.additionalUserInfo.profile.first_name,
            lastName: response.additionalUserInfo.profile.last_name,
            facebookId: response.additionalUserInfo.profile.id,
            profilePicture: `${response.user.photoURL}?type=large`
        }

        const userData = await createUser(user);

        return userData;
    }
    catch (e) {
        throw e;
    }
}

const createUser = async (data) => {
    try {
        const response = await firebaseLib.firestore().collection("users").doc(data.uid).get();

        if (response.exists) {
            return response.data();
        }

        await firebaseLib.firestore().collection("users").doc(data.uid).set(data);

        return { ...data, isNew: true }
    }
    catch (e) {
        throw e;
    }
}

export default {
    loginWithFacebook,
    createUser
}