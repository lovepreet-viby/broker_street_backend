import express from "express";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { createBuyProperty,uploadBuyPropertyDocument,updateBuyProperty,deleteBuyProperty,getBuyProperty,
    getBuyAllProperty,getAllUserBuyProperty } from "../controllers/buyPropertys.controller";


const router = express.Router();

router.post('/upload', upload.array("buydocument"),uploadBuyPropertyDocument)
router.post('/create', createBuyProperty);
router.put('/update', updateBuyProperty);
router.delete('/delete', deleteBuyProperty);


router.get('/all/buyproperty',getBuyAllProperty)
router.get('/detail',getBuyProperty)

router.get('/all/user',getAllUserBuyProperty)



export default router;
