// Drizzle
import { JobInfos, TQuestionDifficulties, Questions } from "@/drizzle/schema";
// AI
import { CoreMessage, streamText } from "ai";
// Modules
import { google } from "./models/google";

type TGenerateAiQuestion = {
    jobInfo: Pick<
        typeof JobInfos.$inferSelect,
        "title" | "description" | "experienceLevel"
    >;
    previousQuestions: Pick<
        typeof Questions.$inferSelect,
        "text" | "difficulty"
    >[];
    difficulty: TQuestionDifficulties;
    onFinish: (question: string) => void;
};

type TGenerateAiQuestionFeedback = {
    question: string;
    answer: string;
};

export function generateAiQuestion({
    jobInfo,
    previousQuestions,
    difficulty,
    onFinish,
}: TGenerateAiQuestion) {
    const previousMessages = previousQuestions.flatMap(
        (q) =>
            [
                { role: "user", content: q.difficulty },
                { role: "assistant", content: q.text },
            ] satisfies CoreMessage[]
    );

    return streamText({
        model: google("gemini-2.5-flash"),
        onFinish: ({ text }) => onFinish(text),
        messages: [
            ...previousMessages,
            {
                role: "user",
                content: difficulty,
            },
        ],
        maxSteps: 10,
        experimental_continueSteps: true,
        system: `«شما یک دستیار هوش مصنوعی هستید که سوالات مصاحبه فنی متناسب با یک نقش شغلی خاص را ایجاد می‌کنید. وظیفه شما ایجاد یک سوال فنی **واقع‌بینانه و مرتبط** است که با الزامات مهارتی شغل مطابقت داشته باشد و با سطح دشواری ارائه شده توسط کاربر همسو باشد.


اطلاعات شغلی:
- شرح شغل: \`${jobInfo.description}\`
- سطح تجربه: \`${jobInfo.experienceLevel}\`
${jobInfo.title ? `\n- عنوان شغلی: \`${jobInfo.title}\`` : ""}

دستورالعمل‌ها:
- سوال باید منعکس کننده مهارت‌ها و فناوری‌های ذکر شده در شرح شغل باشد.

- مطمئن شوید که سوال به طور مناسب برای سطح تجربه مشخص شده طراحی شده است.

- سطح دشواری «آسان»، «متوسط» یا «سخت» توسط کاربر ارائه می‌شود و باید برای تنظیم سوال استفاده شود.

- چالش‌های عملی و واقعی را به مسائل جزئی ترجیح دهید. - فقط سوال را با فرمت واضح (مثلاً با قطعه کد یا نقاط بولت در صورت نیاز) برگردانید. پاسخ را وارد نکنید.

- فقط یک سوال را در هر زمان برگردانید.

- پرسیدن سوال فقط در مورد یک بخش از شرح شغل، مانند یک فناوری یا مهارت خاص، اشکالی ندارد (مثلاً اگر شرح شغل برای یک توسعه‌دهنده Next.js، Drizzle و TypeScript است، می‌توانید فقط یک سوال TypeScript بپرسید).

- سوال باید به صورت markdown فرمت شود.

- به محض اینکه سوال کامل را ارائه دادید، تولید خروجی را متوقف کنید.`,
    });
}

export function generateAiQuestionFeedback({
    question,
    answer,
}: TGenerateAiQuestionFeedback) {
    return streamText({
        model: google("gemini-2.5-flash"),
        prompt: answer,
        maxSteps: 10,
        experimental_continueSteps: true,
        system: `شما یک مصاحبه‌گر فنی متخصص هستید. وظیفه شما ارزیابی پاسخ داوطلب به یک سوال مصاحبه فنی است.

سوال اصلی این بود:
\`\`\`
${question}
\`\`\`

دستورالعمل‌ها:
- پاسخ داوطلب (ارائه شده در فرم درخواست کاربر) را بررسی کنید.

- از **1 تا 10** امتیاز دهید، که در آن:

- 10 = کامل، کامل و با بیان خوب

- 7-9 = تقریباً درست، با مشکلات جزئی یا جای بهینه‌سازی

- 4-6 = تا حدی درست یا ناقص

- 1-3 = تا حد زیادی نادرست یا نکته را از قلم انداخته است

- **بازخورد مختصر و سازنده** در مورد آنچه به خوبی انجام شده و آنچه می‌تواند بهبود یابد، ارائه دهید.

- صادق اما حرفه‌ای باشید.

- یک پاسخ کاملاً صحیح را در خروجی بگنجانید. از این پاسخ به عنوان بخشی از نمره‌دهی استفاده نکنید. هنگام دادن امتیاز، فقط به پاسخ داوطلب نگاه کنید.

- سعی کنید در صورت امکان یک پاسخ مختصر ارائه دهید، اما کیفیت را فدای اختصار نکنید.
- در بازخورد خود، داوطلب را با عنوان «شما» خطاب کنید. این بازخورد باید طوری نوشته شود که انگار مستقیماً با مصاحبه‌شونده صحبت می‌کنید.

- به محض اینکه امتیاز، بازخورد و پاسخ صحیح کامل را ارائه دادید، تولید خروجی را متوقف کنید.

قالب خروجی (کاملاً از این ساختار پیروی کنید):

## بازخورد (امتیاز: <امتیاز شما از ۱ تا ۱۰>/۱۰)
<بازخورد کتبی شما به عنوان نمره منفی>
---
## پاسخ صحیح
<پاسخ صحیح کامل به عنوان نمره منفی>
\`\`\``,
    });
}
