import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITrainingYearRecord {
  yearLabel: "سال اول" | "سال دوم" | "سال سوم" | "سال چهارم";
  academicYear: string;
  startYear: string;
  endYear?: string;
  status: "در حال آموزش" | "ختم شده";
  forms: {
    formC?: Types.ObjectId;
    formD?: Types.ObjectId;
    formE?: Types.ObjectId;
    formF?: Types.ObjectId;
    formG?: Types.ObjectId;
    formH?: Types.ObjectId;
    formI?: Types.ObjectId;
    formJ?: Types.ObjectId;
    formK?: Types.ObjectId;
  };
}

export interface ITrainerProgress extends Document {
  trainer: Types.ObjectId;
  startYear: string;
  currentTrainingYear: "سال اول" | "سال دوم" | "سال سوم" | "سال چهارم";
  trainingHistory: ITrainingYearRecord[];
  promoted: boolean;
  lastUpdated: Date;
}

const TrainingYearRecordSchema = new Schema<ITrainingYearRecord>({
  yearLabel: { type: String, enum: ["سال اول", "سال دوم", "سال سوم", "سال چهارم"], required: true },
  academicYear: { type: String, required: true },
  startYear: { type: String, required: true },
  endYear: { type: String },
  status: { type: String, enum: ["در حال آموزش", "ختم شده"], default: "در حال آموزش" },
  forms: {
    formC: { type: Schema.Types.ObjectId, ref: "MonographEvaluationForm" },
    formD: { type: Schema.Types.ObjectId, ref: "ConferenceEvaluation" },
    formE: { type: Schema.Types.ObjectId, ref: "EvaluationFormE" },
    formF: { type: Schema.Types.ObjectId, ref: "FormF" },
    formG: { type: Schema.Types.ObjectId, ref: "EvaluationFormG" },
    formH: { type: Schema.Types.ObjectId, ref: "EvaluationFormH" },
    formI: { type: Schema.Types.ObjectId, ref: "FormI" },
    formJ: { type: Schema.Types.ObjectId, ref: "TeacherActivity" },
    formK: { type: Schema.Types.ObjectId, ref: "MonographEvaluation" },
  },
});

const TrainerProgressSchema = new Schema<ITrainerProgress>(
  {
    trainer: { type: Schema.Types.ObjectId, ref: "Trainer", required: true, unique: true },
    startYear: { type: String, required: true },
    currentTrainingYear: { type: String, enum: ["سال اول", "سال دوم", "سال سوم", "سال چهارم"], required: true },
    trainingHistory: { type: [TrainingYearRecordSchema], default: [] },
    promoted: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TrainerProgress =
  mongoose.models.TrainerProgress ||
  mongoose.model<ITrainerProgress>("TrainerProgress", TrainerProgressSchema);
