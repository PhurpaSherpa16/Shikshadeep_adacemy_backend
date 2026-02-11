import { schoolService } from "../service/SchoolService.js";
import CatchAsync from "../utils/catchAsync.js";


// Get All notification
export const getAllNotificationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.getAllNotification(req)
    res.status(200).json({
        status: "success",
        message: "All notifications fetched successfully",
        data: result
    })
})

// Get single notification
export const getSingleNotificationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.getSingleNotification(req)
    res.status(200).json({
        status: "success",
        message: "Notification fetched successfully",
        data: result
    })
})

// Update notification
export const updateNotificationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.updateNotification(req)
    res.status(200).json({
        status: "success",
        message: "Notification updated successfully",
        data: result
    })
})

// Delete notification
export const deleteNotificationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.deleteNotification(req)
    res.status(200).json({
        status: "success",
        message: "Notification deleted successfully",
        data: result
    })
})

// Clear all notification
export const clearAllNotificationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.clearAllNotification()
    res.status(200).json({
        status: "success",
        message: "All notifications cleared successfully",
        data: result
    })
})