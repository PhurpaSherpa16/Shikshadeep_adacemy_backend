import multer from "multer";

const storage = multer.memoryStorage()

// 5mb file size limit and 10 images at a time
export const uploadGalleryImages = multer({storage, limits: {fileSize: 1024 * 1024 * 5},
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images") {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
      ]
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error("Invalid file type. Only image files are allowed."))
      }
    } else {
      cb(new Error("Invalid file field name."))
    }
  }, 
}).array('images', 10)

export const uploadBlogImage = multer({storage, limits: {fileSize: 1024 * 1024 * 5},
   fileFilter: (req, file, cb) => {
    if (file.fieldname === "image") {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
      ]
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error("Invalid file type. Only image files are allowed."))
      }
    } else {
      cb(new Error("Invalid file field name."))
    }
  }, 
}).single('image')


// Job files upload only pdf
export const uploadJobFiles = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "document_url") {
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
      ]

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error("Invalid file type. Only PDF and Word documents are allowed."))
      }
    } else {
      cb(new Error("Invalid file field name."))
    }
  },
}).fields([{ name: "document_url", maxCount: 1 }])


// Image upload only image
export const uploadImage = multer({
    storage, limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "image_url") {
            const allowedMimeTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
            ]
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(new Error("Invalid file type. Only image files are allowed."))
            }
        } else {
            cb(new Error("Invalid file field name."))
        }
    },
}).single('image_url')