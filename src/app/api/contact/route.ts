import { NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { contactSubmissionSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = contactSubmissionSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields and try again.",
        errors: result.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const { name, email, phone, message } = result.data;

  await prisma.contactSubmission.create({
    data: {
      name,
      email,
      phone,
      message
    }
  });

  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "site-settings" } });

    if (settings?.contactNotificationEmail) {
      await sendContactNotification({
        recipient: settings.contactNotificationEmail,
        name,
        email,
        phone,
        message
      });
    }
  } catch (error) {
    console.error("Contact notification email failed:", error);
  }

  return NextResponse.json(
    {
      message: "Thank you, we will contact you shortly."
    },
    { status: 201 }
  );
}
