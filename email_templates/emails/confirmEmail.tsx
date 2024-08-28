import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

export const ConfirmEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>You updated the password for your Twitch account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width={150}
              src="https://kyymsekbpdnvwmnhozrv.supabase.co/storage/v1/object/public/Email_assets/logo.png"
            />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi There 👋,</Text>
            <Text style={paragraph}>Welcome to CyberSentry!</Text>
            <Text style={paragraph}>
              We're thrilled to have you join our community. To complete your
              registration, please confirm your email address by clicking the
              button below. This step helps us verify your account and ensures
              you can start using all the features CyberSentry has to offer.
            </Text>
            <Text style={paragraph}>
              <Button
                style={button}
                href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=%2Fonboarding"
              >
                Confirm Your Email
              </Button>
            </Text>
            <Text style={paragraph}>
              If you have any questions or need assistance, feel free to reach
              out to CyberSentry Support.
            </Text>
            <Text style={paragraph}>Thanks for joining us!</Text>
            <Text style={paragraph}>
              Best,
              <br />
              CyberSentry Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Column align="right" style={{ width: "fit", paddingRight: "8px" }}>
              <Link href="https://www.facebook.com">
                <Img
                  style={{ width: 20, height: 20 }}
                  src="https://kyymsekbpdnvwmnhozrv.supabase.co/storage/v1/object/public/Email_assets/Facebook_Logo_Primary.png"
                />
              </Link>
            </Column>
            <Column style={{ width: "28px", paddingLeft: "8px" }}>
              <Link href="https://www.instagram.com">
                <Img
                  style={{ width: 20, height: 20 }}
                  src="https://kyymsekbpdnvwmnhozrv.supabase.co/storage/v1/object/public/Email_assets/Instagram_Glyph_Gradient.png"
                />
              </Link>
            </Column>
            <Column align="left" style={{ width: "fit", paddingLeft: "8px" }}>
              <Link href="https://x.com">
                <Img
                  style={{ width: 20, height: 20 }}
                  src="https://kyymsekbpdnvwmnhozrv.supabase.co/storage/v1/object/public/Email_assets/logo-black.png?t=2024-08-25T11%3A16%3A27.242Z"
                />
              </Link>
            </Column>
          </Row>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>
              © 2022 CyberSentry, All Rights Reserved <br />
              123 Boulevard Mohamed VI, 3rd Floor, Casablanca, 20000 - Morocco
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

export default ConfirmEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const link = {
  color: "#7F56D9",
  fontWeight: 600,
};

const container = {
  maxWidth: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
};

const footer = {
  maxWidth: "580px",
  margin: "0 auto",
};

const content = {
  padding: "5px 20px 10px 20px",
};

const logo = {
  display: "flex",
  justifyContent: "center",
  alingItems: "center",
  padding: 30,
};

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid rgb(145,71,255)",
  width: "102px",
};

const button = {
  backgroundColor: "#7F56D9",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "calc(100% - 20px)",
  padding: "10px",
};
