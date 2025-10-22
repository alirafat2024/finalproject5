/**
 * اسکریپت تست کامل workflow ترینر:
 * 1. ایجاد یک ترینر جدید
 * 2. پر کردن تمام فرم‌های سال اول (C-K)
 * 3. ارتقا به سال دوم و پر کردن فرم‌ها
 * 4. ارتقا به سال سوم و پر کردن فرم‌ها
 * 5. ارتقا به سال چهارم و پر کردن فرم‌ها
 * 6. تست نمایش فرم‌ها بر اساس سال انتخابی
 */

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// رنگ‌ها برای کنسول
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// 1. ایجاد ترینر
async function createTrainer() {
  log('\n📝 مرحله 1: ایجاد ترینر جدید...', colors.blue);
  
  const trainerData = {
    id: `TR-${Date.now()}`,
    name: 'احمد',
    lastName: 'رضایی',
    parentType: 'پدر',
    parentName: 'محمد رضایی',
    province: 'تهران',
    department: 'جراحی',
    specialty: 'جراحی عمومی',
    idNumber: '0123456789',
    academicYear: '1403',
  };

  try {
    const response = await axios.post(`${API_BASE}/trainers`, trainerData);
    log(`✅ ترینر با موفقیت ایجاد شد - ID: ${response.data.trainer._id}`, colors.green);
    return response.data.trainer;
  } catch (error: any) {
    log(`❌ خطا در ایجاد ترینر: ${error.response?.data?.message || error.message}`, colors.red);
    throw error;
  }
}

// 2. پر کردن فرم C (Monograph)
async function fillFormC(trainerId: string, trainingYear: string, calendarYear: string) {
  log(`\n📋 پر کردن فرم C برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    trainingYear,
    calendarYear,
    startYear: calendarYear,
    date: new Date().toISOString().split('T')[0],
    chef: 'دکتر علی احمدی',
    departmentHead: 'دکتر سارا محمدی',
    hospitalHead: 'دکتر حسن کریمی',
    monographTitle: `تحقیق مونوگراف سال ${trainingYear}`,
    scientificAdviser: 'دکتر رضا نظری',
    methodsAdviser: 'دکتر فاطمه حسینی',
    summaryAndConclusion: `این مونوگراف در زمینه جراحی انجام شده است. نتایج نشان می‌دهد که روش‌های جدید بسیار موثر هستند.`,
  };

  try {
    const response = await axios.put(`${API_BASE}/monograph/${trainerId}`, formData);
    log(`✅ فرم C با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم C: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// 3. پر کردن فرم D (Conference)
async function fillFormD(trainerId: string, trainingYear: string, calendarYear: string) {
  log(`\n📋 پر کردن فرم D برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    trainingYear,
    calendarYear,
    date: new Date().toISOString().split('T')[0],
    chef: 'دکتر علی احمدی',
    departmentHead: 'دکتر سارا محمدی',
    hospitalHead: 'دکتر حسن کریمی',
    presentedBy: `احمد رضایی - ${trainingYear}`,
    scientificAdviser: 'دکتر رضا نظری',
    conferenceTopic: `بررسی روش‌های نوین در جراحی - ${trainingYear}`,
    presentationQuality: 'عالی',
    contentRelevance: 'کاملاً مرتبط',
    overallScore: 95,
  };

  try {
    const response = await axios.put(`${API_BASE}/conference/${trainerId}`, formData);
    log(`✅ فرم D با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم D: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// 4. پر کردن فرم E (Evaluation E)
async function fillFormE(trainerId: string, trainingYear: string, calendarYear: string) {
  log(`\n📋 پر کردن فرم E برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    trainingYear,
    calendarYear,
    date: new Date().toISOString().split('T')[0],
    chef: 'دکتر علی احمدی',
    departmentHead: 'دکتر سارا محمدی',
    hospitalHead: 'دکتر حسن کریمی',
    clinicalSkills: 90,
    theoreticalKnowledge: 88,
    professionalBehavior: 95,
    overallPerformance: 91,
    comments: `عملکرد بسیار خوب در ${trainingYear}`,
  };

  try {
    const response = await axios.put(`${API_BASE}/evaluationFormE/${trainerId}`, formData);
    log(`✅ فرم E با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم E: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// 5. پر کردن فرم F (Checklist)
async function fillFormF(trainerId: string, trainingYear: string, calendarYear: string, name: string, parentType: string) {
  log(`\n📋 پر کردن فرم F برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    name,
    parentType,
    trainingYear,
    sections: [
      {
        name: 'آغاز فعالیت (10%)',
        activities: [
          {
            id: 'uniform',
            title: 'یونیفورم',
            percent: 6,
            months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 5 + (i % 2) })),
            total: 66,
          },
          {
            id: 'coworkers',
            title: 'برخورد با همکاران',
            percent: 2,
            months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 2 })),
            total: 24,
          },
          {
            id: 'patients',
            title: 'برخورد با مریض',
            percent: 2,
            months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 2 })),
            total: 24,
          },
        ],
      },
      {
        name: 'دسپلین (24%)',
        activities: [
          {
            id: 'attendance',
            title: 'حاضر بودن',
            percent: 6,
            months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: 6 })),
            total: 72,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.put(`${API_BASE}/checklists/${trainerId}`, formData);
    log(`✅ فرم F با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم F: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// 6. پر کردن فرم G (Evaluation G)
async function fillFormG(trainerId: string, trainingYear: string, calendarYear: string) {
  log(`\n📋 پر کردن فرم G برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    trainingYear,
    calendarYear,
    date: new Date().toISOString().split('T')[0],
    chef: 'دکتر علی احمدی',
    departmentHead: 'دکتر سارا محمدی',
    hospitalHead: 'دکتر حسن کریمی',
    clinicalCompetence: 92,
    researchAbility: 85,
    teachingSkills: 88,
    overallRating: 90,
    recommendations: `پیشنهاد می‌شود در ${trainingYear} به تحقیقات بیشتری بپردازد`,
  };

  try {
    const response = await axios.put(`${API_BASE}/evaluationFormG/${trainerId}`, formData);
    log(`✅ فرم G با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم G: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// 7. پر کردن فرم H (Evaluation H)
async function fillFormH(trainerId: string, trainingYear: string, calendarYear: string) {
  log(`\n📋 پر کردن فرم H برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    trainingYear,
    calendarYear,
    date: new Date().toISOString().split('T')[0],
    chef: 'دکتر علی احمدی',
    departmentHead: 'دکتر سارا محمدی',
    hospitalHead: 'دکتر حسن کریمی',
    surgicalSkills: 93,
    patientCare: 91,
    teamwork: 94,
    professionalism: 95,
    overallScore: 93,
    additionalComments: `عملکرد عالی در ${trainingYear}`,
  };

  try {
    const response = await axios.put(`${API_BASE}/evaluationFormH/${trainerId}`, formData);
    log(`✅ فرم H با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم H: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// 8. پر کردن فرم I (Rotation)
async function fillFormI(trainerId: string, trainingYear: string, calendarYear: string) {
  log(`\n📋 پر کردن فرم I برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    trainingYear,
    calendarYear,
    rotations: [
      {
        department: 'جراحی عمومی',
        startDate: `${calendarYear}-01-01`,
        endDate: `${calendarYear}-03-31`,
        supervisor: 'دکتر علی احمدی',
        performanceScore: 92,
      },
      {
        department: 'جراحی اطفال',
        startDate: `${calendarYear}-04-01`,
        endDate: `${calendarYear}-06-30`,
        supervisor: 'دکتر سارا محمدی',
        performanceScore: 88,
      },
    ],
  };

  try {
    const response = await axios.put(`${API_BASE}/rotation-form/form/${trainerId}`, formData);
    log(`✅ فرم I با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم I: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// 9. پر کردن فرم J (Teacher Activity)
async function fillFormJ(trainerId: string, trainingYear: string, calendarYear: string) {
  log(`\n📋 پر کردن فرم J برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    trainingYear,
    calendarYear,
    activities: [
      {
        type: 'سخنرانی',
        title: `سخنرانی درباره جراحی - ${trainingYear}`,
        date: `${calendarYear}-05-15`,
        duration: 2,
        audience: 'دانشجویان پزشکی',
      },
      {
        type: 'کارگاه',
        title: `کارگاه آموزشی مهارت‌های جراحی - ${trainingYear}`,
        date: `${calendarYear}-08-20`,
        duration: 4,
        audience: 'رزیدنت‌ها',
      },
    ],
  };

  try {
    const response = await axios.put(`${API_BASE}/teacher-activities/${trainerId}`, formData);
    log(`✅ فرم J با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم J: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// 10. پر کردن فرم K (Monograph Evaluation)
async function fillFormK(trainerId: string, trainingYear: string, calendarYear: string) {
  log(`\n📋 پر کردن فرم K برای ${trainingYear}...`, colors.yellow);
  
  const formData = {
    trainerId,
    trainingYear,
    calendarYear,
    date: new Date().toISOString().split('T')[0],
    chef: 'دکتر علی احمدی',
    departmentHead: 'دکتر سارا محمدی',
    hospitalHead: 'دکتر حسن کریمی',
    monographTitle: `ارزیابی مونوگراف ${trainingYear}`,
    evaluator: 'دکتر رضا نظری',
    contentQuality: 90,
    researchMethodology: 88,
    literatureReview: 92,
    writingQuality: 91,
    overallScore: 90,
    evaluatorComments: `مونوگراف بسیار خوبی برای ${trainingYear}`,
  };

  try {
    const response = await axios.put(`${API_BASE}/monographEvaluation/${trainerId}`, formData);
    log(`✅ فرم K با موفقیت پر شد`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در پر کردن فرم K: ${error.response?.data?.message || error.message}`, colors.red);
  }
}

// پر کردن همه فرم‌ها برای یک سال
async function fillAllFormsForYear(
  trainerId: string,
  trainingYear: string,
  calendarYear: string,
  trainerName: string,
  parentType: string
) {
  log(`\n🎯 شروع پر کردن تمام فرم‌ها برای ${trainingYear} (سال ${calendarYear})`, colors.magenta);
  
  await fillFormC(trainerId, trainingYear, calendarYear);
  await fillFormD(trainerId, trainingYear, calendarYear);
  await fillFormE(trainerId, trainingYear, calendarYear);
  await fillFormF(trainerId, trainingYear, calendarYear, trainerName, parentType);
  await fillFormG(trainerId, trainingYear, calendarYear);
  await fillFormH(trainerId, trainingYear, calendarYear);
  await fillFormI(trainerId, trainingYear, calendarYear);
  await fillFormJ(trainerId, trainingYear, calendarYear);
  await fillFormK(trainerId, trainingYear, calendarYear);
  
  log(`\n✅ تمام فرم‌های ${trainingYear} با موفقیت پر شدند`, colors.green);
}

// ارتقای ترینر به سال بعد
async function promoteTrainer(trainerId: string, nextYear: string, nextAcademicYear: string) {
  log(`\n⬆️  ارتقای ترینر به ${nextYear}...`, colors.blue);
  
  try {
    const response = await axios.post(`${API_BASE}/trainers/${trainerId}/promote`, {
      nextYear,
      academicYear: nextAcademicYear,
    });
    log(`✅ ترینر با موفقیت به ${nextYear} ارتقا یافت`, colors.green);
    return response.data;
  } catch (error: any) {
    log(`❌ خطا در ارتقا ترینر: ${error.response?.data?.message || error.message}`, colors.red);
    throw error;
  }
}

// تست نمایش فرم‌ها بر اساس سال
async function testYearFiltering(trainerId: string) {
  log(`\n🔍 تست فیلتر فرم‌ها بر اساس سال...`, colors.blue);
  
  const years = ['1403', '1404', '1405', '1406'];
  
  for (const year of years) {
    try {
      const response = await axios.get(`${API_BASE}/monograph`, {
        params: { trainerId, calendarYear: year },
      });
      
      if (response.data && response.data.length > 0) {
        log(`✅ فرم‌های سال ${year} یافت شد: ${response.data.length} فرم`, colors.green);
      } else {
        log(`⚠️  هیچ فرمی برای سال ${year} یافت نشد`, colors.yellow);
      }
    } catch (error: any) {
      log(`❌ خطا در دریافت فرم‌های سال ${year}: ${error.message}`, colors.red);
    }
  }
}

// اجرای کامل workflow
async function main() {
  try {
    log('🚀 شروع تست کامل workflow ترینر', colors.magenta);
    log('━'.repeat(60), colors.magenta);
    
    // 1. ایجاد ترینر
    const trainer = await createTrainer();
    const trainerId = trainer._id;
    const trainerName = `${trainer.name} ${trainer.lastName}`;
    
    // 2. پر کردن فرم‌های سال اول
    await fillAllFormsForYear(trainerId, 'سال اول', '1403', trainer.name, trainer.parentType);
    
    // 3. ارتقا به سال دوم و پر کردن فرم‌ها
    await promoteTrainer(trainerId, 'سال دوم', '1404');
    await fillAllFormsForYear(trainerId, 'سال دوم', '1404', trainer.name, trainer.parentType);
    
    // 4. ارتقا به سال سوم و پر کردن فرم‌ها
    await promoteTrainer(trainerId, 'سال سوم', '1405');
    await fillAllFormsForYear(trainerId, 'سال سوم', '1405', trainer.name, trainer.parentType);
    
    // 5. ارتقا به سال چهارم و پر کردن فرم‌ها
    await promoteTrainer(trainerId, 'سال چهارم', '1406');
    await fillAllFormsForYear(trainerId, 'سال چهارم', '1406', trainer.name, trainer.parentType);
    
    // 6. تست فیلتر فرم‌ها بر اساس سال
    await testYearFiltering(trainerId);
    
    log('\n━'.repeat(60), colors.magenta);
    log('🎉 تست کامل با موفقیت به پایان رسید!', colors.green);
    log(`📌 ID ترینر: ${trainerId}`, colors.blue);
    log(`📌 نام ترینر: ${trainerName}`, colors.blue);
    log('\nترینر برای ۴ سال ایجاد شد و تمام فرم‌ها پر شدند.', colors.green);
    
  } catch (error: any) {
    log('\n❌ خطای کلی در اجرای workflow:', colors.red);
    log(error.message, colors.red);
    process.exit(1);
  }
}

// اجرا
main();
