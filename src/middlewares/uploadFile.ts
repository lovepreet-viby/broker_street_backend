import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { error } from 'console';

function getDynamicPath(fieldName: string) {

  switch (fieldName) {
    case 'user':
      return './uploads/userimage'
    case 'selldocument':
      return './uploads/sellPropertyDocument'
    case 'buydocument':
      return './uploads/buyPropertyDocument'
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
  const extname = path.extname(file.originalname).toLowerCase();

  if (file.fieldname == 'user') {
    const validImageTypes = /jpg|png|jpeg|svg/;
    if (validImageTypes.test(extname)) {
      cb(null, true);
    } else {
      // cb(error('Error: Unsupported image file type!') as any, false);
      const errorMessage = 'Error: Unsupported image file type!';
      cb(error(errorMessage) as any, false);
      (req as any).errorMessage = errorMessage;
    }
  } else if (file.fieldname == 'selldocument') {
    const validDocumentTypes = /pdf|docx/;
    const validImageTypes = /jpg|png|jpeg|svg/;

    if (validDocumentTypes.test(extname) || validImageTypes.test(extname)) {
      cb(null, true);
    } else {
      const errorMessage = 'Error: Unsupported document file type!';
      cb(error(errorMessage) as any, false);
      (req as any).errorMessage = errorMessage;
    }
  } else if (file.fieldname === 'buydocument') { // Using 'buyDocument' condition for audio files
    const validAudioTypes = /mp3|wav|ogg/; // Define valid audio types

    if (validAudioTypes.test(extname)) {
      cb(null, true);
    } else {
      const errorMessage = 'Error: Unsupported audio file type!';
      cb(error(errorMessage) as any, false);
      (req as any).errorMessage = errorMessage;
    }
  }
  else {
    cb(error('Error: Unsupported file type!') as any, false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export default upload;
