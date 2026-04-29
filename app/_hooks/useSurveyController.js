import { useCallback, useEffect, useMemo, useState } from "react";

const LIKERT_LABELS = {
  1: "معارض بشدة",
  2: "معارض",
  3: "محايد",
  4: "موافق",
  5: "موافق بشدة",
};

const VALID_AGE_RANGES = new Set([
  "17-20 سنة",
  "21-24 سنة",
  "25-28 سنة",
  "29 سنة و أكثر",
]);

const SUBMITTED_COOKIE = "newsStudyCompleted";

function isValidEmail(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed);
}

/** Returns true if the browser cookie indicates this participant already submitted. */
function hasAlreadySubmittedCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${SUBMITTED_COOKIE}=1`));
}

/** Writes the submitted cookie (1 year). */
function writeSubmittedCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SUBMITTED_COOKIE}=1; path=/; max-age=31536000; SameSite=Lax`;
}

// ─── Feeling column keys MUST match the template header exactly ───────────────
export const FEELING_COLUMN_MAP = [
  {
    label: "الدهشة والانبهار (لم أتوقع أن تكون الآلة بهذا المستوى من الجودة).",
    key: "feeling_amazement\n(الدهشة والانبهار)",
  },
  {
    label: "الارتياب والشك (شعرت بضرورة إعادة فحص كل معلومة قرأتها).",
    key: "feeling_suspicion\n(الارتياب والشك)",
  },
  {
    label: "الخداع (شعرت أن الوسيلة الإعلامية لم تكن شفافة معي منذ البداية).",
    key: "feeling_deception\n(الخداع)",
  },
  {
    label: "الاطمئنان (عندما عرفت بوجود عنصر بشري أو ثقتي في دقة الخوارزميات).",
    key: "feeling_reassurance\n(الاطمئنان)",
  },
  {
    label: "عدم المبالاة (لم يتغير شعوري، ما يهمني هو المحتوى فقط).",
    key: "feeling_indifference\n(عدم المبالاة)",
  },
  {
    label: "أخرى (يرجى تحديد شعورك بدقة)",
    key: "feeling_other\n(أخرى)",
  },
];

export function feelingsToColumns(feelingsArray) {
  const result = {};
  for (const { label, key } of FEELING_COLUMN_MAP) {
    result[key] = feelingsArray.includes(label) ? "نعم" : "لا";
  }
  return result;
}

export function useSurveyController({
  totalSteps,
  preQuestions,
  postCredibilityQuestions,
  trustCompetenceQuestions,
  trustIntegrityQuestions,
  trustBenevolenceQuestions,
  cognitiveDissonanceQuestions,
  behavioralIntentionQuestions,
  collectiveCultureQuestions,
  aiTechnicalKnowledgeQuestions,
  attentionCheckQuestion,
}) {
  const likertKeys = useMemo(
    () =>
      [
        ...preQuestions,
        ...postCredibilityQuestions,
        ...trustCompetenceQuestions,
        ...trustIntegrityQuestions,
        ...trustBenevolenceQuestions,
        ...cognitiveDissonanceQuestions,
        ...behavioralIntentionQuestions,
        ...collectiveCultureQuestions,
        ...aiTechnicalKnowledgeQuestions,
        ...attentionCheckQuestion,
      ].map((q) => q.key),
    [
      preQuestions,
      postCredibilityQuestions,
      trustCompetenceQuestions,
      trustIntegrityQuestions,
      trustBenevolenceQuestions,
      cognitiveDissonanceQuestions,
      behavioralIntentionQuestions,
      collectiveCultureQuestions,
      aiTechnicalKnowledgeQuestions,
      attentionCheckQuestion,
    ],
  );

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classificationCode, setClassificationCode] = useState("");
  const [disclosureText, setDisclosureText] = useState("");
  const [isAssigningClassification, setIsAssigningClassification] =
    useState(true);
  const [classificationError, setClassificationError] = useState("");

  // Detect if participant already completed the survey (client-side cookie check).
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  useEffect(() => {
    if (hasAlreadySubmittedCookie()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAlreadySubmitted(true);
    }
  }, []);

  const [form, setForm] = useState({
    consent: "",
    email: "",
    gender: "",
    age: "",
    level: "",
    specialization: "",
    specializationOther: "",
    internetUsage: "",
    university: "",
    deleteDataRequest: false,
    "Q7 - صحة المعلومات": "",
    "Q8 - التوازن": "",
    "Q9 - التغطية": "",
    "Q10 - الفائدة": "",
    "Q11 - المشاركة": "",
    "Q12 - التوصية": "",
    "Q13 - الاعتماد": "",
    "Q15 - مساهمة البشر": "",
    "Q16 - نوع المصدر": "",
    "Q17 - الصحة": "",
    "Q18 - التوازن": "",
    "Q19 - التغطية": "",
    "Q20 - الفائدة": "",
    "Q21 - الخبرة": "",
    "Q22 - الدقة": "",
    "Q23 - الأمانة": "",
    "Q24 - الأخلاق": "",
    "Q25 - الشفافية": "",
    "Q26 - المصلحة": "",
    "Q27 - تجنب الضرر": "",
    "Q28 - القيم": "",
    "Q29 - المشاركة": "",
    "Q30 - التوصية": "",
    "Q31 - الاعتماد": "",
    "Q32 - الارتباك": "",
    "Q33 - التعارض": "",
    "Q34 - خيبة الأمل": "",
    "Q35 - الانتماء": "",
    "Q36 - الثقة الجماعية": "",
    "Q37 - الهوية": "",
    "Q38 - التعاون": "",
    "Q39 - تمييز النص": "",
    "Q40 - الهلوسة": "",
    "Q41 - الانتباه": "",
    futureBehavior: [],
    finalExplanation: "",
    otherFeelingText: "",
  });

  const [feelings, setFeelings] = useState([]);
  const [attentionFlag] = useState(false);

  // ── Classification assignment ─────────────────────────────────────────────
  const assignClassification = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsAssigningClassification(true);
      setClassificationError("");
    }
    try {
      const res = await fetch("/api/survey-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Assignment failed");

      const json = await res.json();
      const details = json?.details ?? json;
      const code = details?.classificationCode;
      const disclosure = details?.disclosureText;

      if (!code || !disclosure)
        throw new Error("Assignment payload is incomplete");

      setClassificationCode(code);
      setDisclosureText(disclosure);
    } catch {
      setClassificationError(
        "تعذر تحديد تصنيف المشارك حالياً. يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setIsAssigningClassification(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void assignClassification(false), 0);
    return () => clearTimeout(timer);
  }, [assignClassification]);

  // ── Derived payload ───────────────────────────────────────────────────────
  const payload = useMemo(
    () => ({
      ...form,
      ...feelingsToColumns(feelings),
      "otherFeelingText\n(نص أخرى)": form.otherFeelingText,
      disclosure: disclosureText,
      completed: submitted,
    }),
    [form, feelings, submitted, disclosureText],
  );

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleFeeling = (label) =>
    setFeelings((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );

  const checkLikertGroup = (questions) =>
    questions.every((q) => form[q.key] !== "");

  // ── Validation ────────────────────────────────────────────────────────────
  const validateStep = () => {
    if (!classificationCode || !disclosureText) {
      setError(
        classificationError || "يرجى انتظار تعيين تصنيف المشارك قبل المتابعة.",
      );
      return false;
    }

    if (step === 1) {
      if (!form.consent) {
        setError("يرجى اختيار الموافقة أو الرفض للمتابعة.");
        return false;
      }
      if (form.consent === "no") {
        setSubmitted(true);
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (
        !isValidEmail(form.email) ||
        !form.gender ||
        !form.age ||
        !form.level ||
        !form.specialization ||
        !form.internetUsage
      ) {
        setError("يرجى تعبئة جميع البيانات المطلوبة.");
        return false;
      }
      if (form.specialization === "أخرى" && !form.specializationOther.trim()) {
        setError("يرجى تحديد التخصص في خانة (أخرى).");
        return false;
      }
      if (!VALID_AGE_RANGES.has(form.age)) {
        setError("يرجى اختيار الفئة العمرية الصحيحة.");
        return false;
      }
      return true;
    }

    if (step === 4 && !checkLikertGroup(preQuestions)) {
      setError("يرجى الإجابة عن جميع عبارات تقييم الخبر.");
      return false;
    }

    if (
      step === 5 &&
      (!form["Q15 - مساهمة البشر"] || !form["Q16 - نوع المصدر"])
    ) {
      setError("يرجى الإجابة عن أسئلة التحقق من التلاعب قبل المتابعة.");
      return false;
    }

    if (step === 6 && !checkLikertGroup(postCredibilityQuestions)) {
      setError("يرجى استكمال التقييم البعدي.");
      return false;
    }

    if (
      step === 7 &&
      (!checkLikertGroup(trustCompetenceQuestions) ||
        !checkLikertGroup(trustIntegrityQuestions) ||
        !checkLikertGroup(trustBenevolenceQuestions))
    ) {
      setError("يرجى الإجابة عن جميع عبارات قياس الثقة في المصدر.");
      return false;
    }

    if (
      step === 8 &&
      (!checkLikertGroup(cognitiveDissonanceQuestions) ||
        !checkLikertGroup(behavioralIntentionQuestions))
    ) {
      setError("يرجى الإجابة عن جميع الأسئلة في هذا القسم.");
      return false;
    }

    if (
      step === 9 &&
      (!checkLikertGroup(collectiveCultureQuestions) ||
        !checkLikertGroup(aiTechnicalKnowledgeQuestions) ||
        !checkLikertGroup(attentionCheckQuestion))
    ) {
      setError("يرجى الإجابة عن جميع الأسئلة في هذا القسم.");
      return false;
    }

    if (step === 10) {
      if (
        feelings.length === 0 ||
        form.futureBehavior.length === 0 ||
        !form.finalExplanation.trim() ||
        !form.university
      ) {
        setError("يرجى استكمال هذا القسم قبل الإنهاء.");
        return false;
      }
      if (
        feelings.includes("أخرى (يرجى تحديد شعورك بدقة)") &&
        !form.otherFeelingText.trim()
      ) {
        setError("يرجى توضيح خيار (أخرى).");
        return false;
      }
    }

    return true;
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const next = () => {
    if (!validateStep()) return false;
    setError("");
    setStep((prev) => Math.min(totalSteps, prev + 1));
    return true;
  };

  const prev = () => {
    setError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const submit = () => {
    if (!validateStep() || isSubmitting) return false;

    const run = async () => {
      setIsSubmitting(true);
      setError("");

      try {
        const formWithLikertText = { ...form };
        for (const key of likertKeys) {
          formWithLikertText[key] = LIKERT_LABELS[form[key]] ?? form[key];
        }

        const submissionData = {
          submitted_at: new Date().toISOString(),
          classificationCode,
          disclosure: disclosureText,
          completed: true,
          consent: formWithLikertText.consent,
          email: formWithLikertText.email,
          gender: formWithLikertText.gender,
          age: formWithLikertText.age,
          level: formWithLikertText.level,
          specialization: formWithLikertText.specialization,
          specializationOther: formWithLikertText.specializationOther,
          internetUsage: formWithLikertText.internetUsage,
          university: formWithLikertText.university,
          deleteDataRequest: formWithLikertText.deleteDataRequest,
          "Q7 - صحة المعلومات": formWithLikertText["Q7 - صحة المعلومات"],
          "Q8 - التوازن": formWithLikertText["Q8 - التوازن"],
          "Q9 - التغطية": formWithLikertText["Q9 - التغطية"],
          "Q10 - الفائدة": formWithLikertText["Q10 - الفائدة"],
          "Q11 - المشاركة": formWithLikertText["Q11 - المشاركة"],
          "Q12 - التوصية": formWithLikertText["Q12 - التوصية"],
          "Q13 - الاعتماد": formWithLikertText["Q13 - الاعتماد"],
          "Q15 - مساهمة البشر": formWithLikertText["Q15 - مساهمة البشر"],
          "Q16 - نوع المصدر": formWithLikertText["Q16 - نوع المصدر"],
          "Q17 - الصحة": formWithLikertText["Q17 - الصحة"],
          "Q18 - التوازن": formWithLikertText["Q18 - التوازن"],
          "Q19 - التغطية": formWithLikertText["Q19 - التغطية"],
          "Q20 - الفائدة": formWithLikertText["Q20 - الفائدة"],
          "Q21 - الخبرة": formWithLikertText["Q21 - الخبرة"],
          "Q22 - الدقة": formWithLikertText["Q22 - الدقة"],
          "Q23 - الأمانة": formWithLikertText["Q23 - الأمانة"],
          "Q24 - الأخلاق": formWithLikertText["Q24 - الأخلاق"],
          "Q25 - الشفافية": formWithLikertText["Q25 - الشفافية"],
          "Q26 - المصلحة": formWithLikertText["Q26 - المصلحة"],
          "Q27 - تجنب الضرر": formWithLikertText["Q27 - تجنب الضرر"],
          "Q28 - القيم": formWithLikertText["Q28 - القيم"],
          "Q29 - المشاركة": formWithLikertText["Q29 - المشاركة"],
          "Q30 - التوصية": formWithLikertText["Q30 - التوصية"],
          "Q31 - الاعتماد": formWithLikertText["Q31 - الاعتماد"],
          "Q32 - الارتباك": formWithLikertText["Q32 - الارتباك"],
          "Q33 - التعارض": formWithLikertText["Q33 - التعارض"],
          "Q34 - خيبة الأمل": formWithLikertText["Q34 - خيبة الأمل"],
          "Q35 - الانتماء": formWithLikertText["Q35 - الانتماء"],
          "Q36 - الثقة الجماعية": formWithLikertText["Q36 - الثقة الجماعية"],
          "Q37 - الهوية": formWithLikertText["Q37 - الهوية"],
          "Q38 - التعاون": formWithLikertText["Q38 - التعاون"],
          "Q39 - تمييز النص": formWithLikertText["Q39 - تمييز النص"],
          "Q40 - الهلوسة": formWithLikertText["Q40 - الهلوسة"],
          "Q41 - الانتباه": formWithLikertText["Q41 - الانتباه"],
          ...feelingsToColumns(feelings),
          "otherFeelingText\n(نص أخرى)": formWithLikertText.otherFeelingText,
          futureBehavior: formWithLikertText.futureBehavior,
          finalExplanation: formWithLikertText.finalExplanation,
        };

        const res = await fetch("/api/survey-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });

        if (!res.ok) throw new Error("Submission failed");

        // Mark as completed in browser cookie so re-entry is blocked.
        writeSubmittedCookie();

        setSubmitted(true);
        setStep(11);
      } catch {
        setError("تعذر إرسال الاستبيان حالياً. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsSubmitting(false);
      }
    };

    void run();
    return true;
  };

  return {
    step,
    setStep,
    error,
    setError,
    submitted,
    isSubmitting,
    classificationCode,
    disclosureText,
    isAssigningClassification,
    classificationError,
    form,
    feelings,
    attentionFlag,
    payload,
    alreadySubmitted,
    updateField,
    toggleFeeling,
    next,
    prev,
    submit,
    assignClassification,
    validateStep,
    checkLikertGroup,
    setFeelings,
  };
}
