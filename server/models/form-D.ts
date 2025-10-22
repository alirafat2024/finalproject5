import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * هر ردیف کنفرانس
 */
export interface IConferenceItem {
  conferenceTitle: string;
  score: string;
  date: string;
  teacherName: string;
  teacherSigned?: boolean;
}

/**
 * فرم ارزیابی کنفرانس
 */
export interface IConferenceEvaluation extends Document {
  trainer: Types.ObjectId;
  year: string;
  name: string;
  parentType: string;
  department: string;
  trainingYear: string;
  calendarYear: string; // سال تقویمی
  conferences: IConferenceItem[];
  notes?: boolean;
  departmentHead?: string;
  programHead?: string;
  hospitalHead?: string;
}

const ConferenceItemSchema = new Schema<IConferenceItem>({
  conferenceTitle: { type: String, required: true },
  score: { type: String, required: true },
  date: { type: String, required: true },
  teacherName: { type: String, required: true },
  teacherSigned: { type: Boolean, default: false },
});

const ConferenceEvaluationSchema = new Schema<IConferenceEvaluation>(
  {
    trainer: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    year: { type: String, required: true },
    name: { type: String, required: true },
    parentType: { type: String, default: "" },
    department: { type: String, default: "" },
    trainingYear: { type: String, required: true },
    calendarYear: { type: String, default: "" },
    conferences: [ConferenceItemSchema],
    notes: { type: Boolean, default: false },
    departmentHead: { type: String, default: "" },
    programHead: { type: String, default: "" },
    hospitalHead: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ConferenceEvaluation = mongoose.model<IConferenceEvaluation>(
  "ConferenceEvaluation",
  ConferenceEvaluationSchema
);
