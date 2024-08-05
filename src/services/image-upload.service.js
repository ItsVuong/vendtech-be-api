const config = require('../configs/firebase.config');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } = require('firebase/storage');

//intialize a firebase application
initializeApp(config.firebaseConfig);

//Initialize Cloud storage
const storage = getStorage();

async function uploadImage(file) {
    try {
        const dateTime = giveCurrentDateTime();
        const saveName = dateTime + "_" + (file.originalname);
        const storageRef = ref(storage, 'files/' + saveName);
    
        const metadata = {
            contentType: file.mimetype
        };
    
        //upload file 
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
    
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File upload succesfully');
        return {
            name: saveName,
            type: file.mimetype,
            url: downloadURL
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function deleteImage(imageName){
        const storageRef = ref(storage, 'files/' + imageName);
        return await deleteObject(storageRef);
}

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
    const dateTime = date + '_' + time;
    return dateTime;
}

module.exports = {
    uploadImage,
    deleteImage
}