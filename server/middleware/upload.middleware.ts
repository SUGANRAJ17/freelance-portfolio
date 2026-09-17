import multer from "multer"
import path from "path"

// Store uploaded files temporarily in memory.
// We will send them to Cloudinary next.
const storage = multer.memoryStorage()

// Allow only image files.
const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(
      new Error(
        "Only JPG, PNG, WEBP, and GIF images are allowed"
      )
    )
  }
}

// Create upload middleware.
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
})

export default upload