import React, { useState, useEffect } from "react";
interface MonographEvaluation {
  section: string;
  percentage: string;
  score: string;
  teacherName: string;
}
interface MonographEvaluationFormCProps {
  trainerIdProp?: string; // ✅ امکان گرفتن trainerId مستقیماً از والد
}

export default function MonographEvaluationFormC({
  trainerIdProp,
}: MonographEvaluationFormCProps) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [parentType, setparentType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [trainingYear, setTrainingYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [date, setDate] = useState("");
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [chef, setChef] = useState("");
  const [departmentHead, setDepartmentHead] = useState("");
  const [hospitalHead, setHospitalHead] = useState("");
  // ✅ گرفتن trainerId از Context
  // ✅ وقتی trainerIdProp آماده شد، trainerId تنظیم می‌شود و داده از دیتابیس گرفته می‌شود
  useEffect(() => {
    if (!trainerIdProp) {
      alert("هیچ ترینر فعالی یافت نشد!");
      return;
    }

    setTrainerId(trainerIdProp);

    // 👇 دریافت داده از دیتابیس
    const fetchTrainerInfo = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/trainers/${trainerIdProp}`
        );
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "خطا در دریافت ترینر");

        // فرض می‌کنیم دیتابیس این فیلدها را دارد:
        // name, fatherName, trainingYear
        setName(result.name || "");
        setparentType(result.parentType || "");
        setTrainingYear(result.trainingYear || "");
        setIdNumber(result.idNumber||"");
        setLastName(result.lastName||"");
        setDepartment(result.department||"");
      } catch (err) {
        console.error("خطا در دریافت ترینر:", err);
        alert("خطا در دریافت اطلاعات ترینر ❌");
      }
    };

    fetchTrainerInfo();
  }, [trainerIdProp]);
 
  // بخش‌های ثابت فرم + سه بخش جدید
  const sections = [
    "نمره کنفرانسهای طول سال",
    "نمره امتحان نهایی عملی و تقرری",
    "نمره تست های چهار ماهه",
    "نمره case presentation",
    "نمره سیکل",
    "مجموع نمرات",
    "نتیجه نهایی",
  ];

  const [evaluations, setEvaluations] = useState<MonographEvaluation[]>(
    sections.map((s) => ({
      section: s,
      percentage: "",
      score: "",
      teacherName: "",
    }))
  );

  const handleEvalChange = (
    index: number,
    fieldName: keyof MonographEvaluation,
    value: string
  ) => {
    const updated = [...evaluations];
    (updated[index] as any)[fieldName] = value;
    setEvaluations(updated);
  };

  const inputClass = "border rounded px-2 py-2 w-full text-center";

  const handleSubmit = async () => {
    // 🔹 بررسی شناسه ترینر
    if (!trainerId) {
      alert("❌ هیچ ترینر فعالی یافت نشد!");
      return;
    }

    // 🔹 بررسی فیلدهای اطلاعات شخصی
    const personalFields = {
      name,
      lastName,  
      parentType,
      idNumber,
      department,
      trainingYear,
      startYear,
      date,
    };

    for (const [key, value] of Object.entries(personalFields)) {
      if (!value.trim()) {
        alert("⚠️ لطفاً تمام معلومات شخصی را وارد کنید.");
        return;
      }
    }

    // 🔹 بررسی پر بودن تمام ردیف‌های ارزیابی
    for (let i = 0; i < evaluations.length; i++) {
      const ev = evaluations[i];
      if (!ev.percentage.trim() || !ev.score.trim() || !ev.teacherName.trim()) {
        alert(`⚠️ تمام خانه‌های ردیف "${ev.section}" باید پُر شود.`);
        return;
      }
    }

    // 🔹 بررسی پر بودن بخش‌های آخر فرم
    if (!chef.trim() || !departmentHead.trim() || !hospitalHead.trim()) {
      alert("⚠️ لطفاً نام شف، آمر پروگرام و رئیس شفاخانه را وارد کنید.");
      return;
    }

    // ✅ ساخت payload نهایی
    const payload = {
      trainer: trainerId,
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
      evaluations,
      calendarYear: startYear, // 🔹 اضافه شد برای فیلتر کردن فورم بر اساس سال
    };

    try {
      const res = await fetch("http://localhost:5000/api/monograph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        alert("❌ خطا در ارسال فرم: " + (errBody?.message || res.statusText));
        console.error("Server error:", errBody);
        return;
      }

      alert("✅ فرم با موفقیت ثبت شد!");

      // 🧹 پاک‌سازی فرم بعد از ثبت موفق
      setName("");
      setLastName("");
      setparentType("");
      setIdNumber("");
      setDepartment("");
      setTrainingYear("");
      setStartYear("");
      setDate("");
      setChef("");
      setDepartmentHead("");
      setHospitalHead("");
      setEvaluations(
        sections.map((s) => ({
          section: s,
          percentage: "",
          score: "",
          teacherName: "",
        }))
      );
    } catch (err) {
      console.error(err);
      alert("❌ خطا در برقراری ارتباط با سرور");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-6">
        فرم ارزیابی مونوگراف
      </h2>

      {/* کل فرم در یک گرید یکنواخت */}
      <div className="grid grid-cols-4 gap-4">
        {/* اطلاعات فردی */}
        <input
          className={inputClass}
          placeholder="اسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="تخلص"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="ولد"
          value={parentType}
          onChange={(e) => setparentType(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="نمبر تذکره"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="رشته"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="سال تریننگ"
          value={trainingYear}
          onChange={(e) => setTrainingYear(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="سال شمول"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="تاریخ"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {/* ارزیابی بخش‌ها */}
        {evaluations.map((ev, i) => (
          <React.Fragment key={i}>
            <div className={inputClass}>{ev.section}</div>
            <input
              className={inputClass}
              placeholder="فیصدی"
              value={ev.percentage}
              onChange={(e) =>
                handleEvalChange(i, "percentage", e.target.value)
              }
            />
            <input
              className={inputClass}
              placeholder="نمره داده شده"
              value={ev.score}
              onChange={(e) => handleEvalChange(i, "score", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="نام استاد"
              value={ev.teacherName}
              onChange={(e) =>
                handleEvalChange(i, "teacherName", e.target.value)
              }
            />
          </React.Fragment>
        ))}
        {/* فیلدهای اضافی */}
        <input
          className={inputClass}
          placeholder="شف"
          value={chef}
          onChange={(e) => setChef(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="آمر پروگرام تریننگ"
          value={departmentHead}
          onChange={(e) => setDepartmentHead(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="ریس شفاخانه"
          value={hospitalHead}
          onChange={(e) => setHospitalHead(e.target.value)}
        />
        <div></div> {/* تکمیل ردیف */}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          ذخیره فرم
        </button>
      </div>
    </div>
  );
}
