import express from "express";
import { createAssignSellProperty,updateAssignSellProperty,deleteAssignSellProperty,getUserAssignSellProperty } from "../controllers/assignSellPropertys.controller";
import auth, { AdminAuth } from "../middlewares/auth";
const router = express.Router();

// import auth, { AdminAuth } from "./middlewares/auth";


// Route to create a new assigned sell property, accessible only by admins
router.post('/create',AdminAuth, createAssignSellProperty);

// Route to update an assigned sell property, accessible only by admins
router.put('/update',AdminAuth, updateAssignSellProperty);

// Route to delete an assigned sell property, accessible only by admins
router.delete('/delete', AdminAuth,deleteAssignSellProperty);

// Route to get user-specific assigned sell properties, accessible by authenticated users
router.get('/user/property',auth, getUserAssignSellProperty);


export default router;