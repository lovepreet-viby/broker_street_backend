import express from "express";
import {
    getUsers,
    userSignUp,
    checkUserOtp,
    resendUserOtp,
    userLogin,
    userDetail,
    updateUserDetail,
    userProfilePhoto,
    userProperty
} from "../controllers/users.controller";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";

const router = express.Router();

router.get("/", getUsers);


router.post('/upload',upload.single("user"), userProfilePhoto)
router.post('/signup', userSignUp);
router.post('/checkOtp', checkUserOtp);
router.post('/resendOtp', resendUserOtp);
router.post("/signin", userLogin);
router.get("/detail", userDetail);
router.put("/update", updateUserDetail); 


// property api 
router.get("/property", userProperty)



export default router;
