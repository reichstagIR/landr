// ShadCn
import { Card, CardContent } from "@/components/ui/card";
// Component
import { BackLink } from "@/components/BackLink";
import { JobInfoForm } from "@/features/jobInfos/components/JobInfoForm";

export default function JobInfoNewPage() {
    return (
        <div className="container my-4 max-w-5xl space-y-4">
            <BackLink href="/app">داشبورد</BackLink>
            <h1 className="text-3xl md:text-4xl">ایجاد شغل جدید</h1>

            <Card>
                <CardContent>
                    <JobInfoForm />
                </CardContent>
            </Card>
        </div>
    );
}
