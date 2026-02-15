import express from "express";
import multer from "multer";
import { postProgram, updateProgram, deleteProgram, updateDisplayOrder } from "../controller/school.programCRUDcontroller.js";
import { getAllPrograms, getSingleProgram } from "../controller/school.programGETcontroller.js";

import { uploadProgramImage } from "../utils/multer.js";

const router = express.Router();

// CRUD program actions
router.post('/program_post', uploadProgramImage, postProgram)
router.put('/program_update/:id', uploadProgramImage, updateProgram)
router.delete('/program_delete/:id', deleteProgram)
router.put('/program_update_display_order', updateDisplayOrder)

// GET program actions
router.get("/", getAllPrograms)
router.get("/:id", getSingleProgram)

export default router
