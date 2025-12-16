// Next
import { NextRequest, NextResponse } from "next/server";
// Clerk
import { verifyWebhook } from "@clerk/nextjs/webhooks";
// Actions
import { deleteUser, upsertUser } from "@/features/users/db";

export async function POST(request: NextRequest) {
    try {
        const event = await verifyWebhook(request);

        switch (event.type) {
            case "user.created":
            case "user.updated":
                const clerkData = event.data;

                const email = clerkData.email_addresses.find(
                    (email) => email.id === clerkData.primary_email_address_id
                )?.email_address;

                if (!email) {
                    return new NextResponse("No primary email found", {
                        status: 400,
                    });
                }

                await upsertUser({
                    id: clerkData.id,
                    email: email,
                    name: `${clerkData.first_name} ${clerkData.last_name}`,
                    imageUrl: clerkData.image_url,
                    createAt: new Date(clerkData.created_at),
                    updateAt: new Date(clerkData.updated_at),
                });

                break;

            case "user.deleted":
                if (!event.data.id) {
                    return new NextResponse("No user ID found", {
                        status: 400,
                    });
                }

                await deleteUser(event.data.id);

                break;
        }
    } catch {
        return new NextResponse("Invalid Webhook", { status: 400 });
    }

    return new NextResponse("Webhook Received", { status: 200 });
}
