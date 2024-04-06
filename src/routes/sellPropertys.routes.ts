import express from "express";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { createSellProperty,getAllSellProperty,getSellProperty,uploadSellPropertyDocument,updateSellProperty,deleteSellProperty} from "../controllers/sellPropertys.controller";

const router = express.Router();



router.post('/upload', upload.array("selldocument"),uploadSellPropertyDocument)
router.post('/create', createSellProperty);
router.get('/all/list', getAllSellProperty);
router.put('/update', updateSellProperty);
router.delete('/delete', deleteSellProperty);


router.get('/detail',getSellProperty)

export default router;
