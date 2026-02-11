import { schoolService } from "../service/SchoolService.js";
import CatchAsync from "../utils/catchAsync.js";

export const getGalleryPost = CatchAsync(async (req, res) => {
    const result = await schoolService.getGalleryPost(req)
    res.json({
        success: true,
        message: 'Gallery posts fetched successfully',
        data: result
    })
})

// Get single gallery post
export const getSingleGalleryPostById = CatchAsync(async (req, res) => {
    const result = await schoolService.getSingleGalleryPostById(req)
    res.json({
        success: true,
        message: 'Gallery post fetched successfully',
        data: result
    })
})

// Get all images
export const getAllImages = CatchAsync(async (req, res) => {
    const result = await schoolService.getAllImages(req)
    res.json({
        success: true,
        message: 'Images fetched successfully',
        data: result
    })
})

// Get single image
export const getSingleImageById = CatchAsync(async (req, res) => {
    const result = await schoolService.getSingleImageById(req)
    res.json({
        success: true,
        message: 'Image fetched successfully',
        data: result
    })
})

// Get tags
export const getGalleryTags = CatchAsync(async (req, res) => {
    const result = await schoolService.getGalleryTags(req)
    res.json({
        success: true,
        message: 'Tags fetched successfully',
        data: result
    })
})

// Get posts by tag
export const getGalleryPostsByTag = CatchAsync(async (req, res) => {
    const result = await schoolService.getGalleryPostsByTag(req)
    res.json({
        success: true,
        message: 'Posts fetched successfully',
        data: result
    })
})

// Get images by tag
export const getImagesByTag = CatchAsync(async (req, res) => {
    const result = await schoolService.getImagesByTag(req)
    res.json({
        success: true,
        message: 'Images fetched successfully',
        data: result
    })
})


