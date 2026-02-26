import express from 'express'
import { uploadImage } from '../utils/multer.js'
import { getProfile, updateProfile } from '../controller/user.controller.js'

const router = express.Router()

router.get('/:id', getProfile)
router.put('/update/:id', uploadImage, updateProfile)

export default router