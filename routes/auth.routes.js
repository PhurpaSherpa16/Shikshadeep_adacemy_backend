import express from "express"
import { signup, signin, logout } from "../controller/auth.controller.js"
import multer from "multer"

const router = express.Router()
const upload = multer()

router.post("/signup", upload.none(), signup)
router.post("/signin", upload.none(), signin)
router.post("/logout", upload.none(), logout)

export default router