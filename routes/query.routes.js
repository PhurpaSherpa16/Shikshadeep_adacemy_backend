import express from "express";
import { deleteQuery, getAllQuery, getSingleQuery, postQuery } from "../controller/school.querycontroller.js";
import multer from "multer";

const router = express.Router();
const upload = multer()

// CRUD query actions
    // Post query
    router.post("/post", upload.none(), postQuery)
    // Delete query
    router.delete("/remove/:id", deleteQuery)


// GET query actions
    // Get all queries
    router.get("/", getAllQuery)
    // Get single blog
    router.get("/:id", getSingleQuery)


export default router