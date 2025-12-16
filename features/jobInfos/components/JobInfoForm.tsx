"use client";

// React Hook Form
import { useForm } from "react-hook-form";
// Zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// Drizzle
import { experienceLevel, JobInfos } from "@/drizzle/schema";
// ShadCn
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LoadingSwap } from "@/components/ui/loading-swap";
// Schema
import { jobInfoSchema } from "../schemas";
// Lib
import { formatExperienceLevel } from "../lib/formatter";
// Action
import { createJobInfos, updateJobInfos } from "../actions";

type JobInfoFormData = z.infer<typeof jobInfoSchema>;

export function JobInfoForm({
    jobInfo,
}: {
    jobInfo?: Pick<
        typeof JobInfos.$inferSelect,
        "id" | "name" | "title" | "description" | "experienceLevel"
    >;
}) {
    const form = useForm<JobInfoFormData>({
        resolver: zodResolver(jobInfoSchema),
        defaultValues: jobInfo ?? {
            name: "",
            title: null,
            description: "",
            experienceLevel: "junior",
        },
    });

    const onSubmit = async (data: JobInfoFormData) => {
        const action = jobInfo
            ? updateJobInfos.bind(null, jobInfo.id)
            : createJobInfos;

        const res = await action(data);

        if (res?.error) {
            toast.error(res.message);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>نام</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                این نام برای شناسایی آسان در رابط کاربری نمایش
                                داده می‌شود.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>عنوان شغل</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value || null
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    اختیاری. فقط در صورتی که عنوان شغلی خاصی
                                    برای آن درخواست می‌دهید، وارد کنید.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>سطح تجربه</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {experienceLevel.map((level) => (
                                            <SelectItem
                                                key={level}
                                                value={level}
                                            >
                                                {formatExperienceLevel(level)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>توضیحات</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormDescription>
                                تا حد امکان دقیق باشید. هر چه اطلاعات بیشتری
                                ارائه دهید، مصاحبه‌ها بهتر خواهند بود.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="w-full"
                >
                    <LoadingSwap isLoading={form.formState.isSubmitting}>
                        ذخیره اطلاعات شغل
                    </LoadingSwap>
                </Button>
            </form>
        </Form>
    );
}
