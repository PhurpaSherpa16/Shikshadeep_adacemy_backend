import CatchAsync from "../utils/catchAsync.js";
import { schoolService } from "../service/SchoolService.js";

// POST : Create advisory
export const createAdvisory = CatchAsync(async(req, res, next) =>{
    const advisory = await schoolService.createAdvisory(req)
    res.json({
        status : true,
        success : true,
        message : 'Advisory created successfully',
        data : advisory
    })
})

// PUT : Update advisory
export const updateAdvisory = CatchAsync(async(req, res, next) =>{
    const advisory = await schoolService.updateAdvisory(req)
    res.json({
        status : true,
        success : true,
        message : 'Advisory updated successfully',
        data : advisory
    })
})

// DELETE : Delete advisory
export const deleteAdvisory = CatchAsync(async(req, res, next) =>{
    const advisory = await schoolService.deleteAdvisory(req)
    res.json({
        status : true,
        success : true,
        message : 'Advisory deleted successfully',
        data : advisory
    })
})

// GET : Get all advisory
export const getAdvisory = CatchAsync(async(req, res, next) =>{
    const advisory = await schoolService.getAdvisory(req)
    res.json({
        status : true,
        success : true,
        message : 'Advisory fetched successfully',
        data : advisory
    })
})