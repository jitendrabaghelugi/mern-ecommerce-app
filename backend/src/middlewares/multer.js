import multer from 'multer'

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage: storage }).single('profilePic');

export const multipleUpload = multer({ storage: storage }).array('productImg', 5);

