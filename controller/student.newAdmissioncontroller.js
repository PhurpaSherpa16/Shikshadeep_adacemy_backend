import { schoolService } from "../service/SchoolService.js";
import CatchAsync from "../utils/catchAsync.js";

export const postStudentApplicationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.postStudentApplication(req)
    res.status(200).json({
        status: "success",
        message: "New admission application submitted successfully",
        data: result
    })
})


// All admission applications
export const getAllStudentApplicationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.getAllStudentApplication(req)
    res.status(200).json({
        status: "success",
        message: "All admission applications fetched successfully",
        data: result
    })
})

// Single admission application
export const getSingleStudentApplicationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.getSingleStudentApplication(req)
    res.status(200).json({
        status: "success",
        message: "Single admission application fetched successfully",
        data: result
    })
})

// Delete admission application
export const deleteStudentApplicationController = CatchAsync(async (req, res, next) => {
    const result = await schoolService.deleteStudentApplication(req)
    res.status(200).json({
        status: "success",
        message: "Admission application deleted successfully",
        data: result
    })
})

