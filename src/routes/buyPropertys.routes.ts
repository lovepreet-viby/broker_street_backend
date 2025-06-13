import express from "express";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import { createBuyProperty,uploadBuyPropertyDocument,updateBuyProperty,deleteBuyProperty,getBuyProperty,
    getBuyAllProperty,getAllUserBuyProperty } from "../controllers/buyPropertys.controller";


const router = express.Router();

// Define route for uploading buy property documents
router.post('/upload', upload.array("buydocument"),uploadBuyPropertyDocument)

// Define route for creating a new buy property
router.post('/create', createBuyProperty);

// Define route for updating a buy property
router.put('/update', updateBuyProperty);

// Define route for deleting a buy property
router.delete('/delete', deleteBuyProperty);

// Define route for getting all buy properties with user details 
router.get('/all/buyproperty',getBuyAllProperty) // buy proposal detail with user detail 

// Define route for getting buy property details by ID
router.get('/detail',getBuyProperty) // buy proposal in detail 

// Define route for getting all buy properties by user ID
router.get('/all/user',getAllUserBuyProperty) // buy proposal acc to userID



export default router;
