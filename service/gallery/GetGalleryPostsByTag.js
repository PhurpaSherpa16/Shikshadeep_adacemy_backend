import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"
import prisma from "../../utils/prisma.js"

export const getGalleryPostsByTag = async (req) => {
    const { page, limit, skip } = pagination(req, 10, 50)

    try {
        const total_items = await prisma.gallery_post.count({ where: { galleryPostTags: { some: { tag: { name: req.query.q.toLowerCase() } } } } })
        const total_pages = Math.ceil(total_items / limit)
        const tag = req.query.q
        if (!tag) {
            throw new AppError('Tag is required', 400)
        }

        // Check if tag exists
        const tagExists = await prisma.gallery_tag.findUnique({
            where: { name: tag.toLowerCase() }
        })

        if (!tagExists) {
            throw new AppError('No tag exists', 404)
        }

        // Get all posts with the tag
        const posts = await prisma.gallery_post.findMany({
            where: {
                galleryPostTags: {
                    some: {
                        tag: {
                            name: tag.toLowerCase()
                        }
                    }
                }
            },
            select: {
                id: true,
                title: true,
                caption: true,
                createdAt: true,
                updatedAt: true,
                galleryPostTags: {
                    select: {
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                images: {
                    select: {
                        id: true,
                        image_url: true
                    }
                }
            },
            take: limit,
            skip: skip,
            orderBy: { createdAt: 'desc' }
        })

        if (!posts || posts.length === 0) {
            throw new AppError('No posts found for this tag', 404)
        }

        return {
            total_items,
            total_pages,
            current_page_number: page,
            limit_items: limit,
            posts
        }
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) throw error
        throw new AppError('Error fetching posts', 500)
    }
}