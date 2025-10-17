import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEvaluationFormE extends Document {
  trainer: Types.ObjectId;
  Name: string;
  parentType: string;
  trainingYear: string;
  calendarYear: string; // سال تقویمی
  incidentTitle: string;
  date: string;
  scores: { score: string; teacherName: string; notes?: string }[]; // 👈 آرایه
  averageScore: string;
}

const EvaluationFormESchema = new Schema<IEvaluationFormE>(
  {
    trainer: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    Name: { type: String, required: true },
    parentType: { type: String, required: true },
    trainingYear: { type: String, required: true },
    calendarYear: { type: String, default: "" },
    incidentTitle: { type: String, required: true },
    date: { type: String, required: true },
    scores: [
      {
        score: { type: String, default: "" },
        teacherName: { type: String, default: "" },
        notes: { type: String, default: "" }
      }
    ],
    averageScore: { type: String, default: "" },
  },
  { timestamps: true }
);

export const EvaluationFormE = mongoose.model<IEvaluationFormE>(
  "EvaluationFormE",
  EvaluationFormESchema
);
