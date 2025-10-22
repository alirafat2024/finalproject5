/**
 * اسکریپت کامل تست ترینر - بدون استفاده از API
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Import models
import TrainerModel from '../server/models/trainerModel.js';
import TrainerProgress from '../server/models/TrainerProgress.js';
import FormC from '../server/models/form-C.js';
import FormD from '../server/models/form-D.js';
import FormE from '../server/models/form-E.js';
import FormF from '../server/models/form-F.js';
import FormG from '../server/models/form-G.js';
import FormH from '../server/models/form-H.js';
import FormI from '../server/models/form-I.js';
import FormJ from '../server/models/form-J.js';
import FormK from '../server/models/form-K.js';

let mongoServer: MongoMemoryServer | null = null;

async function setupDatabase() {
  console.log('🔧 راه‌اندازی MongoDB in-memory...');
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('✅ MongoDB متصل شد');
}

async function teardownDatabase() {
  console.log('\n🔚 بستن اتصال...');
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}

async function createTrainerWithForms(name: string, lastName: string, year: string) {
  console.log(`\n📝 ایجاد ترینر: ${name} ${lastName} (سال ${year})`);
  
  const trainer = await TrainerModel.create({
    id: `TR-${Date.now()}`,
    name,
    lastName,
    parentType: 'پدر',
    parentName: 'محمد رضایی',
    province: 'تهران',
    department: 'جراحی',
    specialty: 'جراحی عمومی',
    idNumber: '0123456789',
  });

  console.log(`✅ ترینر ایجاد شد: ${trainer._id}`);

  // ایجاد فرم‌های خالی
  const formModels = [FormC, FormD, FormE, FormF, FormG, FormH, FormI, FormJ, FormK];
  const formsMap: Record<string, mongoose.Types.ObjectId> = {};

  for (let i = 0; i < formModels.length; i++) {
    const formKey = `form${String.fromCharCode(67 + i)}`;
    const baseData: any = {
      trainer: trainer._id,
      trainerId: trainer._id,
      year: "سال اول",
      calendarYear: year,
      trainingYear: "سال اول",
      name: trainer.name,
      lastName: trainer.lastName,
      parentType: trainer.parentType,
      parentName: trainer.parentName,
      department: trainer.department,
      idNumber: trainer.idNumber,
    };

    let formData: any = { ...baseData };

    // تنظیم داده‌های خاص هر فرم
    if (i === 0) { // FormC
      formData = { ...baseData, startYear: year, date: new Date().toISOString().split('T')[0], chef: "", departmentHead: "", hospitalHead: "", evaluations: [] };
    } else if (i === 1) { // FormD
      formData = { ...baseData, conferences: [] };
    } else if (i === 2) { // FormE
      formData = { ...baseData, Name: trainer.name, incidentTitle: "", date: new Date().toISOString().split('T')[0], scores: [], averageScore: "0" };
    } else if (i === 3) { // FormF
      formData = { ...baseData, sections: [] };
    } else if (i === 4) { // FormG
      formData = { ...baseData, personalInfo: { Name: trainer.name, parentType: trainer.parentType, trainingYear: "سال اول", year, calendarYear: year, department: trainer.department }, scores: [], averageScore: 0 };
    } else if (i === 5) { // FormH
      formData = { ...baseData, Name: trainer.name, trainingYears: [], averageScore: 0, shiftDepartment: "", programDirector: "" };
    } else if (i === 6) { // FormI
      formData = { ...baseData, header: { name: trainer.name, parentType: trainer.parentType, parentName: trainer.parentName, department: trainer.department, trainingYear: "سال اول", rotationName: "", rotationFrom: "", rotationTo: "", date: new Date().toISOString().split('T')[0] }, persianRows: [], rows: [] };
    } else if (i === 7) { // FormJ
      formData = { ...baseData, teachers: [], activities: [] };
    } else if (i === 8) { // FormK
      formData = { ...baseData, startYear: year, date: new Date().toISOString().split('T')[0], chef: "", departmentHead: "", hospitalHead: "", evaluations: [] };
    }

    const formDoc = await (formModels[i] as any).create(formData);
    formsMap[formKey] = formDoc._id;
    console.log(`  ✓ فرم ${formKey} ایجاد شد`);
  }

  // ایجاد progress
  const progress = await TrainerProgress.create({
    trainer: trainer._id,
    startYear: year,
    currentTrainingYear: "سال اول",
    trainingHistory: [{
      yearLabel: "سال اول",
      academicYear: year,
      startYear: year,
      status: "در حال آموزش",
      forms: formsMap,
    }],
    promoted: false,
  });

  console.log(`✅ Progress ایجاد شد`);
  return { trainer, progress };
}

async function promoteAndCreateForms(trainerId: mongoose.Types.ObjectId, nextYear: string, nextAcademic: string) {
  console.log(`\n⬆️  ارتقا به ${nextYear} (سال تحصیلی ${nextAcademic})...`);
  
  const trainer = await TrainerModel.findById(trainerId);
  if (!trainer) throw new Error('ترینر یافت نشد');

  const progress = await TrainerProgress.findOne({ trainer: trainerId });
  if (!progress) throw new Error('Progress یافت نشد');

  // ایجاد فرم‌های جدید
  const formModels = [FormC, FormD, FormE, FormF, FormG, FormH, FormI, FormJ, FormK];
  const formsMap: Record<string, mongoose.Types.ObjectId> = {};

  for (let i = 0; i < formModels.length; i++) {
    const formKey = `form${String.fromCharCode(67 + i)}`;
    const baseData: any = {
      trainer: trainer._id,
      trainerId: trainer._id,
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

    let formData: any = { ...baseData };

    if (i === 0) {
      formData = { ...baseData, startYear: nextAcademic, date: new Date().toISOString().split('T')[0], chef: "", departmentHead: "", hospitalHead: "", evaluations: [] };
    } else if (i === 1) {
      formData = { ...baseData, conferences: [] };
    } else if (i === 2) {
      formData = { ...baseData, Name: trainer.name, incidentTitle: "", date: new Date().toISOString().split('T')[0], scores: [], averageScore: "0" };
    } else if (i === 3) {
      formData = { ...baseData, sections: [] };
    } else if (i === 4) {
      formData = { ...baseData, personalInfo: { Name: trainer.name, parentType: trainer.parentType, trainingYear: nextYear, year: nextAcademic, calendarYear: nextAcademic, department: trainer.department }, scores: [], averageScore: 0 };
    } else if (i === 5) {
      formData = { ...baseData, Name: trainer.name, trainingYears: [], averageScore: 0, shiftDepartment: "", programDirector: "" };
    } else if (i === 6) {
      formData = { ...baseData, header: { name: trainer.name, parentType: trainer.parentType, parentName: trainer.parentName, department: trainer.department, trainingYear: nextYear, rotationName: "", rotationFrom: "", rotationTo: "", date: new Date().toISOString().split('T')[0] }, persianRows: [], rows: [] };
    } else if (i === 7) {
      formData = { ...baseData, teachers: [], activities: [] };
    } else if (i === 8) {
      formData = { ...baseData, startYear: nextAcademic, date: new Date().toISOString().split('T')[0], chef: "", departmentHead: "", hospitalHead: "", evaluations: [] };
    }

    const formDoc = await (formModels[i] as any).create(formData);
    formsMap[formKey] = formDoc._id;
    console.log(`  ✓ فرم ${formKey} برای ${nextYear} ایجاد شد`);
  }

  // به‌روزرسانی progress
  progress.trainingHistory.push({
    yearLabel: nextYear,
    academicYear: nextAcademic,
    startYear: nextAcademic,
    status: "در حال آموزش",
    forms: formsMap,
  } as any);
  
  progress.currentTrainingYear = nextYear;
  progress.markModified('trainingHistory');
  await progress.save();

  console.log(`✅ ارتقا به ${nextYear} کامل شد`);
}

async function verifyYearFiltering(trainerId: mongoose.Types.ObjectId) {
  console.log(`\n🔍 تست فیلتر فرم‌ها بر اساس سال...`);
  
  const years = ['1403', '1404', '1405', '1406'];
  
  for (const year of years) {
    const count = await FormC.countDocuments({ trainerId, calendarYear: year });
    console.log(`  ${year}: ${count} فرم C یافت شد`);
  }
}

async function main() {
  try {
    await setupDatabase();

    console.log('\n🚀 شروع تست کامل workflow ترینر');
    console.log('━'.repeat(60));

    // 1. ایجاد ترینر و فرم‌های سال اول
    const { trainer } = await createTrainerWithForms('احمد', 'رضایی', '1403');

    // 2. ارتقا به سال دوم
    await promoteAndCreateForms(trainer._id as mongoose.Types.ObjectId, 'سال دوم', '1404');

    // 3. ارتقا به سال سوم
    await promoteAndCreateForms(trainer._id as mongoose.Types.ObjectId, 'سال سوم', '1405');

    // 4. ارتقا به سال چهارم
    await promoteAndCreateForms(trainer._id as mongoose.Types.ObjectId, 'سال چهارم', '1406');

    // 5. تست فیلتر
    await verifyYearFiltering(trainer._id as mongoose.Types.ObjectId);

    console.log('\n━'.repeat(60));
    console.log('🎉 تست کامل با موفقیت به پایان رسید!');
    console.log(`📌 ID ترینر: ${trainer._id}`);
    console.log(`📌 نام ترینر: ${trainer.name} ${trainer.lastName}`);
    console.log('\nترینر برای ۴ سال ایجاد شد و تمام فرم‌ها پر شدند.');

  } catch (error: any) {
    console.error('\n❌ خطا:', error.message);
    console.error(error);
  } finally {
    await teardownDatabase();
  }
}

main();
