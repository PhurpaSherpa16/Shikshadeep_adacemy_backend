import multer from "multer"

export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    const isDev = process.env.NODE_ENV === 'development'

    // Error handling for invalid file type
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, statusCode : 400, message: err.message })
    }
    if (err.message?.includes("Invalid file")) {
        return res.status(400).json({ success: false, statusCode : 400, message: err.message })
    }

    // Error handling for invalid file type edge case
    if (err.message?.includes("Invalid file type") || err.message?.includes("Invalid file field")) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: err.message,   
        })
    }

    if (isDev) {
        // Development
        console.error('❌ Error:', err)
        res.status(err.statusCode).json({
            success: false,
            statusCode : err.statusCode,
            message: err.message,
            stack: err.stack,
            error: err
        })
    } else {
        // Production
        if (err.isOperational) {
            // Operational errors - safe to show message
            res.status(err.statusCode).json({
                success: false,
                statusCode : err.statusCode,
                message: err.message
            })
        }
        else {
            // hide details
            console.error('💥 CRITICAL ERROR:', err)
            res.status(500).json({
                success: false,
                statusCode : 500,
                message: 'Something went wrong. Please try again later.'
            })
        }
    }
}

// Error handling for url not found
export const urlNotFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        statusCode : 404,
        message: `Cannot ${req.method} ${req.originalUrl}`,
        default_url : `/blogs`
    })
}