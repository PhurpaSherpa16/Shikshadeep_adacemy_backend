import express from "express";
import multer from "multer";
import {postSubscriber, getAllSubscriber, getSingleSubscriber, deleteSubscriber} from "../controller/school.subscribercontroller.js";

const router = express.Router();
const upload = multer()

// CRUD query actions
    // Post query
    router.post("/post", upload.none(), postSubscriber)
//     // Delete query
    router.delete("/remove/:id", deleteSubscriber)


// // GET query actions
//     // Get all queries
        router.get("/", getAllSubscriber)
//     // Get single blog
        router.get("/:id", getSingleSubscriber)


export default router