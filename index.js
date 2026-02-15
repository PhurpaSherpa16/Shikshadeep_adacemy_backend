import "dotenv/config"
import express from 'express'
import cors from 'cors'
import { errorHandler, urlNotFound } from './middleware/errorHandler.js';
import blogRouter from './routes/blog.routes.js'
import programRouter from './routes/program.routes.js'
import galleryRouter from './routes/gallery.routes.js'
import schoolDataRouter from './routes/schoolData.routes.js'
import newAdmissionRouter from './routes/newAdmissionApplication.routes.js'
import notificationRouter from './routes/notifications.routes.js'
import queryRouter from "./routes/query.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express()

app.use(cors())
app.use(express.json())

// API endpoints root
app.use('/blogs', blogRouter)
app.use('/programs', programRouter)
app.use('/gallery', galleryRouter)
app.use('/school', schoolDataRouter)
app.use('/admission', newAdmissionRouter)
app.use('/notification', notificationRouter)
app.use('/query', queryRouter)
app.use('/subscriber', subscriptionRouter)
app.use('/auth', authRouter)

// error handler
app.use(errorHandler)

// url not found
app.use(urlNotFound)

// For local development only
if (process.env.NODE_ENV !== "production") {
    const PORT = 9000
    app.listen(PORT, () => {
        console.log(`📊 API running at http://localhost:${PORT}/blogs`);
    })
}
console.log("DATABASE_URL:", process.env.DATABASE_URL)

export default app
