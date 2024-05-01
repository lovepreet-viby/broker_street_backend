import express from "express";
import { createAssignProperty,updateAssignProperty,deleteAssignProperty,getUserAssignProperty } from "../controllers/assignPropertys.controller";
import auth, { AdminAuth } from "../middlewares/auth";
const router = express.Router();

// import auth, { AdminAuth } from "./middlewares/auth";


router.post('/create',AdminAuth, createAssignProperty);
router.put('/update',AdminAuth, updateAssignProperty);
router.delete('/delete', AdminAuth,deleteAssignProperty);
router.get('/user/property',auth, getUserAssignProperty);


export default router;