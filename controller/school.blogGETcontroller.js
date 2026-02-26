import { schoolService } from "../service/SchoolService.js"
import CatchAsync from "../utils/catchAsync.js"

export const getAllBlogs = CatchAsync(async (req, res, next) => {
    const blogs = await schoolService.allBlog(req)
    res.json({
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs
    })
})

export const getSingleBlog = CatchAsync(async (req, res, next) =>{
    const blog = await schoolService.getSingleBlog(req)
    res.json({
        success: true,
        message: 'Blog fetched successfully',
        data: blog
    })
})

export const getBlogTag = CatchAsync(async (req, res, next) => {
    const blog = await schoolService.getBlogTag()
    res.json({
        success: true,
        message: 'Blog tag fetched successfully',
        data: blog
    })
})

export const getBlogsByTag = CatchAsync(async (req, res, next) => {
    const blogs = await schoolService.getBlogsByTag(req)
    res.json({
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs
    })
})

export const getBlogsBySearch = CatchAsync(async (req, res, next) =>{
    const blogs = await schoolService.getBlogsBySearch(req)
    res.json({
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs
    })
})

export const getRelatedBlogs = CatchAsync(async (req, res, next) => {
    const blogs = await schoolService.getRelatedBlogs(req)
    res.json({
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs
    })
})
