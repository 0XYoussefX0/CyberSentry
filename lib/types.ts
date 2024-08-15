import * as v from "valibot";

type Constraints = "length" | "symbol" | "uppercase" | "number";

export type PasswordConstraints = {
  id: Constraints;
  text: string;
}[];

export const SignUpSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email is required"),
    v.email("Invalid email address")
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required"),
    v.minLength(8, "Your password is too short."),
    v.regex(/[a-z]/, "Your password must contain a lowercase letter."),
    v.regex(/[A-Z]/, "Your password must contain an uppercase letter."),
    v.regex(/[0-9]/, "Your password must contain a number."),
    v.regex(
      /(?=.[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/,
      "Your password must contain a special character."
    )
  ),
});

export type SignUpSchemaType = v.InferOutput<typeof SignUpSchema>;
