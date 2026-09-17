import { UploadApiResponse } from "cloudinary"
import cloudinary from "./cloudinary.js"

export function uploadToCloudinary(
  buffer: Buffer
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "freelance-portfolio/projects",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          if (!result) {
            reject(
              new Error(
                "Cloudinary upload failed"
              )
            )
            return
          }

          resolve(result)
        }
      )

    uploadStream.end(buffer)
  })
}