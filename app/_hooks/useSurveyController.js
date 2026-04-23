import { useCallback, useEffect, useMemo, useState } from "react";

const LIKERT_LABELS = {
  1: "معارض بشدة",
  2: "معارض",
  3: "محايد",
  4: "موافق",
  5: "موافق بشدة",
};

function normalizeDigits(value) {
  return String(value ?? "")
    .replace(/[\u0660-\u0669]/g, (char) => String(char.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (char) => String(char.charCodeAt(0) - 0x06f0));
}

const VALID_AGE_RANGES = new Set([
  "17-20 سنة",
  "21-24 سنة",
  "25-28 سنة",
  "29 سنة و أكثر",
]);

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
      ].map((question) => question.key),
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
  const [form, setForm] = useState({
    consent: "",
    gender: "",
    age: "",
    level: "",
    specialization: "",
    specializationOther: "",
    internetUsage: "",
    university: "",
    // Manipulation check (Q15-16)
    manipulation_q15: "",
    manipulation_q16: "",
    // Pre-test (Q7-13)
    pre_q7: "",
    pre_q8: "",
    pre_q9: "",
    pre_q10: "",
    pre_q11: "",
    pre_q12: "",
    pre_q13: "",
    // Post credibility (Q17-20)
    post_q17: "",
    post_q18: "",
    post_q19: "",
    post_q20: "",
    // Trust - competence (Q21-22)
    trust_q21: "",
    trust_q22: "",
    // Trust - integrity (Q23-25)
    trust_q23: "",
    trust_q24: "",
    trust_q25: "",
    // Trust - benevolence (Q26-28)
    trust_q26: "",
    trust_q27: "",
    trust_q28: "",
    // Cognitive dissonance (Q32-34)
    dissonance_q32: "",
    dissonance_q33: "",
    dissonance_q34: "",
    // Behavioral intention (Q29-31)
    behavior_q29: "",
    behavior_q30: "",
    behavior_q31: "",
    // Collective culture (Q35-38)
    collective_q35: "",
    collective_q36: "",
    collective_q37: "",
    collective_q38: "",
    // AI technical knowledge (Q39-40)
    ai_knowledge_q39: "",
    ai_knowledge_q40: "",
    // Attention check (Q41)
    attention_q41: "",
    futureBehavior: "",
    finalExplanation: "",
    otherFeelingText: "",
  });
  const [feelings, setFeelings] = useState([]);
  const [attentionFlag] = useState(false);

  const assignClassification = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsAssigningClassification(true);
      setClassificationError("");
    }

    try {
      const res = await fetch("/api/survey-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Assignment failed");
      }

      const json = await res.json();
      const details = json?.details ?? json;
      const code = details?.classificationCode;
      const disclosure = details?.disclosureText;

      if (!code || !disclosure) {
        throw new Error("Assignment payload is incomplete");
      }

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
    // Defer the call so the effect body itself does not trigger sync state updates.
    const timer = setTimeout(() => {
      void assignClassification(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [assignClassification]);

  const payload = useMemo(
    () => ({
      ...form,
      feelings,
      disclosure: disclosureText,
      completed: submitted,
    }),
    [form, feelings, submitted, disclosureText],
  );

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const toggleFeeling = (label) =>
    setFeelings((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  const checkLikertGroup = (questions) =>
    questions.every((question) => form[question.key] !== "");

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

    if (step === 5 && (!form.manipulation_q15 || !form.manipulation_q16)) {
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
        !form.futureBehavior ||
        !form.finalExplanation.trim()
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

  const submit = () => {
    if (!validateStep() || isSubmitting) return false;

    const run = async () => {
      setIsSubmitting(true);
      setError("");

      try {
        const formWithLikertText = {
          ...form,
        };

        for (const key of likertKeys) {
          formWithLikertText[key] = LIKERT_LABELS[form[key]] || form[key];
        }

        const submissionData = {
          ...formWithLikertText,
          classificationCode,
          feelings,
          disclosure: disclosureText,
          completed: true,
          submitted_at: new Date().toISOString(),
        };

        const res = await fetch("/api/survey-submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });

        if (!res.ok) {
          throw new Error("Submission failed");
        }

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
