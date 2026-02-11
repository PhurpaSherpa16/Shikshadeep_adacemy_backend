import { schoolService } from "../service/SchoolService.js"
import CatchAsync from "../utils/catchAsync.js"

export const postBlog = CatchAsync(async (req, res, next) =>{
    const blog = await schoolService.createBlog(req)
    res.json({
        status : true,
        success : true,
        message : 'Blog posted successfully',
        data : blog
    })
})


export const updateBlog = CatchAsync(async (req, res, next) =>{
    const blog = await schoolService.updateBlog(req)
    res.json({
        status : true,
        success : true,
        message : 'Blog updated successfully',
        data : blog
    })
})


export const deleteBlog = CatchAsync(async (req, res, next) =>{
    const blog = await schoolService.deleteBlog(req)
    res.json({
        status : true,
        success : true,
        message : blog.message
    })
})



