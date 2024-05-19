import express from "express";
import { createAssignSellProperty,updateAssignSellProperty,deleteAssignSellProperty,getUserAssignSellProperty } from "../controllers/assignSellPropertys.controller";
import auth, { AdminAuth } from "../middlewares/auth";
const router = express.Router();

// import auth, { AdminAuth } from "./middlewares/auth";


router.post('/create',AdminAuth, createAssignSellProperty);
router.put('/update',AdminAuth, updateAssignSellProperty);
router.delete('/delete', AdminAuth,deleteAssignSellProperty);
router.get('/user/property',auth, getUserAssignSellProperty);


export default router;