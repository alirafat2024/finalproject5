import express from "express";
import { MonographEvaluationForm } from "../models/form-C";
import { ConferenceEvaluation } from "../models/form-D";
import { EvaluationFormE } from "../models/form-E";
import { Checklist } from "../models/form-F";
import { EvaluationFormG } from "../models/form-G";
import { EvaluationFormH } from "../models/form-H";
import RotationForm from "../models/form-I";
import { TeacherActivityModel } from "../models/form-J";
import { MonographEvaluation } from "../models/form-K";

const router = express.Router();

router.post("/migrate-calendar-years", async (req, res) => {
  try {
    let updated = 0;

    // Form C - از startYear استفاده کن
    const formsC = await MonographEvaluationForm.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsC) {
      form.calendarYear = form.startYear || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    // Form D - از year استفاده کن
    const formsD = await ConferenceEvaluation.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsD) {
      form.calendarYear = (form as any).year || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    // Form E - از year استفاده کن
    const formsE = await EvaluationFormE.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsE) {
      form.calendarYear = (form as any).year || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    // Form F - از year استفاده کن
    const formsF = await Checklist.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsF) {
      form.calendarYear = (form as any).year || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    // Form G - از personalInfo.year استفاده کن
    const formsG = await EvaluationFormG.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsG) {
      form.calendarYear = (form.personalInfo as any)?.year || (form.personalInfo as any)?.calendarYear || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    // Form H - از year استفاده کن
    const formsH = await EvaluationFormH.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsH) {
      form.calendarYear = (form as any).year || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    // Form I - از year استفاده کن
    const formsI = await RotationForm.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsI) {
      form.calendarYear = (form as any).year || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    // Form J - از year استفاده کن
    const formsJ = await TeacherActivityModel.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsJ) {
      form.calendarYear = (form as any).year || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    // Form K - از startYear استفاده کن
    const formsK = await MonographEvaluation.find({
      $or: [
        { calendarYear: { $exists: false } },
        { calendarYear: "" },
        { calendarYear: null }
      ]
    });
    for (const form of formsK) {
      form.calendarYear = form.startYear || new Date().getFullYear().toString();
      await form.save();
      updated++;
    }

    res.json({
      message: `✅ Migration completed successfully. ${updated} forms updated.`,
      updated,
      details: {
        formC: formsC.length,
        formD: formsD.length,
        formE: formsE.length,
        formF: formsF.length,
        formG: formsG.length,
        formH: formsH.length,
        formI: formsI.length,
        formJ: formsJ.length,
        formK: formsK.length,
      }
    });
  } catch (err) {
    console.error("❌ Migration error:", err);
    res.status(500).json({
      message: "خطا در migration",
      error: err instanceof Error ? err.message : err
    });
  }
});

export default router;
