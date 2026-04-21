"use client";

import {
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiLogOut,
  FiShield,
} from "react-icons/fi";

import {
  ActionRow,
  ArticleBlock,
  CheckOption,
  ConsentChoice,
  DangerButton,
  ErrorNotice,
  FieldLabel,
  LikertCard,
  LikertGroup,
  PrimaryButton,
  RadioGroup,
  Shell,
  SectionHeading,
  TextField,
  TextareaField,
} from "./_components";
import { useSurveyController } from "./_hooks/useSurveyController";
import { useStepScroll } from "./_hooks/useStepScroll";

const TOTAL_STEPS = 10;

const articleTitle =
  "لقاح جديد يظهر كفاءة بنسبة 94% في الوقاية من سلالات كورونا المتحورة";

const articleCategory = "المحور الطبي";

const articleParagraphs = [
  "أظهر لقاح تجريبي جديد فعالية استثنائية في الوقاية من أحدث سلالات فيروس كورونا المتحورة، وفقاً لنتائج دراسة سريرية واسعة النطاق نُشرت مؤخراً. وأفاد الباحثون أن اللقاح حقق نسبة حماية بلغت 94% بين المشاركين في التجربة، مع تسجيل آثار جانبية طفيفة جداً لم تتجاوز الصداع الخفيف أو التعب المؤقت لدى أقل من 3% من الحالات.",
  "وشملت الدراسة السريرية 10,000 متطوع تتراوح أعمارهم بين 18 و65 عاماً، تم اختيارهم عشوائياً من خمس دول مختلفة، وخضعوا لمراقبة طبية دقيقة على مدار ستة أشهر. وتم تصميم اللقاح باستخدام تقنية الحمض النووي الريبي المرسال (mRNA) المُحسّنة، والتي تستهدف بروتينات الفيروس المتحورة بدقة أعلى من الجيل الأول من اللقاحات.",
  "وأكد الفريق البحثي أن النتائج تشير إلى أن اللقاح لا يمنع العدوى فحسب، بل يقلل أيضاً بشكل كبير من خطر دخول المستشفى أو تطور الأعراض الشديدة. كما أظهرت التحاليل المختبرية أن الاستجابة المناعية استمرت لمدة تزيد عن خمسة أشهر دون انخفاض ملحوظ في مستويات الأجسام المضادة.",
  "ومن المتوقع أن تخضع هذه النتائج لمراجعة من قبل الهيئات التنظيمية (مثل منظمة الصحة العالمية والوكالة الأوروبية للأدوية) خلال الأسابيع القادمة، تمهيداً لاعتماده رسمياً. ويُنظر إلى هذا التطور على أنه خطوة حاسمة في إدارة الجائحات المستقبلية، خاصة في ظل التحديات المتزايدة التي تفرضها سرعة تحور الفيروسات التنفسية.",
];

const preQuestions = [
  { key: "pre_accuracy", text: "معلومات الخبر دقيقة وموثوقة" },
  { key: "pre_objective", text: "الخبر يتسم بالموضوعية والحياد" },
  { key: "pre_share", text: "سأقوم بمشاركة هذا الخبر" },
];

const postQuestions = [
  { key: "post_accuracy", text: "معلومات الخبر دقيقة وموثوقة" },
  { key: "post_objective", text: "الخبر يتسم بالموضوعية والحياد" },
  { key: "post_share", text: "سأقوم بمشاركة هذا الخبر" },
];

const sourceTrustQuestions = [
  {
    key: "trust_competence_1",
    text: "الكفاءة: أعتقد أن هذا المصدر يمتلك المهارات اللازمة لإنتاج أخبار دقيقة.",
  },
  {
    key: "trust_competence_2",
    text: "الكفاءة: يبدو هذا المصدر خبيراً ومتمكناً في معالجة القضايا المعقدة.",
  },
  {
    key: "trust_integrity_1",
    text: "النزاهة: أثق في أن هذا المصدر يقدم المعلومات بأمانة ودون تلاعب.",
  },
  {
    key: "trust_integrity_2",
    text: "النزاهة: أعتقد أن هذا المصدر يتسم بالشفافية والالتزام بالمعايير الأخلاقية.",
  },
  {
    key: "trust_benevolence",
    text: "النزاهة: أشعر أن هذا المصدر يراعي مصلحة القارئ عند صياغة الخبر.",
  },
];

const aiReasoningQuestions = [
  {
    key: "ai_reason_1",
    text: "الموضوعية: الذكاء الاصطناعي أكثر حياداً من البشر لأنه لا يملك مشاعر أو أهواء شخصية.",
  },
  {
    key: "ai_reason_2",
    text: "الدقة: الأنظمة الآلية أقل عرضة للخطأ في نقل الأرقام والإحصائيات مقارنة بالصحفيين.",
  },
  {
    key: "ai_reason_3",
    text: 'الافتقار للنية: الآلة لا تمتلك نية "الخداع"؛ فهي تعرض البيانات كما هي دون تلاعب متعمد.',
  },
  {
    key: "ai_reason_4",
    text: "البرود السياقي: الذكاء الاصطناعي غير قادر على فهم المشاعر الإنسانية أو السياقات الثقافية للأخبار.",
  },
  {
    key: "ai_reason_5",
    text: 'التبعية البرمجية: ثقتي في الآلة تعتمد كلياً على ثقتي في "المبرمج" الذي صممها وليس في الآلة نفسها.',
  },
  {
    key: "ai_reason_6",
    text: "غياب المسؤولية: لا يمكن الوثوق بالآلة تماماً لأننا لا نستطيع محاسبتها أخلاقياً أو قانونياً عند الخطأ.",
  },
];

const postExperimentFeelings = [
  "الدهشة والانبهار (لم أتوقع أن تكون الآلة بهذا المستوى من الجودة).",
  "الارتياب والشك (شعرت بضرورة إعادة فحص كل معلومة قرأتها).",
  "الخداع (شعرت أن الوسيلة الإعلامية لم تكن شفافة معي منذ البداية).",
  "الاطمئنان (عندما عرفت بوجود عنصر بشري أو ثقتي في دقة الخوارزميات).",
  "عدم المبالاة (لم يتغير شعوري، ما يهمني هو المحتوى فقط).",
  "أخرى (يرجى تحديد شعورك بدقة)",
];

const futureBehaviorOptions = [
  "سأصبح أكثر حذراً وتشككاً في مصداقية أي خبر أقرؤه.",
  'سأهتم دائماً بالبحث عن هوية "مُعدّ الخبر" (بشر أم ذكاء اصطناعي) قبل التصديق.',
  "لن يتغير أسلوبي؛ فالعبرة عندي بدقة المعلومات بغض النظر عن المصدر.",
  "سأعتمد فقط على المؤسسات الإعلامية الرسمية التي تضمن الإشراف البشري.",
  "سأثق أكثر في الأخبار الناتجة عن الذكاء الاصطناعي لحيادها ودقتها.",
];

const likertLabels = ["معارض بشدة", "معارض", "محايد", "موافق", "موافق بشدة"];

const demographics = {
  gender: ["ذكر", "أنثى"],
  level: ["ليسانس", "ماستر", "دكتوراه"],
  specialization: ["علوم إنسانية", "علوم دقيقة", "علوم طبية"],
  internetUsage: ["أقل من 2س", "2-5س", "+5س"],
  aiKnowledge: ["منعدمة", "ضعيفة", "متوسطة", "جيدة", "خبير"],
  aiToolsUsage: ["بانتظام", "أحياناً", "نادراً", "أبداً"],
};

const disclosureText = "نظام ذكاء اصطناعي بالكامل دون أي تدخل بشري";

function StepSection({ children, width = "default" }) {
  const widthClass =
    width === "wide"
      ? "md:mx-auto md:max-w-[1120px]"
      : width === "narrow"
        ? "md:mx-auto md:max-w-[760px]"
        : "md:mx-auto md:max-w-[980px]";

  return (
    <section
      className="
        py-4
        px-4
        sm:px-6
        lg:px-8
        md:py-5
        lg:py-6
      "
      style={{
        paddingInline:
          "max(1rem, env(safe-area-inset-left)) max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div className={widthClass}>{children}</div>
    </section>
  );
}

function SoftDivider() {
  return <div className="my-8 h-px w-full bg-(--border)" />;
}

export default function Home() {
  const {
    step,
    submitted,
    isSubmitting,
    form,
    feelings,
    attentionFlag,
    error,
    updateField,
    toggleFeeling,
    next,
    prev,
    submit,
  } = useSurveyController({
    totalSteps: TOTAL_STEPS,
    disclosureText,
    preQuestions,
    postQuestions,
    sourceTrustQuestions,
    aiReasoningQuestions,
  });

  useStepScroll(step);

  if (submitted && form.consent === "no") {
    return (
      <Shell showProgress={false}>
        <div className="px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--blue-50),#ffffff)] text-(--blue-700) shadow-[var(--shadow-xs)] ring-1 ring-(--blue-200)">
              <FiLogOut className="text-[1.8rem]" aria-hidden="true" />
            </div>

            <span className="mb-3 inline-flex rounded-full bg-(--blue-50) px-3 py-1 text-xs font-semibold text-(--blue-700)">
              المشاركة غير مكتملة
            </span>

            <h1 className="mt-3 mb-3 text-[1.8rem] font-bold leading-tight text-(--text-strong) sm:text-[2.2rem]">
              شكراً لاهتمامك
            </h1>

            <p className="mx-auto max-w-[34rem] text-sm leading-8 text-(--text-muted) sm:text-[1.02rem]">
              تم إنهاء الاستبيان لأن المشاركة تتطلب الموافقة الطوعية المسبقة.
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  if (step === 10) {
    return (
      <Shell showProgress={false}>
        <StepSection width="narrow">
          <div className="mx-auto max-w-3xl text-right">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[linear-gradient(180deg,#ffffff,var(--success-bg))] text-(--success) ring-1 ring-[rgba(47,133,90,0.16)] shadow-[0_10px_24px_rgba(47,133,90,0.10)]">
                <FiCheckCircle className="text-[1.9rem]" aria-hidden="true" />
              </div>

              <span className="inline-flex rounded-full bg-(--success-bg) px-3 py-1 text-xs font-semibold text-(--success)">
                تم الإرسال بنجاح
              </span>

              <h1 className="mt-4 text-[1.9rem] font-bold leading-tight text-(--text-strong) sm:text-[2.3rem]">
                شكراً لك على مشاركتك!
              </h1>

              <p className="mt-3 text-sm leading-8 text-(--text-muted) sm:text-[1.02rem]">
                لقد أتممت الدراسة بنجاح
              </p>
            </div>

            {/* Intro */}
            <div className="space-y-5">
              <p className="text-sm font-semibold text-(--blue-900) sm:text-base">
                عزيزي الطالب / المشارك،
              </p>

              <p className="text-sm leading-8 text-(--text-body) sm:text-base">
                نود أن نعرب لك عن خالص امتناننا لوقتك وجهدك في إتمام هذه
                الدراسة. بفضل إجاباتك الصادقة، سنتمكن من فهم أعمق لكيفية تفاعل
                الجمهور مع تكنولوجيا الذكاء الاصطناعي في المجال الإعلامي.
              </p>

              {/* Debriefing */}
              <div className="rounded-md border border-(--blue-200) bg-[linear-gradient(180deg,#ffffff,var(--blue-50))] px-5 py-5 shadow-[var(--shadow-xs)]">
                <h2 className="mb-3 text-right text-base font-bold text-(--blue-800) sm:text-lg">
                  توضيح هام حول طبيعة الدراسة (Debriefing)
                </h2>

                <p className="text-right text-sm leading-8 text-(--text-body) sm:text-base">
                  نود إعلامك بأن «الإخفاء المؤقت» لهوية مصادر الأخبار في بداية
                  التجربة كان ضرورة منهجية بحثية، وذلك لضمان الحصول على تقييمك
                  العفوي للمحتوى دون تأثير مسبق بنوع المصدر. الهدف هو قياس
                  «الفجوة في الإدراك» بدقة علمية، وليس تضليل المشاركين.
                </p>
              </div>

              {/* Guarantees */}
              <div className="pt-2">
                <p className="mb-4 text-sm font-semibold text-(--text-strong) sm:text-base">
                  نؤكد لك ما يلي:
                </p>

                <div className="space-y-3">
                  {[
                    {
                      icon: FiShield,
                      bold: "الخصوصية:",
                      text: "كافة البيانات التي قدمتها مشفرة، وتُستخدم لأغراض البحث العلمي فقط.",
                    },
                    {
                      icon: FiFileText,
                      bold: "الأخبار المستخدمة:",
                      text: "جميع النصوص خضعت للتحكيم لضمان جودتها.",
                    },
                    {
                      icon: FiLogOut,
                      bold: "حق الانسحاب:",
                      text: "يمكنك التواصل معنا عبر إيميل الباحث لطلب حذف استجابتك.",
                    },
                  ].map((item) => (
                    <div
                      key={item.bold}
                      className="flex items-start gap-3 rounded-md bg-white px-4 py-3 shadow-[var(--shadow-xs)] ring-1 ring-(--border)"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--blue-50) text-(--blue-700)">
                        <item.icon className="text-[1rem]" aria-hidden="true" />
                      </div>

                      <p className="flex-1 text-right text-sm leading-7 text-(--text-body) sm:text-base">
                        <strong className="text-(--text-strong)">
                          {item.bold}
                        </strong>{" "}
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4">
                <div className="mx-auto mb-4 h-px w-24 bg-(--border)" />

                <div className="text-center text-sm leading-7 text-(--text-muted)">
                  <p className="font-semibold text-(--text-strong)">
                    الطالب الباحث: نحال جيـلالي
                  </p>
                  <p>إشراف: الدكتور الهاشمي بيدوش</p>
                  <p>جامعة البليدة 2</p>
                </div>
              </div>

              {/* Optional internal note */}
              {attentionFlag && (
                <div className="mt-6 rounded-md border border-(--error-border) bg-(--error-bg) px-4 py-3 text-right text-sm leading-7 text-(--error)">
                  ملاحظة داخلية: تم تسجيل مخالفة في سؤال الانتباه.
                </div>
              )}
            </div>
          </div>
        </StepSection>
      </Shell>
    );
  }

  return (
    <Shell step={step}>
      {step === 1 && (
        <StepSection width="narrow">
          <div className="mb-7 text-right">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-(--blue-200) bg-(--blue-50) px-3 py-1 text-xs font-semibold tracking-wide text-(--blue-700)">
              دراسة أكاديمية
            </div>

            <h1 className="text-[1.55rem] font-bold leading-snug text-(--text-strong) sm:text-[1.9rem] lg:text-[2.1rem]">
              دراسة حول إدراك جودة الأخبار الرقمية
            </h1>
          </div>

          <div className="mb-8 space-y-4 text-right text-sm leading-8 text-(--text-body) sm:text-base">
            <p>عزيزي الطالب / الطالبة:</p>
            <p>
              ندعوك للمشاركة في هذه الدراسة الأكاديمية التي تهدف إلى تقييم جودة
              الأخبار الرقمية لدى طلبة الجامعات. ستستغرق التجربة حوالي{" "}
              <strong>10 دقائق</strong>.
            </p>
            <p>
              نؤكد لك أن جميع بياناتك ستعامل بسرية تامة وتستخدم لأغراض البحث
              العلمي فقط. مشاركتك <strong>طوعية</strong> ويمكنك الانسحاب في أي
              وقت.
            </p>
            <p>
              نود أن نعرب لك عن خالص امتناننا لوقتك وجهدك في إتمام هذه الدراسة.
            </p>
          </div>

          <SoftDivider />

          <div>
            <FieldLabel required>هل توافق على المشاركة؟</FieldLabel>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              {[
                {
                  val: "yes",
                  label: "نعم، أوافق على المشاركة",
                  primary: true,
                },
                { val: "no", label: "لا، أرفض المشاركة", primary: false },
              ].map(({ val, label, primary }) => {
                const selected = form.consent === val;
                return (
                  <ConsentChoice
                    key={val}
                    selected={selected}
                    primary={primary}
                    label={label}
                    onClick={() => updateField("consent", val)}
                  />
                );
              })}
            </div>
          </div>

          <ErrorNotice message={error} />

          <div className="mt-6 flex justify-start">
            <PrimaryButton onClick={next}>ابدأ الاستبيان</PrimaryButton>
          </div>
        </StepSection>
      )}

      {step === 2 && (
        <StepSection>
          <SectionHeading
            eyebrow="الخطوة 1"
            title="البيانات الديموغرافية والتقنية"
          />

          <div className="space-y-8">
            <div>
              <FieldLabel required>الجنس</FieldLabel>
              <RadioGroup
                name="gender"
                value={form.gender}
                onChange={updateField}
                options={demographics.gender}
                columns={2}
              />
            </div>

            <div>
              <FieldLabel required>السن</FieldLabel>
              <TextField
                value={form.age}
                onChange={(e) =>
                  updateField(
                    "age",
                    e.target.value.replace(
                      /[^\d\u0660-\u0669\u06F0-\u06F9]/g,
                      "",
                    ),
                  )
                }
                placeholder="أدخل العمر بالأرقام"
                inputMode="numeric"
                pattern="[0-9\u0660-\u0669\u06F0-\u06F9]*"
                maxLength={3}
              />
            </div>

            <div>
              <FieldLabel required>المستوى الدراسي</FieldLabel>
              <RadioGroup
                name="level"
                value={form.level}
                onChange={updateField}
                options={demographics.level}
                columns={3}
              />
            </div>

            <div>
              <FieldLabel required>التخصص</FieldLabel>
              <RadioGroup
                name="specialization"
                value={form.specialization}
                onChange={updateField}
                options={demographics.specialization}
                columns={3}
              />
            </div>

            <div>
              <FieldLabel required>معدل استخدام الإنترنت يومياً</FieldLabel>
              <RadioGroup
                name="internetUsage"
                value={form.internetUsage}
                onChange={updateField}
                options={demographics.internetUsage}
                columns={3}
              />
            </div>

            <div>
              <FieldLabel required>
                مدى معرفتك بتقنيات الذكاء الاصطناعي
              </FieldLabel>
              <RadioGroup
                name="aiKnowledge"
                value={form.aiKnowledge}
                onChange={updateField}
                options={demographics.aiKnowledge}
                columns={4}
              />
            </div>

            <div>
              <FieldLabel required>
                هل تستخدم أدوات مثل ChatGPT أو Gemini؟
              </FieldLabel>
              <RadioGroup
                name="aiToolsUsage"
                value={form.aiToolsUsage}
                onChange={updateField}
                options={demographics.aiToolsUsage}
                columns={4}
              />
            </div>
          </div>

          <ErrorNotice message={error} />
          <ActionRow
            onPrev={prev}
            onNext={next}
            step={step}
            prevDisabled={step === 1}
          />
        </StepSection>
      )}

      {step === 3 && (
        <StepSection width="narrow">
          <SectionHeading eyebrow="الخطوة 2" title="تعليمات القراءة" />

          <div className="rounded-md bg-(--warning-bg) px-5 py-5 sm:px-6 sm:py-6">
            <p className="text-right text-sm leading-8 text-(--text-body) sm:text-base">
              «عزيزي الطالب، ستُعرض عليك الآن أخبار قصيرة تتناول قضايا معاصرة
              (طبية، بيئية، وتقنية). نرجو منك قراءة كل خبر بعناية وتركيز تامين،
              وكأنك تتصفحه في وسيلة إعلامية رسمية، حيث إن إجاباتك اللاحقة تعتمد
              كلياً على فهمك الدقيق لمحتوى هذه النصوص وأسلوب صياغتها. بعد قراءة
              كل خبر ستظهر لك مجموعة من الأسئلة لتقييم انطباعك الأول حوله.»
            </p>

            <div className="mt-5 border-t border-(--warning-border) pt-4">
              <p className="text-right text-sm font-semibold text-(--warning) sm:text-base">
                ملاحظة: لا توجد إجابات صحيحة أو خاطئة، نحن نهتم فقط برأيك الشخصي
                وتقييمك النقدي كطالب جامعي.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-start">
            <PrimaryButton onClick={next}>ابدأ التجربة</PrimaryButton>
          </div>
        </StepSection>
      )}

      {step === 4 && (
        <StepSection width="wide">
          <ArticleBlock
            title={articleTitle}
            category={articleCategory}
            paragraphs={articleParagraphs}
            showReminder={false}
            disclosureText={disclosureText}
          />

          <LikertGroup
            title="جدول تقييم الخبر"
            sub="يرجى تحديد مدى اتفاقك مع العبارات التالية:"
            questions={preQuestions}
            form={form}
            onChange={updateField}
            labels={likertLabels}
          />

          <ErrorNotice message={error} />

          <ActionRow
            onPrev={prev}
            onNext={next}
            step={step}
            prevDisabled={false}
          />
        </StepSection>
      )}

      {step === 5 && (
        <StepSection width="narrow">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-md border border-(--warning-border) bg-white shadow-[var(--shadow-sm)]">
              {/* top accent */}
              <div className="h-1.5 bg-[linear-gradient(90deg,var(--amber-700),#d7a24a)]" />

              <div className="px-5 py-6 text-center sm:px-8 sm:py-8">
                {/* icon */}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-(--warning-bg) text-(--amber-700)">
                  <FiAlertTriangle
                    className="text-[1.6rem]"
                    aria-hidden="true"
                  />
                </div>

                {/* title */}
                <h2 className="mb-3 text-center text-[1.35rem] font-bold text-(--amber-700) sm:text-[1.7rem]">
                  تنبيه هام
                </h2>

                {/* intro */}
                <p className="mb-3 text-center text-sm font-semibold text-(--text-strong) sm:text-base">
                  الأخبار التي قرأتها تم إنتاجها بواسطة:
                </p>

                {/* disclosure */}
                <div className="mx-auto mb-5 max-w-xl rounded-md border border-(--warning-border) bg-(--warning-bg) px-4 py-4 text-center shadow-[var(--shadow-xs)]">
                  <p className="text-base font-bold leading-8 text-(--text-strong) sm:text-[1.05rem]">
                    {disclosureText}
                  </p>
                </div>

                {/* explanation */}
                <p className="mx-auto mb-7 max-w-[46ch] text-center text-sm leading-8 text-(--text-muted) sm:text-base">
                  سنعرض الخبر مرة أخرى، ثم نطلب منك إعادة التقييم بعد معرفة
                  طبيعة المصدر، حتى نقارن بين الانطباع الأول والانطباع بعد
                  الإفصاح.
                </p>

                {/* action */}
                <div className="flex justify-center">
                  <DangerButton onClick={next} className="min-w-[180px]">
                    متابعة التقييم
                  </DangerButton>
                </div>
              </div>
            </div>
          </div>
        </StepSection>
      )}

      {step === 6 && (
        <StepSection width="wide">
          <ArticleBlock
            title={articleTitle}
            category={articleCategory}
            paragraphs={articleParagraphs}
            showReminder
            disclosureText={disclosureText}
          />

          <LikertGroup
            title="جدول تقييم الخبر"
            sub="يرجى تحديد مدى اتفاقك مع العبارات التالية:"
            questions={postQuestions}
            form={form}
            onChange={updateField}
            labels={likertLabels}
          />

          <ErrorNotice message={error} />

          <ActionRow
            onPrev={prev}
            onNext={next}
            step={step}
            prevDisabled={false}
          />
        </StepSection>
      )}

      {step === 7 && (
        <StepSection width="wide">
          <SectionHeading
            eyebrow="الخطوة 5"
            title="قياس الثقة في المصدر"
            subtitle={`بناءً على معرفتك الآن بأن المصدر هو "${disclosureText}"، يرجى تحديد مدى اتفاقك مع العبارات التالية:`}
          />

          <div className="space-y-4">
            {sourceTrustQuestions.map((question) => (
              <LikertCard
                key={question.key}
                name={question.key}
                text={question.text}
                value={form[question.key]}
                onChange={updateField}
                labels={likertLabels}
              />
            ))}
          </div>

          <ErrorNotice message={error} />

          <ActionRow
            onPrev={prev}
            onNext={next}
            step={step}
            prevDisabled={false}
          />
        </StepSection>
      )}

      {step === 8 && (
        <StepSection width="wide">
          <SectionHeading
            eyebrow="الخطوة 6"
            title="مقياس الاستدلال الآلي"
            subtitle="يرجى تحديد مدى اتفاقك مع العبارات التالية التي تصف أنظمة الذكاء الاصطناعي بشكل عام عند استخدامها في كتابة الأخبار:"
          />

          <div className="space-y-4">
            {aiReasoningQuestions.map((question) => (
              <LikertCard
                key={question.key}
                name={question.key}
                text={question.text}
                value={form[question.key]}
                onChange={updateField}
                labels={likertLabels}
              />
            ))}
          </div>

          <ErrorNotice message={error} />

          <ActionRow
            onPrev={prev}
            onNext={next}
            step={step}
            prevDisabled={false}
          />
        </StepSection>
      )}

      {step === 9 && (
        <StepSection>
          <SectionHeading eyebrow="الخطوة 7" title="ما بعد التجربة" />

          <div className="space-y-8">
            <div>
              <FieldLabel>
                ما هو شعورك اللحظي أو انطباعك الأول عند اكتشاف هوية المصدر في
                منتصف التجربة؟
                <span className="mr-2 text-xs font-normal text-(--error)">
                  (يمكنك اختيار أكثر من إجابة)
                </span>
              </FieldLabel>

              <div className="space-y-2.5">
                {postExperimentFeelings.map((item) => (
                  <CheckOption
                    key={item}
                    checked={feelings.includes(item)}
                    onChange={() => toggleFeeling(item)}
                    label={item}
                  />
                ))}
              </div>

              {feelings.includes("أخرى (يرجى تحديد شعورك بدقة)") && (
                <div className="mt-3">
                  <TextField
                    value={form.otherFeelingText}
                    onChange={(e) =>
                      updateField("otherFeelingText", e.target.value)
                    }
                    placeholder="اكتب الشعور الآخر هنا..."
                  />
                </div>
              )}
            </div>

            <div>
              <FieldLabel required>
                بناءً على تجربتك اليوم، كيف ستكون طريقتك في تقييم الأخبار
                الرقمية مستقبلاً؟
              </FieldLabel>

              <RadioGroup
                name="futureBehavior"
                value={form.futureBehavior}
                onChange={updateField}
                options={futureBehaviorOptions}
              />
            </div>

            <div>
              <FieldLabel required>
                يرجى توضيح سبب اختيارك للإجابة السابقة بإيجاز، وكيف أثرت هذه
                التجربة على نظرتك «للثقة» في الإعلام الرقمي؟
              </FieldLabel>

              <TextareaField
                value={form.finalExplanation}
                onChange={(e) =>
                  updateField("finalExplanation", e.target.value)
                }
                placeholder="اكتب إجابتك هنا..."
                rows={6}
              />
            </div>
          </div>

          <ErrorNotice message={error} />

          <ActionRow
            onPrev={prev}
            onSubmit={submit}
            step={step}
            prevDisabled={false}
            isSubmitting={isSubmitting}
          />
        </StepSection>
      )}
    </Shell>
  );
}
