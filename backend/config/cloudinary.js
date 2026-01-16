// config/cloudinary.js
import 'dotenv/config';
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables. Importing dotenv here
// ensures env vars exist even if this module is imported before index.js.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
