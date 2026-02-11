import prisma from "../../utils/prisma.js"

export const getBlogTag = async (req, res, next) => {
    const tags = await prisma.blog_tag.findMany({
        select: {
            name: true,
            color: true
        }
    })

    if (!tags) {
        throw new AppError('No tags found', 404)
    }

    return tags
}