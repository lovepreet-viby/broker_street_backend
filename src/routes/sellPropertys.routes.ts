import express from "express";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { createSellProperty,getAllSellProperty,getSellProperty,uploadSellPropertyDocument,
    updateSellProperty,deleteSellProperty,getAllUserSellProperty ,
    getAllSellPropertyWithUserDetail

} from "../controllers/sellPropertys.controller";

const router = express.Router();


// Define route for uploading sell property documents
router.post('/upload', upload.array("selldocument"),uploadSellPropertyDocument)

// Define route for creating a new sell property
router.post('/create', createSellProperty);

// Define route for getting all sell properties
router.get('/all/sellproperty', getAllSellProperty); // sell proposal list

// Define route for updating a sell property
router.put('/update', updateSellProperty);

// Define route for deleting a sell property
router.delete('/delete', deleteSellProperty);

// Define route for getting sell property details by ID
router.get('/detail',getSellProperty) // sell proposal detail by id

// Define route for getting all sell properties by user ID
router.get('/all/user',getAllUserSellProperty) // sell proposal list acc to user id  

// Define route for getting all sell properties with user details
router.get('/all/sellproposal/userdetail',getAllSellPropertyWithUserDetail) // sell proposal detail with user detail 


export default router;
