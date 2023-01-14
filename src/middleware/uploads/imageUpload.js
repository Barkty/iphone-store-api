import multer from "multer";
import storage from "./storage";

const imageUpload = multer({ storage: storage });

export default imageUpload;