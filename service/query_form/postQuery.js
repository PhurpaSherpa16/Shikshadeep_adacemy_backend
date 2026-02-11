import AppError from "../../utils/appError.js"
import prisma from "../../utils/prisma.js"

export const postQuery = async (req) => {
    try {
        const { full_name, email, phone, subject, message } = req.body

        if (!full_name || !email || !phone || !subject || !message) {
            throw new AppError('All fields are required', 400)
        }

        const result = await prisma.query_form.create({
            data: {
                full_name: full_name.trim().toLowerCase(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                subject: subject.trim().toLowerCase(),
                message: message.trim()
            }
        })
        return result

    } catch (error) {
        console.error('Error in postQuery:', error)

        // Specific duplicate entry error handling
        if (error.code === 'P2002') throw new AppError('You have already submitted this query', 400)

        if (error instanceof AppError) throw error
        throw new AppError('Failed to post query, please try again later', 500)
    }
}