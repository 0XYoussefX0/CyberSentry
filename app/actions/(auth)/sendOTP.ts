"use server";
import { createClient } from "@/lib/supabase/server";
import { isValidPhoneNumber } from "libphonenumber-js";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export default async function sendOTP(phoneNumber: string) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    /* handle error */
  }
  if (!user) return;

  const isValid = isValidPhoneNumber(phoneNumber);
  if (!isValid) {
    return { status: "error", message: "Invalid phone number" };
  }

  const client = twilio(accountSid, authToken);
  const verification = await client.verify.v2
    .services("CyberSentry")
    .verifications.create({
      channel: "sms",
      to: phoneNumber,
    });

  if (verification.status === "pending") {
    return { status: "success" };
  }
}
