import { schoolService } from "../service/SchoolService.js"
import CatchAsync from "../utils/catchAsync.js"

// PUT update school details
export const updateSchoolDetails = CatchAsync(async(req, res, next) =>{
    const result = await schoolService.updateSchoolDetails(req)
    res.json({
        status : true,
        success : true,
        message : 'School details updated successfully',
        data : result
    })
})

// GET school details
export const getSchoolDetails = CatchAsync(async(req, res, next) =>{
    const result = await schoolService.getSchoolDetails()
    res.json({
        status : true,
        success : true,
        message : 'School details fetched successfully',
        data : result
    })
})