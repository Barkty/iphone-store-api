import express from 'express'
import IPhoneController from '../controller/IPhone';
import { uploadFile } from "../middleware/uploads/fileUpload";

const router = express.Router();
const phoneController = new IPhoneController()

router.post('/', uploadFile.single('file'), phoneController.uploadRequests)

export default router