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

export const ConfirmSession = ({
  name,
  verifyLink,
}: { name: string; verifyLink: string }) => {
  return (
    <Html>
      <Head />
      <Preview>
        Confirm your session to ensure it's really you accessing your account.
      </Preview>
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
            <Text style={paragraph}>Welcome to IMS Technology!</Text>
            <Text style={paragraph}>
              We noticed a login attempt using your credentials. To make sure
              it's really you, please confirm your session by clicking the
              button below. This helps us protect your account from unauthorized
              access.
            </Text>
            <Text style={paragraph}>
              <Button style={button} href={verifyLink}>
                Confirm Your Session
              </Button>
            </Text>
            <Text style={paragraph}>
              If you did not attempt to log in, please secure your account
              immediately by contacting our support team.
            </Text>
            <Text style={paragraph}>
              Best regards,
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

export default ConfirmSession;

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
  paddingRight: 8,
  paddingTop: 10,
  paddingBottom: 10,
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
