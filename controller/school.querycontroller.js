import { schoolService } from "../service/SchoolService.js";
import CatchAsync from "../utils/catchAsync.js";

// Post query
export const postQuery = CatchAsync(async (req, res) => {
    const result = await schoolService.postQuery(req)
    res.status(200).json({
        success: true,
        message: "Query posted successfully",
        data: result
    })
})

// Delete query
export const deleteQuery = CatchAsync(async (req, res) => {
    const result = await schoolService.deleteQuery(req)
    res.status(200).json({
        success: true,
        message: "Query deleted successfully",
        data: result
    })
})

// Get all queries
export const getAllQuery = CatchAsync(async (req, res) => {
    const result = await schoolService.getAllQuery(req)
    res.status(200).json({
        success: true,
        message: "All queries fetched successfully",
        data: result
    })
})

// Get single query
export const getSingleQuery = CatchAsync(async (req, res) => {
    const result = await schoolService.getSingleQuery(req)
    res.status(200).json({
        success: true,
        message: "Single query fetched successfully",
        data: result
    })
})

// Update query
export const patchQuery = CatchAsync(async (req, res) => {
    const result = await schoolService.patchQuery(req)
    res.status(200).json({
        success: true,
        message: "Query updated successfully",
        data: result
    })
})
