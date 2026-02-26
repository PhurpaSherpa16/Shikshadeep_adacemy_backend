import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getRelatedBlogs = async(req) =>{
    try{
        const {limit, page, start} = pagination(req, 10, 50)
        const {id} = req.params
        let blogs = []

        // Get single blog
        const tempBlogData = await prisma.blog.findUnique({
            where: { id },
            select: { tag: { select: { name: true, color: true } } }
        })
        const tag = tempBlogData?.tag?.name

        if(!tempBlogData) throw new AppError('Blog not found', 404)
        
        // fetching related blog by tag
        const tagBlogs = await prisma.blog.findMany({
            where: {
                tag : {name: tag},
                id : {not : id}
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail_url: true,
                createdAt: true,
                tag: { select: { name: true, color: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: start
        })

        blogs = [...tagBlogs]

        if(blogs.length < 3){
            const remainingBlogs = 3 - blogs.length
            const otherBlogs = await prisma.blog.findMany({
                where: {
                    id : {
                        notIn:[
                            id,
                            ...blogs.map(blog => blog.id)
                        ]
                    }
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    thumbnail_url: true,
                    createdAt: true,
                    tag: { select: { name: true, color: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: remainingBlogs,
                skip: start
            })
            blogs = [...blogs, ...otherBlogs]
        }

        return {
            total_items: blogs.length,
            blogs
        }

    }catch(error){
        console.log('Error fetching related blogs', error)
        if(error instanceof AppError) throw error
        throw new AppError('Error fetching related blogs', 500)
    }
}