import express from "express";
import { createAssignProperty,updateAssignProperty,deleteAssignProperty,getUserAssignProperty } from "../controllers/assignPropertys.controller";
const router = express.Router();

router.post('/create', createAssignProperty);
router.put('/update', updateAssignProperty);
router.delete('/delete', deleteAssignProperty);
router.get('/user/property', getUserAssignProperty);


export default router;