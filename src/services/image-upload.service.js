const config = require('../configs/firebase.config');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } = require('firebase/storage');
const { HttpException } = require('../exceptions/exception');

//intialize a firebase application
initializeApp(config.firebaseConfig);

//Initialize Cloud storage
const storage = getStorage();

async function uploadImage(file) {
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
}

async function deleteImage(imageName) {
    try {
        const storageRef = ref(storage, 'files/' + imageName);
        const result = await deleteObject(storageRef);
        console.log("/n Delete image result /n" + result);
        return result;
    } catch (error) {
        console.log(error);
    }
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