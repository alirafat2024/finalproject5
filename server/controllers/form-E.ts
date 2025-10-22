// controllers/evaluationFormEController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import { EvaluationFormE } from "../models/form-E";

export class EvaluationFormEController {
  // 🔹 ایجاد فرم جدید
  static async create(req: Request, res: Response) {
    try {
      const {
        trainer,
        Name,
        parentType,
        trainingYear,
        incidentTitle,
        date,
        scores, // آرایه از نمرات
        averageScore,
        calendarYear,
        year,
      } = req.body;

      if (!trainer) {
        return res.status(400).json({ message: "Trainer ID الزامی است" });
      }

      // 🔹 بررسی وجود فرم قبلی برای همین Trainer و سال آموزشی
      // ✅ جلوگیری از ثبت فرم تکراری بر اساس چند فیلد
      const existingForm = await EvaluationFormE.findOne({
        trainer: new mongoose.Types.ObjectId(trainer),
        Name: Name.trim(),
        parentType: parentType.trim(),
        trainingYear: trainingYear.toString().trim(),
        incidentTitle: incidentTitle.trim(),
        averageScore: Number(averageScore),
      });

      if (existingForm) {
        return res.status(400).json({
          message:
            "⚠️ فرم با همین مشخصات قبلاً ثبت شده و امکان ثبت مجدد وجود ندارد.",
          formId: existingForm._id,
        });
      }
      
      // 🔹 اگر calendarYear ارسال نشده، از year استفاده کن
      const finalCalendarYear = calendarYear || year || new Date().getFullYear().toString();
      
      const form = new EvaluationFormE({
        trainer: new mongoose.Types.ObjectId(trainer),
        Name,
        parentType,
        trainingYear,
        incidentTitle,
        date,
        scores,
        averageScore,
        calendarYear: finalCalendarYear,
      });

      await form.save();
      res.status(201).json({ message: "✅ فرم ذخیره شد", id: form._id });
    } catch (err) {
      console.error("❌ Error saving EvaluationFormE:", err);
      res.status(500).json({ message: "خطا در ذخیره فرم", error: err });
    }
  }

  // 🔹 دریافت همه فرم‌ها یا فیلتر بر اساس trainerId و calendarYear
  static async getAll(req: Request, res: Response) {
    try {
      const { trainerId, calendarYear } = req.query;
      const filter: any = {};
      
      if (trainerId) {
        filter.trainer = new mongoose.Types.ObjectId(trainerId as string);
      }
      if (calendarYear) {
        filter.calendarYear = calendarYear as string;
      }

      const forms = await EvaluationFormE.find(filter)
        .populate("trainer")
        .sort({ createdAt: -1 });

      res.status(200).json(forms);
    } catch (err) {
      console.error("❌ Error fetching EvaluationFormE:", err);
      res.status(500).json({ message: "خطا در دریافت فرم‌ها", error: err });
    }
  }

  // 🔹 دریافت فرم بر اساس ID
  static async getById(req: Request, res: Response) {
    try {
      const form = await EvaluationFormE.findById(req.params.id).populate(
        "trainer"
      );
      if (!form) return res.status(404).json({ message: "فرم پیدا نشد" });
      res.json(form);
    } catch (err) {
      console.error("❌ Error fetching EvaluationFormE:", err);
      res.status(500).json({ message: "خطا در دریافت فرم", error: err });
    }
  }

  // 🔹 بروزرسانی فرم بر اساس ID
  static async update(req: Request, res: Response) {
    try {
      const updated = await EvaluationFormE.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "فرم پیدا نشد" });
      res.json({ message: "✅ فرم بروزرسانی شد", updated });
    } catch (err) {
      console.error("❌ Error updating EvaluationFormE:", err);
      res.status(500).json({ message: "خطا در بروزرسانی فرم", error: err });
    }
  }

  // 🔹 حذف فرم بر اساس ID
  static async delete(req: Request, res: Response) {
    try {
      const deleted = await EvaluationFormE.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "فرم پیدا نشد" });
      res.json({ message: "✅ فرم با موفقیت حذف شد" });
    } catch (err) {
      console.error("❌ Error deleting EvaluationFormE:", err);
      res.status(500).json({ message: "خطا در حذف فرم", error: err });
    }
  }
}
