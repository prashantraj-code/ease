import { useState } from "react";
import styled from "styled-components";

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-family: "Futura", sans-serif;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  font-family: "Futura", sans-serif;
`;

const SettingsContainer = styled.div`
  max-width: 800px;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  font-family: "Futura", sans-serif;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  font-family: "Futura", sans-serif;
`;

const SettingDescription = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #10b981;
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  border-radius: 24px;
  transition: 0.3s;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  font-family: "Futura", sans-serif;
  outline: none;

  &:focus {
    border-color: #10b981;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Futura", sans-serif;
  outline: none;
  max-width: 200px;

  &:focus {
    border-color: #10b981;
  }
`;

const Button = styled.button`
  padding: 10px 18px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Futura", sans-serif;

  &:hover {
    background: #f9fafb;
  }
`;

const PrimaryButton = styled(Button)`
  background: #10b981;
  color: white;
  border-color: #10b981;

  &:hover {
    background: #059669;
  }
`;

const DangerButton = styled(Button)`
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;

  &:hover {
    background: #fecaca;
  }
`;

const InfoBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #166534;
  margin: 0;
  font-family: "Futura", sans-serif;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-family: "Futura", sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailReminders: true,
    dueDateAlerts: true,
    darkMode: false,
    currency: "INR",
    language: "en",
    autoBackup: true,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSelect = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>
          Manage your account preferences and application settings
        </PageSubtitle>
      </PageHeader>

      <SettingsContainer>
        <Section>
          <SectionTitle>Notifications</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Push Notifications</SettingLabel>
              <SettingDescription>
                Receive notifications about your transactions
              </SettingDescription>
            </SettingInfo>
            <Toggle>
              <ToggleInput
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle("notifications")}
              />
              <ToggleSlider />
            </Toggle>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Email Reminders</SettingLabel>
              <SettingDescription>
                Get email reminders for upcoming payments
              </SettingDescription>
            </SettingInfo>
            <Toggle>
              <ToggleInput
                type="checkbox"
                checked={settings.emailReminders}
                onChange={() => handleToggle("emailReminders")}
              />
              <ToggleSlider />
            </Toggle>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Due Date Alerts</SettingLabel>
              <SettingDescription>
                Alert me 2 days before payment due dates
              </SettingDescription>
            </SettingInfo>
            <Toggle>
              <ToggleInput
                type="checkbox"
                checked={settings.dueDateAlerts}
                onChange={() => handleToggle("dueDateAlerts")}
              />
              <ToggleSlider />
            </Toggle>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Appearance</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Dark Mode</SettingLabel>
              <SettingDescription>
                Enable dark theme for better visibility at night
              </SettingDescription>
            </SettingInfo>
            <Toggle>
              <ToggleInput
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle("darkMode")}
              />
              <ToggleSlider />
            </Toggle>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Currency</SettingLabel>
              <SettingDescription>
                Choose your preferred currency format
              </SettingDescription>
            </SettingInfo>
            <Select
              value={settings.currency}
              onChange={(e) => handleSelect("currency", e.target.value)}
            >
              <option value="INR">₹ INR - Indian Rupee</option>
              <option value="USD">$ USD - US Dollar</option>
              <option value="EUR">€ EUR - Euro</option>
              <option value="GBP">£ GBP - British Pound</option>
            </Select>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Language</SettingLabel>
              <SettingDescription>
                Select your preferred language
              </SettingDescription>
            </SettingInfo>
            <Select
              value={settings.language}
              onChange={(e) => handleSelect("language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </Select>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Data & Privacy</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Auto Backup</SettingLabel>
              <SettingDescription>
                Automatically backup your data every week
              </SettingDescription>
            </SettingInfo>
            <Toggle>
              <ToggleInput
                type="checkbox"
                checked={settings.autoBackup}
                onChange={() => handleToggle("autoBackup")}
              />
              <ToggleSlider />
            </Toggle>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Export Data</SettingLabel>
              <SettingDescription>
                Download all your transaction data
              </SettingDescription>
            </SettingInfo>
            <Button>Export CSV</Button>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Account</SectionTitle>
          <FormGroup>
            <Label>Change Password</Label>
            <Input type="password" placeholder="Current password" />
          </FormGroup>
          <FormGroup>
            <Input type="password" placeholder="New password" />
          </FormGroup>
          <FormGroup>
            <Input type="password" placeholder="Confirm new password" />
          </FormGroup>
          <ButtonGroup>
            <PrimaryButton>Update Password</PrimaryButton>
          </ButtonGroup>
          <InfoBox>
            <InfoText>
              💡 Use a strong password with at least 8 characters, including
              uppercase, lowercase, numbers, and symbols.
            </InfoText>
          </InfoBox>
        </Section>

        <Section>
          <SectionTitle>Danger Zone</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Delete Account</SettingLabel>
              <SettingDescription>
                Permanently delete your account and all data
              </SettingDescription>
            </SettingInfo>
            <DangerButton
              onClick={() => {
                if (
                  window.confirm("Are you sure? This action cannot be undone.")
                ) {
                  alert("Account deletion would be processed here");
                }
              }}
            >
              Delete Account
            </DangerButton>
          </SettingRow>
        </Section>

        <ButtonGroup style={{ marginTop: "32px" }}>
          <PrimaryButton onClick={() => alert("Settings saved!")}>
            Save Changes
          </PrimaryButton>
          <Button>Reset to Defaults</Button>
        </ButtonGroup>
      </SettingsContainer>
    </>
  );
}
