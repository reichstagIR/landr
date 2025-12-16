// Toast
import { toast } from "sonner";
// ShadCn
import { Button } from "@/components/ui/button";
// أثطف
import Link from "next/link";

export const PLAN_LIMIT_MESSAGE = "PLAN_LIMIT";
export const RATE_LIMIT_MESSAGE = "RATE_LIMIT";

export function errorToast(message: string) {
    if (message === PLAN_LIMIT_MESSAGE) {
        const toastId = toast.error("به محدودیت پلن خود رسیده اید!", {
            action: (
                <Button
                    size="sm"
                    asChild
                    onClick={() => toast.dismiss(toastId)}
                >
                    <Link href="/app/upgrade">اتقا</Link>
                </Button>
            ),
        });
    }


    if (message === RATE_LIMIT_MESSAGE) {
       toast.error("هی یواش!", {
            description: "شما درخواست های زیادی ایجاد کردید!"
        });
    }

    toast.error(message);
}
