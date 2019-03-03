import firebaseLib from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import helpers from './helpers';

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

        await firebaseLib.firestore().collection("users").doc(data.uid).set({ ...data, circles: [] });

        return { ...data, isNew: true, circles: [] }
    }
    catch (e) {
        throw e;
    }
}

const updateDocument = async (collection, document, data, merge) => {
    return firebaseLib.firestore().collection(collection).doc(document).set(data, { merge });
}

const updateUserCircle = async (document, data) => {
    return firebaseLib.firestore()
        .collection("users")
        .doc(document)
        .set(
            { circles: firebaseLib.firestore.FieldValue.arrayUnion(data) },
            { merge: true }
        );
}

const addDocument = async (collection, data) => {
    return firebaseLib.firestore().collection(collection).add(data)
}

const uploadImage = async (uri, uid, type) => {
    const format = helpers.extractFormatFromImageURI(uri);

    try {
        const blob = await helpers.makeBlobFromURI(uri);
        let path = `users/${uid}/${Date.now()}.${format}`;

        if (type === "service") {
            path = `users/${uid}/services/${Date.now()}.${format}`;
        }

        const documentRef = firebaseLib.storage().ref().child(path);

        await documentRef.put(blob);
        const url = await documentRef.getDownloadURL();

        return url;
    }
    catch (e) {
        throw e;
    }
}

const readCollection = async (collection) => {
    return firebaseLib.firestore().collection(collection).get();
}

const readDocument = async (collection, document, returnType) => {
    if (returnType === "data") {
        const response = await firebaseLib.firestore().collection(collection).doc(document).get();

        return response.data();
    }
    else {
        return firebaseLib.firestore().collection(collection).doc(document).get();
    }
}

const findCircle = (code) => {
    return firebaseLib.firestore().collection("circles").where("code", "==", code).get();
}

const updateLocationCircle = async (circleId, uid, data) => {
    return firebaseLib.firestore()
        .collection("locations")
        .doc(circleId)
        .collection("users")
        .doc(uid)
        .set(data)
}

export default {
    loginWithFacebook,
    createUser,
    updateDocument,
    updateUserCircle,
    addDocument,
    uploadImage,
    readCollection,
    readDocument,
    updateLocationCircle,
    findCircle
}