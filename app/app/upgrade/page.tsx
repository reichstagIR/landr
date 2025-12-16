// Clerk
import { PricingTable } from "@clerk/nextjs";
// Component
import { BackLink } from "@/components/BackLink";
// Icon
import { AlertTriangle } from "lucide-react";
// ShadCn
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UpgradePage() {
    return (
        <div className="container py-4 max-w-6xl">
            <div className="mb-4">
                <BackLink href="/app">داشبورد</BackLink>
            </div>

            <div className="space-y-16">
                <Alert variant="destructive">
                    <AlertTriangle />
                    <AlertTitle>محدودیت پلن</AlertTitle>
                    <AlertDescription>
                        شما به حد نهایی درخواست های پلن خود رسیدید لطفا پلن خود
                        ار ارتقا دهید
                    </AlertDescription>
                </Alert>

                <PricingTable />
            </div>
        </div>
    );
}
