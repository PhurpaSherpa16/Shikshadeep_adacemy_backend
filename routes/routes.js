import express from "express";
import multer from "multer";
import { deleteBlog, postBlog, updateBlog } from "../controller/school.blogCRUDcontroller.js";
import { getAllBlogs, getBlogTag, getSingleBlog, getBlogsByTag, getBlogsBySearch } from "../controller/school.blogGETcontroller.js";
import { deleteImage, deletePost, updatePost, uploadImages } from "../controller/school.galleryCRUDcontroller.js";
import { getAllImages, getGalleryPost, getGalleryPostsByTag, getGalleryTags, getImagesByTag, getSingleGalleryPostById, getSingleImageById } from "../controller/school.galleryGETconroller.js";
import { uploadGalleryImages } from "../utils/multer.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

// Post blog
router.post('/blog_post', upload.single('image'), postBlog)

// Update blog
router.put('/blog_update/:id', upload.single('image'), updateBlog)

// delete blog
router.delete('/blog_delete/:id', deleteBlog)

// Get all blogs
router.get("/blogs", getAllBlogs)

// Get single blog
router.get("/blog/:id", getSingleBlog)

// Filter tag
router.get("/tag", getBlogTag)

// Filter blogs by tag
router.get("/blogs/tag", getBlogsByTag)

// Filter blogs by search
router.get("/blogs/search", getBlogsBySearch)

// Upload images
router.post('/gallery/post', uploadGalleryImages, uploadImages)

// Update post
router.put('/gallery/post_update/:id', uploadGalleryImages, updatePost)

// Delete post
router.delete('/gallery/post_delete/:id', deletePost)

// Delete image
router.delete('/gallery/image_delete/:id', deleteImage)

// Get all galleryPost
router.get('/gallery/posts', getGalleryPost)

// Get single galleryPost
router.get('/gallery/post/:id', getSingleGalleryPostById)

// Get all images
router.get('/gallery/images', getAllImages)

// Get single image
router.get('/gallery/image/:id', getSingleImageById)

// Get tags
router.get('/gallery/tags', getGalleryTags)

// filter post by tags
router.get('/gallery/posts/tag/', getGalleryPostsByTag)

// filter images by tags
router.get('/gallery/images/tag/', getImagesByTag)




export default router;
