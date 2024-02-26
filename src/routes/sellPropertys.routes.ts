import express from "express";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { createSellProperty,getSellProperty,uploadSellPropertyDocument} from "../controllers/sellPropertys.controller";

const router = express.Router();



router.post('/upload', upload.array("selldocument"),uploadSellPropertyDocument)

router.post('/create', createSellProperty);
router.get('/detail', getSellProperty);


// router.put('/update', createSellProperty);
// router.put('/delete', createSellProperty);


export default router;
