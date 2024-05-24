import express from "express";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { createSellProperty,getAllSellProperty,getSellProperty,uploadSellPropertyDocument,
    updateSellProperty,deleteSellProperty,getAllUserSellProperty ,
    getAllSellPropertyWithUserDetail

} from "../controllers/sellPropertys.controller";

const router = express.Router();



router.post('/upload', upload.array("selldocument"),uploadSellPropertyDocument)
router.post('/create', createSellProperty);
router.get('/all/sellproperty', getAllSellProperty); // sell proposal list
router.put('/update', updateSellProperty);
router.delete('/delete', deleteSellProperty);

router.get('/detail',getSellProperty) // sell proposal detail by id
router.get('/all/user',getAllUserSellProperty) // sell proposal list acc to user id  
router.get('/all/sellproposal/userdetail',getAllSellPropertyWithUserDetail) // sell proposal detail with user detail 


export default router;
