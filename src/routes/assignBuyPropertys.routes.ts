import express from "express";
import { createAssignBuyProperty,updateAssignBuyProperty,deleteAssignBuyProperty,getUserAssignBuyProperty } from "../controllers/assignBuyPropertys.controller";
import auth, { AdminAuth } from "../middlewares/auth";
const router = express.Router();

// import auth, { AdminAuth } from "./middlewares/auth";


// Route to create assigned buy property, accessible only to admins
router.post('/create',AdminAuth, createAssignBuyProperty);

// Route to update assigned buy property, accessible only to admins
router.put('/update',AdminAuth, updateAssignBuyProperty);

// Route to delete assigned buy property, accessible only to admins
router.delete('/delete', AdminAuth,deleteAssignBuyProperty);

// Route to get user-specific assigned buy property, accessible to authenticated users
router.get('/user/property',auth, getUserAssignBuyProperty);


export default router;