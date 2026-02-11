import express from "express";
import multer from "multer";
import { deleteBlog, postBlog, updateBlog } from "../controller/school.blogCRUDcontroller.js";
import { getAllBlogs, getBlogTag, getSingleBlog, getBlogsByTag, getBlogsBySearch } from "../controller/school.blogGETcontroller.js";
import { uploadBlogImage } from "../utils/multer.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

// CRUD blog actions
    // Post blog
    router.post('/blog_post', uploadBlogImage, postBlog)
    // Update blog
    router.put('/blog_update/:id', uploadBlogImage, updateBlog)
    // delete blog
    router.delete('/blog_delete/:id', deleteBlog)


// GET blog actions
    // Get all blogs
    router.get("/", getAllBlogs)
    // Get single blog
    router.get("/:id", getSingleBlog)
    // Filter tag
    router.get("/tag", getBlogTag)
    // Filter blogs by tag
    router.get("/tag/:tag", getBlogsByTag)
    // Filter blogs by search
    router.get("/search", getBlogsBySearch)


export default router
