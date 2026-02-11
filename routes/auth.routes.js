import express from "express"
import { signup, signin, logout, updateProfile } from "../controller/auth.controller.js"
import multer from "multer"
import { uploadImage } from "../utils/multer.js"

const router = express.Router()
const upload = multer()

router.post("/signup", upload.none(), signup)
router.post("/signin", upload.none(), signin)
router.post("/logout", upload.none(), logout)
router.put("/update/:id", uploadImage, updateProfile)

export default router