
import { Request, Response } from "express";
import Checklist from "../models/form-F";

// 🔹 Create new Form-F (Checklist)
export const createChecklist = async (req: Request, res: Response) => {
  try {
    const { trainerId, name, parentType, trainingYear, sections, calendarYear, year } = req.body;

    if (!trainerId) 
      return res.status(400).json({ message: "TrainerId الزامی است" });
    if (!name || !parentType || !trainingYear || !sections) {
      return res.status(400).json({ message: "اطلاعات ناقص است" });
    }

    // 🔹 اگر calendarYear ارسال نشده، از year استفاده کن
    const finalCalendarYear = calendarYear || year || new Date().getFullYear().toString();

    const checklist = new Checklist({
      trainerId,
      name,
      parentType,
      trainingYear,
      calendarYear: finalCalendarYear,
      sections,
    });

    const savedChecklist = await checklist.save();
    res.status(201).json(savedChecklist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ایجاد فرم" });
  }
};

// 🔹 Get all Form-Fs for a specific trainer
export const getChecklists = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.params;

    if (!trainerId) return res.status(400).json({ message: "TrainerId الزامی است" });

    const checklists = await Checklist.find({ trainerId }).sort({ createdAt: -1 });
    res.json(checklists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت فرم‌ها" });
  }
};

// 🔹 Get a single Form-F by ID
export const getChecklistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const checklist = await Checklist.findById(id);
    if (!checklist) return res.status(404).json({ message: "فرم یافت نشد" });
    res.json(checklist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت فرم" });
  }
};

// 🔹 Update Form-F by ID
export const updateChecklist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedChecklist = await Checklist.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedChecklist) return res.status(404).json({ message: "فرم یافت نشد" });
    res.json(updatedChecklist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در بروزرسانی فرم" });
  }
};

// 🔹 Delete Form-F by ID
export const deleteChecklist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedChecklist = await Checklist.findByIdAndDelete(id);
    if (!deletedChecklist) return res.status(404).json({ message: "فرم یافت نشد" });
    res.json({ message: "فرم با موفقیت حذف شد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در حذف فرم" });
  }
};

