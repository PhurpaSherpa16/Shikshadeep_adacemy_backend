import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getBlogsByTag = async (req) => {
    try {
        const { limit, page, start, end } = pagination(req, 10, 50)
        const {tag}  = req.params
        if(!tag) throw new AppError('Tag is required', 400)
        const normalizedTag = tag.trim().toLowerCase()

        // check if tag exists
        const tagExists = await prisma.blog_tag.findUnique({where:{name:normalizedTag}})
        if(!tagExists) throw new AppError('Tag not found', 404)

        const blogs = await prisma.blog.findMany({
            select:{
                id:true,
                title:true,
                description:true,
                thumbnail_url:true,
                createdAt : true,
                tag:{select:{name:true,color:true}}
            },
            where:{tag:{name : normalizedTag}},
            orderBy:{createdAt:'desc'},
            take: limit,
            skip: start
        })

        if(blogs.length === 0) throw new AppError('No blogs found for this tag')
        const total_items = await prisma.blog.count({where:{tag:{name : normalizedTag}}})
        
        return {
            total_items,
            total_pages: Math.ceil(total_items / limit),
            current_page_number: page,
            limit_items: limit,
            blogs
        }

    } catch (error) {
        console.log('Error fetching blogs by tag', error);
        if (error instanceof AppError) throw error
        throw new AppError('Error fetching blogs by tag', 500)
    }
}