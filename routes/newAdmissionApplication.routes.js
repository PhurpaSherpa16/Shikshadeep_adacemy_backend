import express from "express"
import multer from "multer"
import { postStudentApplicationController, getAllStudentApplicationController, getSingleStudentApplicationController, deleteStudentApplicationController } from "../controller/student.newAdmissioncontroller.js"

const router = express.Router()
const upload = multer()

// POST
    // New admission application
    router.post("/new", upload.none(), postStudentApplicationController)

// DELETE
    // Delete admission application
    router.delete("/remove/:id", deleteStudentApplicationController)




// GET
    // All admission applications
    router.get("/applications", getAllStudentApplicationController)

    // Single admission application
    router.get("/application/:id", getSingleStudentApplicationController)

export default router