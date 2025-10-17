// import express, { Request, Response } from "express";
// import Trainer from "../models/trainerModel";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// // 🔹 ایجاد __filename و __dirname در ES Module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const router = express.Router();

// // 🔹 تنظیمات multer برای ذخیره عکس
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     const uploadDir = path.join(__dirname, "../uploads/trainers");
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${file.fieldname}${ext}`;
//     cb(null, filename);
//   },
// });

// const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("فقط فایل‌های تصویری مجاز هستند"));
// };

// const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // حداکثر 5MB

// // ➕ Create Trainer with optional photo
// router.post("/", upload.single("photo"), async (req: Request, res: Response) => {
//   try {
//     const data = req.body;
//     if (req.file) data.photo = `/uploads/trainers/${req.file.filename}`;

//     const newTrainer = new Trainer(data);
//     const savedTrainer = await newTrainer.save();
//     res.status(201).json(savedTrainer);
//   } catch (error) {
//     console.error("Error creating trainer:", error);
//     res.status(500).json({ message: "خطا در ثبت ترینر" });
//   }
// });

// // 📋 Get all Trainers
// router.get("/", async (_req: Request, res: Response) => {
//   try {
//     const trainers = await Trainer.find().lean();
//     res.status(200).json(trainers);
//   } catch (error) {
//     console.error("Error fetching trainers:", error);
//     res.status(500).json({ message: "خطا در دریافت ترینرها" });
//   }
// });

// // 🔍 Get Trainer by ID
// router.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const trainer = await Trainer.findById(req.params.id).lean();
//     if (!trainer) return res.status(404).json({ message: "ترینر یافت نشد" });
//     res.status(200).json(trainer);
//   } catch (error) {
//     console.error("Error fetching trainer:", error);
//     res.status(500).json({ message: "خطا در دریافت ترینر" });
//   }
// });

// // ✏️ Update Trainer with optional photo
// router.put("/:id", upload.single("photo"), async (req: Request, res: Response) => {
//   try {
//     const data = req.body;
//     if (req.file) data.photo = `/uploads/trainers/${req.file.filename}`;

//     const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, data, { new: true });
//     if (!updatedTrainer) return res.status(404).json({ message: "ترینر یافت نشد" });

//     res.status(200).json(updatedTrainer);
//   } catch (error) {
//     console.error("Error updating trainer:", error);
//     res.status(500).json({ message: "خطا در بروزرسانی ترینر" });
//   }
// });

// // 🗑️ Delete Trainer by ID
// router.delete("/:id", async (req: Request, res: Response) => {
//   try {
//     const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
//     if (!deletedTrainer) return res.status(404).json({ message: "ترینر یافت نشد" });

//     // حذف عکس از سرور در صورت وجود
//     if (deletedTrainer.photo) {
//       const photoPath = path.join(__dirname, "..", deletedTrainer.photo);
//       if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
//     }

//     res.status(200).json({ message: "ترینر حذف شد" });
//   } catch (error) {
//     console.error("Error deleting trainer:", error);
//     res.status(500).json({ message: "خطا در حذف ترینر" });
//   }
// });

// export { router as trainerRoutes };
//////////////////////////////////////


import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { TrainerController } from "../controllers/trainerController";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/trainers");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// ===== Routes =====

// ایجاد ترینر (+ progress)
router.post("/", upload.single("photo"), TrainerController.createTrainer);

// گرفتن همه ترینرها همراه progress (برای فرانت)
router.get("/", TrainerController.getAllTrainersWithProgress);

// فیلتر بر اساس سال -> این روت قبل از :mongoId باشد تا تداخل نداشته باشد
router.get("/filter/by-year", TrainerController.getTrainersByYear);

// گرفتن یک ترینر (mongoId)
router.get("/:mongoId", TrainerController.getTrainerById);

// بروزرسانی ترینر
router.put("/:mongoId", upload.single("photo"), TrainerController.updateTrainer);

// حذف ترینر
router.delete("/:mongoId", TrainerController.deleteTrainer);

// ارتقا -> دریافت nextYear و academicYear از body
router.post("/:mongoId/promote", TrainerController.promoteTrainerYear);

export { router as trainerRoutes };
