import React, { useState, useEffect } from "react";
import { useTrainer } from "@/context/TrainerContext";

type Row = {
  exam1Written: string;
  exam1Practical: string;
  exam2Written: string;
  exam2Practical: string;
  finalWritten: string;
  finalPractical: string;
  total: string;
  teacherName: string;
};

type RowField = keyof Row;

interface EvaluationFormGProps {
  trainerIdProp?: string; // ✅ برای استفاده از prop یا context
}

export default function EvaluationFormG({
  trainerIdProp,
}: EvaluationFormGProps) {
  const [trainerId, setTrainerId] = useState<string | null>(null);
  // 🔹 معلومات شخصی
  const [personalInfo, setPersonalInfo] = useState({
    Name: "",
    parentType: "",
    trainingYear: "",
    year: "",
    department: "",
  });

  // 🔹 جدول نمرات
  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 6 }, () => ({
      exam1Written: "",
      exam1Practical: "",
      exam2Written: "",
      exam2Practical: "",
      finalWritten: "",
      finalPractical: "",
      total: "",
      teacherName: "",
    }))
  );

  //////////////////////////////////
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
          setPersonalInfo({
          Name: result.name || "",
          parentType: result.fatherName || result.parentType || "",
          trainingYear: result.trainingYear || "",
          year: new Date().getFullYear().toString(), // یا اگر در DB داری، از result.year بگیر
          department: result.department || "",
          });
          } catch (err) {
            console.error("خطا در دریافت ترینر:", err);
            alert("خطا در دریافت اطلاعات ترینر ❌");
          }
        };
    
        fetchTrainerInfo();
      }, [trainerIdProp]);
  /////////////////////////////////////
  const inputClass = "border px-2 py-2 w-full text-center";

  // 📊 تغییر هر خانه جدول
  const handleChangeRow = (index: number, field: RowField, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    // محاسبه مجموع (total) برای ردیف‌های ۱ تا ۵
    if (index < 5) {
      const total =
        (Number(newRows[index].exam1Written) || 0) +
        (Number(newRows[index].exam1Practical) || 0) +
        (Number(newRows[index].exam2Written) || 0) +
        (Number(newRows[index].exam2Practical) || 0) +
        (Number(newRows[index].finalWritten) || 0) +
        (Number(newRows[index].finalPractical) || 0);
      newRows[index].total = total.toString();
    }

    setRows(newRows);
  };

  // 🧩 تغییر اطلاعات شخصی
  const handleChangePersonal = (
    field: keyof typeof personalInfo,
    value: string
  ) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  // 🔹 محاسبه خودکار اوسط نمرات (ردیف ۶)
  const averageRow = (() => {
    const filledRows = rows.slice(0, 5);

    const avg = (col1: keyof Row, col2: keyof Row) => {
      const vals = filledRows.map(
        (r) => (Number(r[col1]) || 0) + (Number(r[col2]) || 0)
      );
      return (vals.reduce((a, b) => a + b, 0) / filledRows.length).toFixed(2);
    };

    return {
      exam1Combined: avg("exam1Written", "exam1Practical"),
      exam2Combined: avg("exam2Written", "exam2Practical"),
      finalCombined: avg("finalWritten", "finalPractical"),
      total: (
        filledRows.reduce(
          (sum, r) =>
            sum +
            (Number(r.exam1Written) || 0) +
            (Number(r.exam1Practical) || 0) +
            (Number(r.exam2Written) || 0) +
            (Number(r.exam2Practical) || 0) +
            (Number(r.finalWritten) || 0) +
            (Number(r.finalPractical) || 0),
          0
        ) / filledRows.length
      ).toFixed(2),
    };
  })();

  // 💾 ذخیره فرم
  const handleSubmit = async () => {
    if (!trainerId) {
      alert("❌ Trainer ID موجود نیست، فرم ذخیره نمی‌شود!");
      return;
    }

    // ✅ بررسی خالی نبودن تمام فیلدهای personalInfo
    for (const [key, value] of Object.entries(personalInfo)) {
      if (!value.trim()) {
        alert("لطفاً تمام معلومات شخصی را وارد کنید.");
        return;
      }
    }

    // ✅ بررسی اینکه تمام ردیف‌های 1 تا 5 پر شده باشند
    for (let i = 0; i < 5; i++) {
      const row = rows[i];
      for (const key of [
        "exam1Written",
        "exam1Practical",
        "exam2Written",
        "exam2Practical",
        "finalWritten",
        "finalPractical",
        "teacherName",
      ] as (keyof Row)[]) {
        const val = row[key];
        if (!val.toString().trim()) {
          alert(
            `تمام خانه‌های نمره و نام استاد در ردیف ${i + 1} باید پُر شود.`
          );
          return;
        }
      }
    }

    // ✅ تبدیل رشته‌ها به عدد برای ارسال مطمئن
    const numericScores = rows.map((r) => ({
      exam1Written: Number(r.exam1Written) || 0,
      exam1Practical: Number(r.exam1Practical) || 0,
      exam2Written: Number(r.exam2Written) || 0,
      exam2Practical: Number(r.exam2Practical) || 0,
      finalWritten: Number(r.finalWritten) || 0,
      finalPractical: Number(r.finalPractical) || 0,
      total: Number(r.total) || 0,
      teacherName: r.teacherName || "",
    }));

    const payload = {
      trainer: trainerId,
      personalInfo,
      scores: numericScores,
      calendarYear: personalInfo.year, // 🔹 اضافه شد برای فیلتر کردن فورم بر اساس سال
    };

    try {
      const res = await fetch("http://localhost:5000/api/evaluationFormG", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        alert("❌ خطا در ذخیره فرم: " + (errBody?.message || res.statusText));
        console.error("Server error:", errBody);
        return;
      }

      alert("✅ فرم با موفقیت ذخیره شد!");

      // 🧹 پاک‌سازی فرم بعد از ذخیره
      setPersonalInfo({
        Name: "",
        parentType: "",
        trainingYear: "",
        year: "",
        department: "",
      });
      setRows(
        Array.from({ length: 6 }, () => ({
          exam1Written: "",
          exam1Practical: "",
          exam2Written: "",
          exam2Practical: "",
          finalWritten: "",
          finalPractical: "",
          total: "",
          teacherName: "",
        }))
      );
    } catch (err) {
      console.error(err);
      alert("❌ خطا در ذخیره فرم");
    }
  };

  // 🧱 UI
  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-4">
        فورم ارزیابی دستیار
      </h2>

      {!trainerId && (
        <p className="text-center text-red-500 mb-4">
          در حال دریافت شناسه ترینر...
        </p>
      )}

      {/* 📋 معلومات شخصی */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="نام"
          value={personalInfo.Name}
          onChange={(e) => handleChangePersonal("Name", e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="ولد"
          value={personalInfo.parentType}
          onChange={(e) => handleChangePersonal("parentType", e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="سال تریننگ"
          value={personalInfo.trainingYear}
          onChange={(e) => handleChangePersonal("trainingYear", e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="سال"
          value={personalInfo.year}
          onChange={(e) => handleChangePersonal("year", e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="دیپارتمنت"
          value={personalInfo.department}
          onChange={(e) => handleChangePersonal("department", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* 📊 جدول نمرات */}
      <table className="table-auto border-collapse border w-full text-center">
        <thead>
          <tr>
            <th rowSpan={2} className="border px-2 py-4">
              شماره
            </th>
            <th colSpan={2} className="border px-2 py-2">
              امتحان چهار ماه اول
            </th>
            <th colSpan={2} className="border px-2 py-2">
              امتحان چهار ماه دوم
            </th>
            <th colSpan={2} className="border px-2 py-2">
              امتحان نهایی
            </th>
            <th rowSpan={2} className="border px-2 py-4">
              مجموع
            </th>
            <th rowSpan={2} className="border px-2 py-4">
              نام استاد
            </th>
          </tr>
          <tr>
            <th className="border px-2 py-2">تحریری</th>
            <th className="border px-2 py-2">عملی</th>
            <th className="border px-2 py-2">تحریری</th>
            <th className="border px-2 py-2">عملی</th>
            <th className="border px-2 py-2">تحریری</th>
            <th className="border px-2 py-2">عملی</th>
          </tr>
        </thead>

        <tbody>
          {rows.slice(0, 5).map((row, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-4">{idx + 1}</td>
              {(
                [
                  "exam1Written",
                  "exam1Practical",
                  "exam2Written",
                  "exam2Practical",
                  "finalWritten",
                  "finalPractical",
                ] as RowField[]
              ).map((field) => (
                <td key={field}>
                  <input
                    type="number"
                    value={row[field]}
                    onChange={(e) =>
                      handleChangeRow(idx, field, e.target.value)
                    }
                    className={inputClass}
                  />
                </td>
              ))}
              <td>
                <input
                  type="text"
                  value={row.total}
                  readOnly
                  className={inputClass + " bg-gray-100"}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.teacherName}
                  onChange={(e) =>
                    handleChangeRow(idx, "teacherName", e.target.value)
                  }
                  className={inputClass}
                />
              </td>
            </tr>
          ))}

          {/* ردیف اوسط نمرات */}
          {/* ردیف اوسط نمرات */}
          <tr className="bg-gray-100 font-bold">
            <td className="border px-2 py-2">6</td>
            <td colSpan={2} className="border px-2 py-2">
              {averageRow.exam1Combined}
            </td>
            <td colSpan={2} className="border px-2 py-2">
              {averageRow.exam2Combined}
            </td>
            <td colSpan={2} className="border px-2 py-2">
              {averageRow.finalCombined}
            </td>
            <td className="border px-2 py-2">{averageRow.total}</td>
            <td className="border px-2 py-2"></td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={!trainerId}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          ذخیره فرم
        </button>
      </div>
    </div>
  );
}
