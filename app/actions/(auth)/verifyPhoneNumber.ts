"use server";
import { createClient } from "@/lib/supabase/server";
import { isValidPhoneNumber } from "libphonenumber-js";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export default async function verifyPhoneNumber(
  phoneNumber: string,
  otp: string
) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    /* handle error */
  }

  if (!user) return;

  if (otp.length !== 6) {
    return { status: "error", type: "otp", message: "Invalid otp length" };
  }

  const isValid = isValidPhoneNumber(phoneNumber);
  if (!isValid) {
    return {
      status: "error",
      type: "phoneNumber",
      message: "Invalid phone number",
    };
  }

  /* now check if the otp is valid */
  const client = twilio(accountSid, authToken);
  const verificationCheck = await client.verify.v2
    .services("CyberSentry")
    .verificationChecks.create({
      code: otp,
      to: phoneNumber,
    });

  console.log(verificationCheck.status);
}
