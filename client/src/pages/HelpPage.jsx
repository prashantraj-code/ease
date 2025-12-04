import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  font-family: "Futura", sans-serif;
`;

const Description = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 20px;
  font-family: "Futura", sans-serif;
`;

const HelpSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 8px;
  font-family: "Futura", sans-serif;
`;

const SectionText = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  font-family: "Futura", sans-serif;
`;

export default function HelpPage() {
  return (
    <Container>
      <Title>Help & Support</Title>
      <Description>
        Find answers to common questions and get support.
      </Description>

      <HelpSection>
        <SectionTitle>How to add a transaction?</SectionTitle>
        <SectionText>
          Click the "+ Add Transaction" button, fill in the details (type,
          person, amount, etc.), and submit.
        </SectionText>
      </HelpSection>

      <HelpSection>
        <SectionTitle>How to track money lent vs borrowed?</SectionTitle>
        <SectionText>
          Use the dashboard cards to see your total lent, borrowed, and net
          balance at a glance.
        </SectionText>
      </HelpSection>

      <HelpSection>
        <SectionTitle>Need more help?</SectionTitle>
        <SectionText>
          Contact support at support@ease.com for additional assistance.
        </SectionText>
      </HelpSection>
    </Container>
  );
}
