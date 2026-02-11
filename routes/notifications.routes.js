import express from "express"
import { clearAllNotificationController, deleteNotificationController, getAllNotificationController, getSingleNotificationController, updateNotificationController} from "../controller/school.notificationcontroller.js"

const router = express.Router()

// GET
    // Get All notification
    router.get("/", getAllNotificationController)
    // Get single notification
    router.get("/:id", getSingleNotificationController)

// UPDATE
    // Update notification
    router.put("/update/:id", updateNotificationController)

// DELETE
    // Delete notification
    router.delete("/delete/:id", deleteNotificationController)
    // clear all notification
    router.delete("/clear", clearAllNotificationController)

export default router