import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export const ForgotPassword = () => {
  return (
    <Html>
      <Head />
      <Preview>You updated the password for your Twitch account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width={150}
              src="http://localhost/v1/storage/buckets/66f05e0e001e13410008/files/66f05ec20035bec76102/view?project=66d9edab001522e8390b&project=66d9edab001522e8390b&mode=admin"
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
            <Text style={paragraph}>
              We received a request to reset the password for your CyberSentry
              account. No worries—it's easy to get back on track!
            </Text>
            <Text style={paragraph}>
              To reset your password, simply click the button below:
            </Text>
            <Text style={paragraph}>
              <Button
                style={button}
                href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/resetpassword"
              >
                Reset Your Password
              </Button>
            </Text>
            <Text style={paragraph}>
              If you didn't request a password reset, you can safely ignore this
              email. Your password will remain unchanged.
            </Text>
            <Text style={paragraph}>
              If you need further assistance, feel free to contact our support
              team.
            </Text>
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
                  src="http://localhost/v1/storage/buckets/66f05e0e001e13410008/files/66f05eac0013bd86d929/view?project=66d9edab001522e8390b&project=66d9edab001522e8390b&mode=admin"
                />
              </Link>
            </Column>
            <Column style={{ width: "28px", paddingLeft: "8px" }}>
              <Link href="https://www.instagram.com">
                <Img
                  style={{ width: 20, height: 20 }}
                  src="http://localhost/v1/storage/buckets/66f05e0e001e13410008/files/66f05eba0021325fd1b9/view?project=66d9edab001522e8390b&project=66d9edab001522e8390b&mode=admin"
                />
              </Link>
            </Column>
            <Column align="left" style={{ width: "fit", paddingLeft: "8px" }}>
              <Link href="https://x.com">
                <Img
                  style={{ width: 20, height: 20 }}
                  src="http://localhost/v1/storage/buckets/66f05e0e001e13410008/files/66f05eca000438a28670/view?project=66d9edab001522e8390b&project=66d9edab001522e8390b&mode=admin"
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

export default ForgotPassword;

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
