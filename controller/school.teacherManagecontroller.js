import CatchAsync from "../utils/catchAsync.js";
import { schoolService } from "../service/SchoolService.js";

// POST : Create teacher
export const createTeacher = CatchAsync(async(req, res, next) =>{
    const teacher = await schoolService.createTeacher(req)
    res.json({
        status : true,
        success : true,
        message : 'Teacher created successfully',
        data : teacher
    })
})

// PUT : Update teacher
export const updateTeacher = CatchAsync(async(req, res, next) =>{
    const teacher = await schoolService.updateTeacher(req)
    res.json({
        status : true,
        success : true,
        message : 'Teacher updated successfully',
        data : teacher
    })
})

// DELETE : Delete teacher
export const deleteTeacher = CatchAsync(async(req, res, next) =>{
    const teacher = await schoolService.deleteTeacher(req)
    res.json({
        status : true,
        success : true,
        message : 'Teacher deleted successfully',
        data : teacher
    })
})

// GET : Get all teacher
export const getTeacher = CatchAsync(async(req, res, next) =>{
    const teacher = await schoolService.getTeacher(req)
    res.json({
        status : true,
        success : true,
        message : 'Teacher fetched successfully',
        data : teacher
    })
})

// GET : Get single teacher
export const getSingleTeacher = CatchAsync(async(req, res, next) =>{
    const teacher = await schoolService.getSingleTeacher(req)
    res.json({
        status : true,
        success : true,
        message : 'Teacher fetched successfully',
        data : teacher
    })
})

// Get All teachers not grouped
export const getAllTeachers = CatchAsync(async(req, res, next) =>{
    const teacher = await schoolService.getAllTeachers(req)
    res.json({
        status : true,
        success : true,
        message : 'Teacher fetched successfully',
        data : teacher
    })
})

