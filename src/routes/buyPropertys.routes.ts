import express from "express";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { createBuyProperty,uploadBuyPropertyDocument,updateBuyProperty,deleteBuyProperty } from "../controllers/buyPropertys.controller";


const router = express.Router();

router.post('/upload', upload.array("buydocument"),uploadBuyPropertyDocument)
router.post('/create', createBuyProperty);


router.put('/update', updateBuyProperty);
router.delete('/delete', deleteBuyProperty);


export default router;
