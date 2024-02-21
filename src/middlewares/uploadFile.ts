import { Request } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { error } from 'console';

function getDynamicPath(fieldName: string) {

  switch (fieldName) {
    case 'user':
      return './uploads/userimage'
    case 'document':
        return './uploads/sellPropertyDocument'
    default:
      return './uploads/default';
  }
}

const multerStorage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Extract the dynamic directory path based on file.fieldname
    const dynamicPath = getDynamicPath(file.fieldname);
    fs.mkdirSync(dynamicPath, { recursive: true });
    cb(null, dynamicPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + uuidv4() + path.extname(file.originalname));
  },
});

const multerFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const validFileTypes = /jpg|png|jpeg|svg/;
  const extname = validFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname === true) {
    cb(null, true);
  } else {
    cb(error('Error: Image Only!') as any, false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export default upload;
