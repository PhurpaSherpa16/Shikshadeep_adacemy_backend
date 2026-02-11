import express from "express";
import { deleteImage, deletePost, updatePost, uploadImages } from "../controller/school.galleryCRUDcontroller.js";
import { getAllImages, getGalleryPost, getGalleryPostsByTag, getGalleryTags, getImagesByTag, getSingleGalleryPostById, getSingleImageById } from "../controller/school.galleryGETconroller.js";
import { uploadGalleryImages } from "../utils/multer.js";

const router = express.Router();

// CRUD
    // Upload images
    router.post('/post', uploadGalleryImages, uploadImages)

    // Update post
    router.put('/post_update/:id', uploadGalleryImages, updatePost)

    // Delete post
    router.delete('/post_delete/:id', deletePost)

    // Delete image
    router.delete('/image_delete/:id', deleteImage)

// GET
    // Get all galleryPost
    router.get('/', getGalleryPost)

    // Get single galleryPost
    router.get('/post/:id', getSingleGalleryPostById)

    // Get all images
    router.get('/images', getAllImages)

    // Get single image
    router.get('/image/:id', getSingleImageById)

    // Get tags
    router.get('/tags', getGalleryTags)

    // filter post by tags
    router.get('/posts/tag/', getGalleryPostsByTag)

    // filter images by tags
    router.get('/images/tag/', getImagesByTag)


export default router
