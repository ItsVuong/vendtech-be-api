const multer = require('multer');
const express = require('express');
const config = require('../configs/firebase.config');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');

const router = express.Router();

//intialize a firebase application
initializeApp(config.firebaseConfig);

//Initialize Cloud storage
const storage = getStorage();

//middleware for uploading image
const upload = multer({ storage: multer.memoryStorage() });

router.post("/img", upload.single("filename"), async (req, res) => {
    try {
        const dateTime = giveCurrentDateTime();
        const storageRef = ref(storage, 'files/' + (req.file.originalname) + "_" + dateTime);

        const metadata = {
            contentType: req.file.mimetype
        };

        //upload file 
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File upload succesfully');
        return res.send({
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        });
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
});

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

module.exports = router