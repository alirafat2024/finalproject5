// import { Request, Response } from "express";
// import TrainerModel from "../models/trainerModel";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // 🟢 تنظیم مسیر و نام فایل‌ها
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, "../uploads/trainers");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${file.fieldname}${ext}`;
//     cb(null, filename);
//   },
// });

// // 🟢 محدود کردن نوع فایل به تصاویر
// const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("فقط فایل‌های تصویری مجاز هستند"));
//   }
// };

// export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // حداکثر 5MB

// // 🟢 کنترلر
// export const TrainerController = {
//   // ➕ ایجاد ترینر جدید با عکس
//   createTrainer: async (req: Request, res: Response) => {
//     try {
//       const { file } = req; // فایل عکس
//       const data = req.body;

//       // افزودن مسیر عکس به داده‌ها
//       if (file) {
//         data.photo = `/uploads/trainers/${file.filename}`;
//       }

//       // اعتبارسنجی اولیه
//       const { name, lastName, province, department, specialty } = data;
//       if (!name || !lastName || !province || !department || !specialty) {
//         return res.status(400).json({
//           message: "لطفاً تمام فیلدهای ضروری (نام، تخلص، ولایت، دیپارتمنت، رشته) را تکمیل کنید",
//         });
//       }

//       // بررسی ایمیل تکراری
//       if (data.email) {
//         const existing = await TrainerModel.findOne({ email: data.email });
//         if (existing) {
//           return res.status(409).json({ message: "این ایمیل قبلاً ثبت شده است" });
//         }
//       }

//       const newTrainer = await TrainerModel.create(data);
//       res.status(201).json({
//         message: "ترینر با موفقیت ایجاد شد",
//         data: newTrainer,
//       });
//     } catch (error) {
//       console.error("❌ Error creating trainer:", error);
//       res.status(500).json({ message: "خطا در ثبت ترینر" });
//     }
//   },

//   // 📋 دریافت لیست تمام ترینرها
//   getAllTrainers: async (_req: Request, res: Response) => {
//     try {
//       const trainers = await TrainerModel.find().sort({ createdAt: -1 });
//       res.status(200).json(trainers);
//     } catch (error) {
//       console.error("❌ Error fetching trainers:", error);
//       res.status(500).json({ message: "خطا در دریافت ترینرها" });
//     }
//   },

//   // 🔍 دریافت یک ترینر بر اساس ID
//   getTrainerById: async (req: Request, res: Response) => {
//     try {
//       const trainer = await TrainerModel.findById(req.params.id);
//       if (!trainer) {
//         return res.status(404).json({ message: "ترینر یافت نشد" });
//       }
//       res.status(200).json(trainer);
//     } catch (error) {
//       console.error("❌ Error fetching trainer by ID:", error);
//       res.status(500).json({ message: "خطا در دریافت ترینر" });
//     }
//   },

//   // ✏️ بروزرسانی ترینر با امکان تغییر عکس
//   updateTrainer: async (req: Request, res: Response) => {
//     try {
//       const { file } = req;
//       const data = req.body;

//       // اگر عکس جدید ارسال شده باشد، مسیر جدید را جایگزین کن
//       if (file) {
//         data.photo = `/uploads/trainers/${file.filename}`;
//       }

//       const updatedTrainer = await TrainerModel.findByIdAndUpdate(
//         req.params.id,
//         data,
//         { new: true, runValidators: true }
//       );

//       if (!updatedTrainer) {
//         return res.status(404).json({ message: "ترینر یافت نشد" });
//       }

//       res.status(200).json({
//         message: "ترینر با موفقیت بروزرسانی شد",
//         data: updatedTrainer,
//       });
//     } catch (error) {
//       console.error("❌ Error updating trainer:", error);
//       res.status(500).json({ message: "خطا در بروزرسانی ترینر" });
//     }
//   },

//   // 🗑️ حذف ترینر
//   deleteTrainer: async (req: Request, res: Response) => {
//     try {
//       const deletedTrainer = await TrainerModel.findByIdAndDelete(req.params.id);
//       if (!deletedTrainer) {
//         return res.status(404).json({ message: "ترینر یافت نشد" });
//       }

//       // حذف فایل عکس از سرور (در صورت وجود)
//       if (deletedTrainer.photo) {
//         const photoPath = path.join(__dirname, "..", deletedTrainer.photo);
//         if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
//       }

//       res.status(200).json({ message: "ترینر با موفقیت حذف شد" });
//     } catch (error) {
//       console.error("❌ Error deleting trainer:", error);
//       res.status(500).json({ message: "خطا در حذف ترینر" });
//     }
//   },
// };
///////////////////////////////////
import { Request, Response } from "express";
import { Types } from "mongoose";
import path from "path";
import fs from "fs";

import TrainerModel from "../models/trainerModel";
import { TrainerProgress, ITrainingYearRecord } from "../models/TrainerProgress";

import { MonographEvaluationForm as FormC } from "../models/form-C";
import { ConferenceEvaluation as FormD } from "../models/form-D";
import { EvaluationFormE as FormE } from "../models/form-E";
import FormF from "../models/form-F";
import FormI from "../models/form-I";
import { EvaluationFormG as FormG } from "../models/form-G";
import { EvaluationFormH as FormH } from "../models/form-H";
import { TeacherActivityModel as FormJ } from "../models/form-J";
import { MonographEvaluation as FormK } from "../models/form-K";

/* =========================
   Types for lean results
   ========================= */
export interface IProgressLean {
  _id: Types.ObjectId;
  trainer: Types.ObjectId | string;
  startYear?: string;
  currentTrainingYear?: string;
  trainingHistory?: ITrainingYearRecord[];
  promoted?: boolean;
  [k: string]: any;
}

export interface ITrainerLean {
  _id: Types.ObjectId;
  id?: string;
  name?: string;
  lastName?: string;
  province?: string;
  department?: string;
  specialty?: string;
  photo?: string;
  trainerProgress?: IProgressLean | null;
  [k: string]: any;
}

/* =========================
   Trainer Controller
   ========================= */
export const TrainerController = {
  /* ---------- create trainer + initial progress ---------- */
  createTrainer: async (req: Request, res: Response) => {
    try {
      const { file } = req;
      const data: any = req.body;
      if (file) data.photo = `/uploads/trainers/${file.filename}`;

      const { id, name, lastName, province, department, specialty, academicYear } = data;
      if (!name || !lastName || !province || !department || !specialty) {
        return res.status(400).json({ message: "تمام فیلدهای ضروری را تکمیل کنید." });
      }

      if (id) {
        const exist = await TrainerModel.findOne({ id }).lean<ITrainerLean>().exec();
        if (exist) return res.status(409).json({ message: "این آیدی قبلاً ثبت شده است." });
      }

      const newTrainer = await TrainerModel.create(data);
      const year = academicYear ? String(academicYear) : new Date().getFullYear().toString();

      // ایجاد فرم های خالی با فیلدهای required
      const formModels = [FormC, FormD, FormE, FormF, FormG, FormH, FormI, FormJ, FormK];
      const formsMap: Record<string, Types.ObjectId> = {};

      for (let i = 0; i < formModels.length; i++) {
        const formKey = `form${String.fromCharCode(67 + i)}`; // C, D, E, ...
        const formIndex = i; // 0=FormC, 1=FormD, etc.
        
        // آماده‌سازی داده‌های مشترک
        const baseData: any = { 
          trainer: newTrainer._id,
          trainerId: newTrainer._id, 
          year: "سال اول",
          calendarYear: year,
          trainingYear: "سال اول",
          name: newTrainer.name || "",
          lastName: newTrainer.lastName || "",
          parentType: newTrainer.parentType || "",
          parentName: newTrainer.parentName || "",
          department: newTrainer.department || "",
          idNumber: newTrainer.idNumber || "",
        };
        
        // داده‌های خاص هر فرم (کپی شده از promoteTrainerYear)
        let formData: any = { ...baseData };
        
        if (formIndex === 0) { // FormC
          formData = {
            ...baseData,
            startYear: year,
            date: new Date().toISOString().split('T')[0],
            chef: "",
            departmentHead: "",
            hospitalHead: "",
            evaluations: []
          };
        } else if (formIndex === 1) { // FormD
          formData = {
            ...baseData,
            conferences: []
          };
        } else if (formIndex === 2) { // FormE
          formData = {
            ...baseData,
            Name: newTrainer.name || "",
            incidentTitle: "",
            date: new Date().toISOString().split('T')[0],
            scores: [],
            averageScore: "0"
          };
        } else if (formIndex === 3) { // FormF
          formData = {
            ...baseData,
            sections: []
          };
        } else if (formIndex === 4) { // FormG
          formData = {
            ...baseData,
            personalInfo: {
              Name: newTrainer.name || "",
              parentType: newTrainer.parentType || "",
              trainingYear: "سال اول",
              year: year,
              calendarYear: year,
              department: newTrainer.department || ""
            },
            scores: [],
            averageScore: 0
          };
        } else if (formIndex === 5) { // FormH
          formData = {
            ...baseData,
            Name: newTrainer.name || "",
            trainingYears: [],
            averageScore: 0,
            shiftDepartment: "",
            programDirector: ""
          };
        } else if (formIndex === 6) { // FormI
          formData = {
            ...baseData,
            header: {
              name: newTrainer.name || "",
              parentType: newTrainer.parentType || "",
              parentName: newTrainer.parentName || "",
              department: newTrainer.department || "",
              trainingYear: "سال اول",
              rotationName: "",
              rotationFrom: "",
              rotationTo: "",
              date: new Date().toISOString().split('T')[0]
            },
            persianRows: [],
            rows: []
          };
        } else if (formIndex === 7) { // FormJ
          formData = {
            ...baseData,
            teachers: [],
            activities: []
          };
        } else if (formIndex === 8) { // FormK
          formData = {
            ...baseData,
            startYear: year,
            date: new Date().toISOString().split('T')[0],
            chef: "",
            departmentHead: "",
            hospitalHead: "",
            evaluations: []
          };
        }
        
        const formDoc = await (formModels[i] as any).create(formData);
        formsMap[formKey] = formDoc._id;
      }

      const firstYear: ITrainingYearRecord = {
        yearLabel: "سال اول",
        academicYear: year,
        startYear: year,
        status: "در حال آموزش",
        forms: formsMap,
      };

      const newProgress = await TrainerProgress.create({
        trainer: newTrainer._id,
        startYear: year,
        currentTrainingYear: "سال اول",
        trainingHistory: [firstYear],
        promoted: false,
      });

      return res.status(201).json({ message: "ترینر با موفقیت ثبت شد", trainer: newTrainer, progress: newProgress });
    } catch (error: any) {
      console.error("Error creating trainer:", error);
      return res.status(500).json({ message: "خطا در ثبت ترینر", error: error.message });
    }
  },

  /* ---------- get all trainers with progress ---------- */
  getAllTrainersWithProgress: async (_req: Request, res: Response) => {
    try {
      const trainers = await TrainerModel.find().sort({ createdAt: -1 }).lean<ITrainerLean[]>().exec();
      if (!Array.isArray(trainers)) return res.status(200).json([]);

      const trainerIds = trainers.map((t) => t._id);
      const progresses = await TrainerProgress.find({ trainer: { $in: trainerIds } }).lean<IProgressLean[]>().exec();

      const trainersWithProgress = trainers.map((t) => {
        const matched = progresses.find((p) => String(p.trainer) === String(t._id));
        return { ...t, trainerProgress: matched || null };
      });

      return res.status(200).json(trainersWithProgress);
    } catch (error: any) {
      console.error("Error fetching trainers with progress:", error);
      return res.status(500).json({ message: "خطا در دریافت ترینرها", error: error.message });
    }
  },

  /* ---------- get single trainer by mongoId ---------- */
  getTrainerById: async (req: Request, res: Response) => {
    try {
      const { mongoId } = req.params;
      if (!mongoId) return res.status(400).json({ message: "mongoId لازم است." });

      const trainer = await TrainerModel.findById(mongoId).lean<ITrainerLean>().exec();
      if (!trainer) return res.status(404).json({ message: "ترینر یافت نشد." });

      const progress = await TrainerProgress.findOne({ trainer: trainer._id }).lean<IProgressLean>().exec();
      
      // ترکیب trainer و progress (consistent با getAllTrainersWithProgress)
      const trainerWithProgress = { ...trainer, trainerProgress: progress || null };
      return res.status(200).json(trainerWithProgress);
    } catch (error: any) {
      console.error("Error fetching trainer:", error);
      return res.status(500).json({ message: "خطا در دریافت ترینر", error: error.message });
    }
  },

  /* ---------- update trainer ---------- */
  updateTrainer: async (req: Request, res: Response) => {
    try {
      const { mongoId } = req.params;
      const { file } = req;
      const data: any = req.body;
      if (file) data.photo = `/uploads/trainers/${file.filename}`;

      const updated = await TrainerModel.findByIdAndUpdate(mongoId, data, { new: true, runValidators: true }).exec();
      if (!updated) return res.status(404).json({ message: "ترینر یافت نشد." });
      return res.status(200).json({ message: "ترینر بروزرسانی شد.", trainer: updated });
    } catch (error: any) {
      console.error("Error updating trainer:", error);
      return res.status(500).json({ message: "خطا در بروزرسانی ترینر", error: error.message });
    }
  },

  /* ---------- delete trainer ---------- */
  deleteTrainer: async (req: Request, res: Response) => {
    try {
      const { mongoId } = req.params;
      const deleted = await TrainerModel.findByIdAndDelete(mongoId).exec();
      if (!deleted) return res.status(404).json({ message: "ترینر یافت نشد." });

      if (deleted.photo) {
        const photoPath = path.join(__dirname, "..", deleted.photo);
        if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
      }

      return res.status(200).json({ message: "ترینر با موفقیت حذف شد." });
    } catch (error: any) {
      console.error("Error deleting trainer:", error);
      return res.status(500).json({ message: "خطا در حذف ترینر", error: error.message });
    }
  },

  /* ---------- promote trainer year ---------- */
  promoteTrainerYear: async (req: Request, res: Response) => {
    try {
      const { mongoId } = req.params;
      const { nextYear } = req.body;
      if (!nextYear) return res.status(400).json({ message: "سال آموزشی لازم است." });

      // بررسی وجود ترینر
      const trainer = await TrainerModel.findById(mongoId).exec();
      if (!trainer) return res.status(404).json({ message: "ترینر یافت نشد." });

      let progress = await TrainerProgress.findOne({ trainer: new Types.ObjectId(mongoId) }).exec();
      
      // اگر رکورد پیشرفت وجود نداشت، یکی بسازیم
      if (!progress) {
        console.log(`ℹ️ Creating initial progress record for trainer ${mongoId}`);
        const currentYear = new Date().getFullYear().toString();
        
        // ساخت فرم‌های اولیه برای سال اول
        const formModels = [FormC, FormD, FormE, FormF, FormG, FormH, FormI, FormJ, FormK];
        const initialFormsMap: Record<string, Types.ObjectId> = {};
        
        for (let i = 0; i < formModels.length; i++) {
          const formKey = `form${String.fromCharCode(67 + i)}`;
          const formIndex = i;
          
          const baseData: any = { 
            trainer: mongoId,
            trainerId: mongoId, 
            year: "سال اول",
            calendarYear: currentYear,
            trainingYear: "سال اول",
            name: trainer.name || "",
            lastName: trainer.lastName || "",
            parentType: trainer.parentType || "",
            parentName: trainer.parentName || "",
            department: trainer.department || "",
            idNumber: trainer.idNumber || "",
          };
          
          let formData: any = { ...baseData };
          
          if (formIndex === 0) { // FormC
            formData = { ...baseData, startYear: currentYear, date: new Date().toISOString().split('T')[0], chef: "", departmentHead: "", hospitalHead: "", evaluations: [] };
          } else if (formIndex === 1) { // FormD
            formData = { ...baseData, conferences: [] };
          } else if (formIndex === 2) { // FormE
            formData = { ...baseData, Name: trainer.name || "", incidentTitle: "", date: new Date().toISOString().split('T')[0], scores: [], averageScore: "0" };
          } else if (formIndex === 3) { // FormF
            formData = { ...baseData, sections: [] };
          } else if (formIndex === 4) { // FormG
            formData = { ...baseData, personalInfo: { Name: trainer.name || "", parentType: trainer.parentType || "", trainingYear: "سال اول", year: currentYear, calendarYear: currentYear, department: trainer.department || "" }, scores: [], averageScore: 0 };
          } else if (formIndex === 5) { // FormH
            formData = { ...baseData, Name: trainer.name || "", trainingYears: [], averageScore: 0, shiftDepartment: "", programDirector: "" };
          } else if (formIndex === 6) { // FormI
            formData = { ...baseData, header: { name: trainer.name || "", parentType: trainer.parentType || "", parentName: trainer.parentName || "", department: trainer.department || "", trainingYear: "سال اول", rotationName: "", rotationFrom: "", rotationTo: "", date: new Date().toISOString().split('T')[0] }, persianRows: [], rows: [] };
          } else if (formIndex === 7) { // FormJ
            formData = { ...baseData, teachers: [], activities: [] };
          } else if (formIndex === 8) { // FormK
            formData = { ...baseData, startYear: currentYear, date: new Date().toISOString().split('T')[0], chef: "", departmentHead: "", hospitalHead: "", evaluations: [] };
          }
          
          const formDoc = await (formModels[i] as any).create(formData);
          initialFormsMap[formKey] = formDoc._id;
        }

        const firstYear: ITrainingYearRecord = {
          yearLabel: "سال اول",
          academicYear: currentYear,
          startYear: currentYear,
          status: "در حال آموزش",
          forms: initialFormsMap,
        };

        progress = await TrainerProgress.create({
          trainer: mongoId,
          startYear: currentYear,
          currentTrainingYear: "سال اول",
          trainingHistory: [firstYear],
          promoted: false,
        });
        
        console.log(`✅ Initial progress record created for trainer ${mongoId}`);
      }

      if (progress.currentTrainingYear === nextYear)
        return res.status(400).json({ message: "شما قبلاً در همین سال هستید." });

      if (progress.trainingHistory.some((y: ITrainingYearRecord) => y.yearLabel === nextYear))
        return res.status(400).json({ message: "قبلاً به این سال ارتقا یافته‌اید." });

      const current = progress.trainingHistory.find((y: ITrainingYearRecord) => y.yearLabel === progress.currentTrainingYear);
      if (current) {
        current.status = "ختم شده";
        current.endYear = new Date().getFullYear().toString();
      }

      const lastAcademic = progress.trainingHistory.at(-1)?.academicYear || new Date().getFullYear().toString();
      const nextAcademic = (Number(lastAcademic) + 1).toString();

      // ایجاد فرم‌های خالی برای سال بعد
      const formModels = [FormC, FormD, FormE, FormF, FormG, FormH, FormI, FormJ, FormK];
      const formsMap: Record<string, Types.ObjectId> = {};
      for (let i = 0; i < formModels.length; i++) {
        const formKey = `form${String.fromCharCode(67 + i)}`;
        const formIndex = i; // 0=FormC, 1=FormD, etc.
        
        // آماده‌سازی داده‌های مشترک
        const baseData: any = { 
          trainer: mongoId,
          trainerId: mongoId, 
          year: nextYear,
          calendarYear: nextAcademic,
          trainingYear: nextYear,
          name: trainer.name,
          lastName: trainer.lastName,
          parentType: trainer.parentType,
          parentName: trainer.parentName,
          department: trainer.department,
          idNumber: trainer.idNumber,
        };
        
        // داده‌های خاص هر فرم
        let formData: any = { ...baseData };
        
        if (formIndex === 0) { // FormC
          formData = {
            ...baseData,
            startYear: nextAcademic,
            date: new Date().toISOString().split('T')[0],
            chef: "",
            departmentHead: "",
            hospitalHead: "",
            evaluations: []
          };
        } else if (formIndex === 1) { // FormD
          formData = {
            ...baseData,
            conferences: []
          };
        } else if (formIndex === 2) { // FormE
          formData = {
            ...baseData,
            Name: trainer.name,
            incidentTitle: "",
            date: new Date().toISOString().split('T')[0],
            scores: [],
            averageScore: "0"
          };
        } else if (formIndex === 3) { // FormF
          formData = {
            ...baseData,
            sections: []
          };
        } else if (formIndex === 4) { // FormG
          formData = {
            ...baseData,
            personalInfo: {
              Name: trainer.name,
              parentType: trainer.parentType,
              trainingYear: nextYear,
              year: nextAcademic,
              calendarYear: nextAcademic,
              department: trainer.department
            },
            scores: [],
            averageScore: 0
          };
        } else if (formIndex === 5) { // FormH
          formData = {
            ...baseData,
            Name: trainer.name,
            trainingYears: [],
            averageScore: 0,
            shiftDepartment: "",
            programDirector: ""
          };
        } else if (formIndex === 6) { // FormI
          formData = {
            ...baseData,
            header: {
              name: trainer.name,
              parentType: trainer.parentType,
              parentName: trainer.parentName,
              department: trainer.department,
              trainingYear: nextYear,
              rotationName: "",
              rotationFrom: "",
              rotationTo: "",
              date: new Date().toISOString().split('T')[0]
            },
            persianRows: [],
            rows: []
          };
        } else if (formIndex === 7) { // FormJ
          formData = {
            ...baseData,
            teachers: [],
            activities: []
          };
        } else if (formIndex === 8) { // FormK
          formData = {
            ...baseData,
            startYear: nextAcademic,
            date: new Date().toISOString().split('T')[0],
            chef: "",
            departmentHead: "",
            hospitalHead: "",
            evaluations: []
          };
        }
        
        const formDoc = await (formModels[i] as any).create(formData);
        formsMap[formKey] = formDoc._id;
      }

      const newYear: ITrainingYearRecord = {
        yearLabel: nextYear,
        academicYear: nextAcademic,
        startYear: nextAcademic,
        status: "در حال آموزش",
        forms: formsMap,
      };

      progress.trainingHistory.push(newYear);
      progress.markModified("trainingHistory");
      progress.currentTrainingYear = nextYear;
      progress.promoted = true;
      progress.lastUpdated = new Date();
      await progress.save();

      return res.status(200).json({ message: `ترینر موفقانه به ${nextYear} ارتقاء یافت.`, progress });
    } catch (error: any) {
      console.error("Error promoting trainer:", error);
      return res.status(500).json({ message: "خطا در ارتقاء ترینر", error: error.message });
    }
  },

  /* ---------- filter trainers ---------- */
  getTrainersByYear: async (req: Request, res: Response) => {
    try {
      const { academicYear, currentTrainingYear } = req.query;
      const query: any = {};
      if (academicYear) query["trainingHistory.academicYear"] = String(academicYear);
      if (currentTrainingYear) query.currentTrainingYear = String(currentTrainingYear);

      const results = await TrainerProgress.find(query).populate("trainer").lean<IProgressLean[]>().exec();
      return res.status(200).json(Array.isArray(results) ? results : []);
    } catch (error: any) {
      console.error("Error fetching trainers by year:", error);
      return res.status(500).json({ message: "خطا در فیلتر ترینرها", error: error.message });
    }
  },
};
