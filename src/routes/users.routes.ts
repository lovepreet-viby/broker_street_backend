import express from "express";
import {
    getUsers,
    userSignUp,
    resendUserOtp,
    userLogin,
    userDetail,
    updateUserDetail,
    userProfilePhoto,
    userProperty,
    validateSignupOtpAndCreateUser,
    validateLoginOtp,
} from "../controllers/users.controller";
import auth from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import fileUploadMiddleware from "../middlewares/blobUpload";

const router = express.Router();

router.get("/", getUsers);

// The upload middleware handles file uploads
router.post("/upload", upload.single("user"), userProfilePhoto);

// Define route for user sign up
router.post("/signup", userSignUp);

// Define route for checking user OTP and creating new user
router.post("/signupOtp", validateSignupOtpAndCreateUser);

router.post("/loginOtp", validateLoginOtp);

// Define route for resending user OTP
router.post("/resendOtp", resendUserOtp);

// Define route for user sign in
router.post("/signin", userLogin);

// Define route for getting user details
router.get("/detail", auth, userDetail);

// Define route for updating user details
router.put("/update", auth, updateUserDetail);

// Define route for getting user property details
router.get("/property", auth, userProperty);

// property api
router.get("/property", auth, userProperty);

export default router;
