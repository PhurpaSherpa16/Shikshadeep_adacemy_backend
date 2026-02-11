import CatchAsync from "../utils/catchAsync.js";
import { schoolService } from "../service/SchoolService.js";

// Upload images and creating post
export const uploadImages = CatchAsync(async(req, res, next) =>{
    const gallery = await schoolService.uploadImages(req)
    res.json({
        status : true,
        success : true,
        message : 'Images uploaded successfully',
        data : gallery
    })
})

// update post and images
export const updatePost = CatchAsync(async(req, res, next) =>{
    const result = await schoolService.updateGalleryPost(req)
    res.json({
        status : true,
        success : true,
        message : 'Post updated successfully',
        data : result
    })
})

// Single image delete by image id
export const deleteImage = CatchAsync(async(req, res, next) =>{
    const result = await schoolService.deleteImage(req)
    res.json({
        status : true,
        success : true,
        message : 'Image deleted successfully',
        data : result
    })
})

// Delete post by post id
export const deletePost = CatchAsync(async(req, res, next) =>{
    const result = await schoolService.deletePost(req)
    res.json({
        status : true,
        success : true,
        message : 'Post deleted successfully',
        data : result
    })
})
