import { Request, Response } from "express";
import mongoose from "mongoose";
import { MonographEvaluationForm } from "../models/form-C";

export class MonographController {
  // 🟢 ایجاد فرم جدید
  static async create(req: Request, res: Response) {
    try {
      const {
        trainer,
        evaluations,
        name,
        lastName,
        parentType,
        idNumber,
        department,
        trainingYear,
        startYear,
        date,
        chef,
        departmentHead,
        hospitalHead,
        calendarYear,
      } = req.body;

      // 🔹 بررسی شناسه ترینر
      if (!trainer) {
        return res
          .status(400)
          .json({ message: "Trainer ID الزامی است و فرم ذخیره نمی‌شود." });
      }

      // 🔹 بررسی مقادیر اجباری
      const requiredFields = {
        name,
        lastName,
        parentType,
        idNumber,
        department,
        trainingYear,
        startYear,
        date,
        chef,
        departmentHead,
        hospitalHead,
      };

      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.toString().trim() === "") {
          return res.status(400).json({
            message: `فیلد "${key}" الزامی است و نمی‌تواند خالی باشد.`,
          });
        }
      }

      // 🔹 بررسی آرایه ارزیابی‌ها
      if (!Array.isArray(evaluations) || evaluations.length === 0) {
        return res
          .status(400)
          .json({ message: "لیست ارزیابی‌ها خالی است یا ساختار اشتباه دارد." });
      }

      // 🔹 بررسی ObjectId معتبر
      if (!mongoose.Types.ObjectId.isValid(trainer)) {
        return res.status(400).json({ message: "شناسه Trainer نامعتبر است." });
      }

      // 🔹 جلوگیری از ثبت فرم تکراری (بر اساس چندین مشخصه)
      const existingForm = await MonographEvaluationForm.findOne({
        trainer: new mongoose.Types.ObjectId(trainer),
        name: name.trim(),
        lastName: lastName.trim(),
        parentType: parentType.trim(),
        idNumber: idNumber.trim(),
        department: department.trim(),
        trainingYear: trainingYear.toString().trim(),
        startYear: startYear.toString().trim(),
      });

      if (existingForm) {
        return res.status(400).json({
          message:
            "⚠️ فرم با همین مشخصات قبلاً ثبت شده و امکان ثبت مجدد وجود ندارد.",
          formId: existingForm._id,
        });
      }

      // ✅ ایجاد فرم جدید
      // 🔹 اگر calendarYear ارسال نشده، از startYear استفاده کن
      const finalCalendarYear = calendarYear || startYear;
      
      const newForm = new MonographEvaluationForm({
        trainer: new mongoose.Types.ObjectId(trainer),
        name,
        lastName,
        parentType,
        idNumber,
        department,
        trainingYear,
        startYear,
        calendarYear: finalCalendarYear,
        date,
        chef,
        departmentHead,
        hospitalHead,
        evaluations,
      });

      await newForm.save();
      return res.status(201).json({
        message: "✅ فرم با موفقیت ذخیره شد.",
        id: newForm._id,
      });
    } catch (err) {
      console.error("❌ خطا در ذخیره فرم مونوگراف:", err);
      return res.status(500).json({
        message: "خطا در ذخیره فرم. لطفاً بعداً دوباره تلاش کنید.",
        error: err instanceof Error ? err.message : err,
      });
    }
  }

  // 🟢 دریافت همه فرم‌ها (با فیلتر trainerId و calendarYear)
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

      const forms = await MonographEvaluationForm.find(filter)
        .populate("trainer")
        .sort({ createdAt: -1 });

      res.status(200).json(forms);
    } catch (err) {
      console.error("❌ خطا در دریافت لیست فرم‌ها:", err);
      res.status(500).json({
        message: "خطا در دریافت داده‌ها",
        error: err instanceof Error ? err.message : err,
      });
    }
  }

  // 🟢 دریافت فرم بر اساس ID
  static async getById(req: Request, res: Response) {
    try {
      const form = await MonographEvaluationForm.findById(
        req.params.id
      ).populate("trainer");
      if (!form)
        return res.status(404).json({ message: "فرم مورد نظر پیدا نشد." });
      res.json(form);
    } catch (err) {
      console.error("❌ خطا در دریافت فرم:", err);
      res.status(500).json({
        message: "خطا در دریافت فرم",
        error: err instanceof Error ? err.message : err,
      });
    }
  }

  // 🟢 بروزرسانی فرم بر اساس ID
  static async update(req: Request, res: Response) {
    try {
      const updated = await MonographEvaluationForm.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "فرم پیدا نشد." });

      res.json({
        message: "✅ فرم با موفقیت بروزرسانی شد.",
        updated,
      });
    } catch (err) {
      console.error("❌ خطا در بروزرسانی فرم:", err);
      res.status(500).json({
        message: "خطا در بروزرسانی فرم",
        error: err instanceof Error ? err.message : err,
      });
    }
  }

  // 🟢 حذف فرم بر اساس ID
  static async delete(req: Request, res: Response) {
    try {
      const deleted = await MonographEvaluationForm.findByIdAndDelete(
        req.params.id
      );
      if (!deleted) return res.status(404).json({ message: "فرم پیدا نشد." });
      res.json({ message: "✅ فرم با موفقیت حذف شد." });
    } catch (err) {
      console.error("❌ خطا در حذف فرم:", err);
      res.status(500).json({
        message: "خطا در حذف فرم",
        error: err instanceof Error ? err.message : err,
      });
    }
  }
}
