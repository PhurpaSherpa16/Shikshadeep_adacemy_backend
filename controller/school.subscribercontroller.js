import { schoolService } from "../service/SchoolService.js";
import CatchAsync from "../utils/catchAsync.js";

export const postSubscriber = CatchAsync(async (req, res, next) => {
    try {
        const result = await schoolService.postSubscriber(req)
        res.status(201).json({
            success: true,
            message: "Subscriber created successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
})

export const getAllSubscriber = CatchAsync(async (req, res, next) => {
    try {
        const result = await schoolService.getAllSubscriber(req)
        res.status(200).json({
            success: true,
            message: "Subscribers fetched successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
})

export const deleteSubscriber = CatchAsync(async (req, res, next) => {
    try {
        const result = await schoolService.deleteSubscriber(req)
        res.status(200).json({
            success: true,
            message: "Subscriber deleted successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
})

export const getSingleSubscriber = CatchAsync(async (req, res, next) => {
    try {
        const result = await schoolService.getSingleSubscriber(req)
        res.status(200).json({
            success: true,
            message: "Subscriber fetched successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
})
