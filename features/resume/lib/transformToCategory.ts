/* eslint-disable @typescript-eslint/no-explicit-any */
export default function transformFlatArrayToCategory(flatArray: any[]) {
    let result: any = {};

    // پیمایش آرایه برای پیدا کردن کلیدهای اصلی
    for (let i = 0; i < flatArray.length; i++) {
        const item = flatArray[i];

        if (item === "score") {
            result.score = flatArray[i + 1];
        } else if (item === "summary") {
            result.summary = flatArray[i + 1];
        } else if (item === "feedback") {
            // بخش فیدبک خودش یک زیر-آرایه تخت است
            // پیدا کردن ایندکس‌های مربوط به فیلدهای فیدبک
            const feedbackData = flatArray.slice(i + 1);
            const feedbackObj: any = {};

            for (let j = 0; j < feedbackData.length; j++) {
                if (feedbackData[j] === "type")
                    feedbackObj.type = feedbackData[j + 1];
                if (feedbackData[j] === "name")
                    feedbackObj.name = feedbackData[j + 1];
                if (feedbackData[j] === "message")
                    feedbackObj.message = feedbackData[j + 1];
            }

            result = { ...result, feedback: [] };

            if (Object.keys(feedbackObj).length > 0) {
                result.feedback.push(feedbackObj);
            }
        }
    }

    return result;
}
