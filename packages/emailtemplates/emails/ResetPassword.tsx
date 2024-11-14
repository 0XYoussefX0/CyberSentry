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

// TODO: pass the minio Host to the function so that it can be used in the getPublicUrl func when the app is in production

const getPublicUrl = (
  bucket_name: string,
  fileName: string,
  host: string,
  protocol: "https" | "http",
) => {
  return `${protocol}://${host}:9000/${bucket_name}/${fileName}`;
};

export const ResetPassword = ({
  name,
  reset_link,
}: { name: string; reset_link: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your IMS Technology account password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width={100}
              src={getPublicUrl(
                "public-assets",
                "Logo.png",
                "localhost",
                "http",
              )}
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
            <Text style={paragraph}>Hi {name} 👋,</Text>
            <Text style={paragraph}>
              We received a request to reset the password for your IMS
              Technology account. No worries—it's easy to get back on track!
            </Text>
            <Text style={paragraph}>
              To reset your password, simply click the button below:
            </Text>
            <Text style={paragraph}>
              <Button style={button} href={reset_link}>
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
              IMS Technology Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Column align="right" style={{ width: "fit", paddingRight: "8px" }}>
              <Link href="https://www.facebook.com">
                <Img
                  style={{ width: 20, height: 20 }}
                  src={getPublicUrl(
                    "public-assets",
                    "facebook.png",
                    "localhost",
                    "http",
                  )}
                />
              </Link>
            </Column>
            <Column style={{ width: "28px", paddingLeft: "8px" }}>
              <Link href="https://www.instagram.com">
                <Img
                  style={{ width: 20, height: 20 }}
                  src={getPublicUrl(
                    "public-assets",
                    "instagram.png",
                    "localhost",
                    "http",
                  )}
                />
              </Link>
            </Column>
            <Column align="left" style={{ width: "fit", paddingLeft: "8px" }}>
              <Link href="https://x.com">
                <Img
                  style={{ width: 17, height: 17 }}
                  src={getPublicUrl(
                    "public-assets",
                    "x.png",
                    "localhost",
                    "http",
                  )}
                />
              </Link>
            </Column>
          </Row>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>
              © 2024 IMS Technology, All Rights Reserved <br />
              123 Boulevard Mohamed VI, 3rd Floor, Casablanca, 20000 - Morocco
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

export default ResetPassword;

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
  borderBottom: "1px solid #1B2947",
  width: "102px",
};

const button = {
  backgroundColor: "#1B2947",
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
