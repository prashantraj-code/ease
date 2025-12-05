import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  getUser,
  getTransactions,
  logout,
  updateProfile,
  updateCurrency,
  deleteAllTransactions,
} from "../api";
import { useNavigate } from "react-router-dom";

const PageHeader = styled.div`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 15px;
  color: #6b7280;
  margin: 8px 0 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const SettingsContainer = styled.div`
  max-width: 640px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px;
  font-family: "Futura", sans-serif;
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 20px;
  font-family: "Futura", sans-serif;

  @media (max-width: 480px) {
    margin: 0 0 16px;
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: "Futura", sans-serif;
`;

const SettingDescription = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
  font-family: "Futura", sans-serif;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background: white;
  cursor: pointer;
  font-family: "Futura", sans-serif;
  outline: none;

  &:focus {
    border-color: #10b981;
  }

  @media (max-width: 480px) {
    width: 100%;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 13px;
    width: 100%;
    justify-content: center;
  }
`;

const PrimaryButton = styled(Button)`
  background: #10b981;
  color: white;
  border-color: #10b981;

  &:hover:not(:disabled) {
    background: #059669;
  }
`;

const DangerButton = styled(Button)`
  background: #dc2626;
  color: white;
  border-color: #dc2626;

  &:hover:not(:disabled) {
    background: #b91c1c;
  }
`;

const DangerOutlineButton = styled(Button)`
  background: white;
  color: #dc2626;
  border-color: #dc2626;

  &:hover:not(:disabled) {
    background: #fef2f2;
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

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  color: #166534;
  font-size: 14px;
  font-family: "Futura", sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${(props) =>
    props.$hasImage
      ? "transparent"
      : "linear-gradient(135deg, #10b981, #059669)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: 700;
  font-family: "Futura", sans-serif;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }

  &:hover {
    opacity: 0.9;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 14px;
  color: white;

  ${Avatar}:hover & {
    opacity: 1;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileName = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  font-family: "Futura", sans-serif;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ProfileEmail = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #10b981;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: "Futura", sans-serif;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: #f0fdf4;
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  font-family: "Futura", sans-serif;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #10b981;
  }
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const AccountActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default function SettingsPage({ onUserUpdate }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCurrency, setSavingCurrency] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res.data.user);
        setEditName(res.data.user?.name || res.data.user?.username || "");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const showSuccessMessage = (msg) => {
    setShowSuccess(msg);
    setTimeout(() => setShowSuccess(""), 3000);
  };

  const handleCurrencyChange = async (value) => {
    setSavingCurrency(true);
    try {
      const res = await updateCurrency(value);
      setUser(res.user);
      if (onUserUpdate) onUserUpdate(res.user);
      showSuccessMessage("Currency updated successfully");
    } catch (err) {
      console.error("Failed to update currency:", err);
      alert("Failed to update currency");
    } finally {
      setSavingCurrency(false);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    setSavingProfile(true);
    try {
      const res = await updateProfile({ name: editName.trim() });
      setUser(res.user);
      if (onUserUpdate) onUserUpdate(res.user);
      setIsEditingName(false);
      showSuccessMessage("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setSavingProfile(true);
      try {
        const res = await updateProfile({ profilePic: base64 });
        setUser(res.user);
        if (onUserUpdate) onUserUpdate(res.user);
        showSuccessMessage("Profile picture updated successfully");
      } catch (err) {
        console.error("Failed to update profile picture:", err);
        alert("Failed to update profile picture");
      } finally {
        setSavingProfile(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const transactions = await getTransactions({ limit: 10000 });
      const data = transactions.transactions || transactions;

      if (!data || data.length === 0) {
        alert("No transactions to export");
        setExporting(false);
        return;
      }

      // Create CSV content with proper date formatting
      const headers = [
        "Date",
        "Type",
        "Amount",
        "Description",
        "Person",
        "Money Source",
        "Status",
      ];

      const rows = data.map((t) => {
        // Properly format the date
        let formattedDate = "";
        if (t.dueDate) {
          const date = new Date(t.dueDate);
          formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        } else if (t.createdAt) {
          const date = new Date(t.createdAt);
          formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }

        return [
          formattedDate,
          t.type || "",
          t.amount || 0,
          t.description || "",
          t.person || "",
          t.moneySourceName || t.moneySource?.name || "",
          t.status || "",
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `transactions_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      showSuccessMessage("Transactions exported successfully");
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export transactions");
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if logout fails on server, clear local state and redirect
      navigate("/login");
    }
  };

  const handleDeleteAllTransactions = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL transactions? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const result = await deleteAllTransactions();
      showSuccessMessage(`Successfully deleted ${result.count} transactions`);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete transactions");
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "?";
  };

  if (loading) {
    return (
      <>
        <PageHeader>
          <PageTitle>Settings</PageTitle>
          <PageSubtitle>Manage your account and preferences</PageSubtitle>
        </PageHeader>
        <SettingsContainer>
          <Section>Loading...</Section>
        </SettingsContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account and preferences</PageSubtitle>
      </PageHeader>

      {showSuccess && <SuccessMessage>✓ {showSuccess}</SuccessMessage>}

      <SettingsContainer>
        <Section>
          <SectionTitle>Profile</SectionTitle>
          <SectionSubtitle>Manage your personal information</SectionSubtitle>
          <ProfileHeader>
            <Avatar
              $hasImage={!!user?.profilePic}
              onClick={() => fileInputRef.current?.click()}
            >
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" />
              ) : (
                getInitials(user?.name, user?.email)
              )}
              <AvatarOverlay>📷</AvatarOverlay>
            </Avatar>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
            <ProfileInfo>
              {isEditingName ? (
                <EditForm>
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <ButtonGroup>
                    <PrimaryButton
                      onClick={handleSaveName}
                      disabled={savingProfile}
                    >
                      {savingProfile ? "Saving..." : "Save"}
                    </PrimaryButton>
                    <Button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditName(user?.name || user?.username || "");
                      }}
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </EditForm>
              ) : (
                <>
                  <ProfileName>
                    {user?.name || user?.username || "User"}
                    <EditButton onClick={() => setIsEditingName(true)}>
                      Edit
                    </EditButton>
                  </ProfileName>
                  <ProfileEmail>{user?.email || "No email"}</ProfileEmail>
                </>
              )}
            </ProfileInfo>
          </ProfileHeader>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Member Since</SettingLabel>
              <SettingDescription>
                Your account creation date
              </SettingDescription>
            </SettingInfo>
            <SettingDescription>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </SettingDescription>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Preferences</SectionTitle>
          <SectionSubtitle>Customize your app experience</SectionSubtitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Currency</SettingLabel>
              <SettingDescription>
                Choose your preferred currency for displaying amounts
              </SettingDescription>
            </SettingInfo>
            <Select
              value={user?.currency || "INR"}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              disabled={savingCurrency}
            >
              <option value="INR">₹ INR - Indian Rupee</option>
              <option value="USD">$ USD - US Dollar</option>
              <option value="EUR">€ EUR - Euro</option>
              <option value="GBP">£ GBP - British Pound</option>
            </Select>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Data Export</SectionTitle>
          <SectionSubtitle>Download your transaction data</SectionSubtitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Export Transactions</SettingLabel>
              <SettingDescription>
                Download all your transactions as a CSV file
              </SettingDescription>
            </SettingInfo>
            <PrimaryButton onClick={handleExportCSV} disabled={exporting}>
              {exporting ? "Exporting..." : "📥 Export CSV"}
            </PrimaryButton>
          </SettingRow>
          <InfoBox>
            <InfoText>
              📊 Your exported file will include date, type, amount,
              description, person, money source, and status for each
              transaction.
            </InfoText>
          </InfoBox>
        </Section>

        <Section>
          <SectionTitle>Account</SectionTitle>
          <SectionSubtitle>Manage your account details</SectionSubtitle>
          <AccountActions>
            <DangerOutlineButton onClick={handleLogout}>
              ↪ Logout
            </DangerOutlineButton>
            <DangerButton
              onClick={handleDeleteAllTransactions}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "🗑 Delete All Transactions"}
            </DangerButton>
          </AccountActions>
        </Section>
      </SettingsContainer>
    </>
  );
}
