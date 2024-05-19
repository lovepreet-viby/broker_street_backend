import express from "express";
import { createAssignBuyProperty,updateAssignBuyProperty,deleteAssignBuyProperty,getUserAssignBuyProperty } from "../controllers/assignBuyPropertys.controller";
import auth, { AdminAuth } from "../middlewares/auth";
const router = express.Router();

// import auth, { AdminAuth } from "./middlewares/auth";


router.post('/create',AdminAuth, createAssignBuyProperty);
router.put('/update',AdminAuth, updateAssignBuyProperty);
router.delete('/delete', AdminAuth,deleteAssignBuyProperty);
router.get('/user/property',auth, getUserAssignBuyProperty);


export default router;