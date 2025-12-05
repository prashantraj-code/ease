import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import AuthForm from "./components/AuthForm";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import AllTransactionsPage from "./pages/AllTransactionsPage";
import PeoplePage from "./pages/PeoplePage";
import MoneySourcesPage from "./pages/MoneySourcesPage";
import NotesPage from "./pages/NotesPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import { signup, login, getUser, logout } from "./api";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Futura', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 40px;
  gap: 60px;
  overflow: hidden;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 40px;
  animation: fadeInLeft 0.6s ease-out;

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const HeroTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
  font-family: "Futura", sans-serif;

  span {
    color: #10b981;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
  font-family: "Futura", sans-serif;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.bgColor || "#10b981"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  font-family: "Futura", sans-serif;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-family: "Futura", sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  width: 100%;
  justify-self: center;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 968px) {
    max-width: 440px;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: #10b981;
  margin: 0 0 8px 0;
  font-family: "Futura", sans-serif;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 15px;
  margin: 0;
  font-weight: 500;
  font-family: "Futura", sans-serif;
`;

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is already logged in on page load
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    async function fetchUser() {
      try {
        const res = await getUser();
        if (isMounted) {
          if (res.data && res.data.user) {
            setUser(res.data.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    // Add a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn("User fetch timed out");
        setLoading(false);
        setUser(null);
      }
    }, 10000); // 10 second timeout

    fetchUser();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSignup = async (data) => {
    try {
      setError("");
      const res = await signup(data);
      setUser(res.data.user);
    } catch (err) {
      if (err.response?.status === 409) {
        try {
          const loginRes = await login({
            identifier: data.email,
            password: data.password,
          });
          setUser(loginRes.data.user);
        } catch {
          setError("User already exists but login failed.");
        }
      } else {
        setError(err.response?.data?.message || "Signup failed. Try again.");
      }
    }
  };

  const handleLogin = async (data) => {
    try {
      setError("");
      const res = await login(data);
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch {
      // Even if logout fails on server, clear local state
      setUser(null);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <Card>
            <Logo>
              <Title>Ease</Title>
              <Subtitle>Loading...</Subtitle>
            </Logo>
          </Card>
        </Container>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <LeftSection>
            <div>
              <HeroTitle>
                Track Your Loans & Debts
                <br />
                with <span>Ease</span>
              </HeroTitle>
              <HeroSubtitle style={{ marginTop: "16px" }}>
                Never forget who owes you money or whom you owe.
                <br />
                Manage all your financial transactions in one secure place.
              </HeroSubtitle>
            </div>

            <FeatureList>
              <FeatureItem>
                <FeatureIcon bgColor="#10b981">💰</FeatureIcon>
                <FeatureText>
                  <FeatureTitle>Track Money Lent & Borrowed</FeatureTitle>
                  <FeatureDescription>
                    Keep detailed records of every transaction with friends and
                    family
                  </FeatureDescription>
                </FeatureText>
              </FeatureItem>

              <FeatureItem>
                <FeatureIcon bgColor="#3b82f6">⏰</FeatureIcon>
                <FeatureText>
                  <FeatureTitle>Set Due Dates & Reminders</FeatureTitle>
                  <FeatureDescription>
                    Never miss a payment deadline with smart notifications
                  </FeatureDescription>
                </FeatureText>
              </FeatureItem>

              <FeatureItem>
                <FeatureIcon bgColor="#8b5cf6">📊</FeatureIcon>
                <FeatureText>
                  <FeatureTitle>View Reports & Analytics</FeatureTitle>
                  <FeatureDescription>
                    Get insights on your lending and borrowing patterns
                  </FeatureDescription>
                </FeatureText>
              </FeatureItem>

              <FeatureItem>
                <FeatureIcon bgColor="#f59e0b">🔒</FeatureIcon>
                <FeatureText>
                  <FeatureTitle>Secure & Private</FeatureTitle>
                  <FeatureDescription>
                    Your financial data is encrypted and protected
                  </FeatureDescription>
                </FeatureText>
              </FeatureItem>
            </FeatureList>
          </LeftSection>

          <Card>
            <Logo>
              <Title>Ease</Title>
              <Subtitle>Manage Your Money</Subtitle>
            </Logo>
            <AuthForm
              onSignup={handleSignup}
              onLogin={handleLogin}
              error={error}
            />
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout user={user} onLogout={handleLogout}>
                <DashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/transactions"
            element={
              <DashboardLayout user={user} onLogout={handleLogout}>
                <AllTransactionsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/people"
            element={
              <DashboardLayout user={user} onLogout={handleLogout}>
                <PeoplePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/sources"
            element={
              <DashboardLayout user={user} onLogout={handleLogout}>
                <MoneySourcesPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/notes"
            element={
              <DashboardLayout user={user} onLogout={handleLogout}>
                <NotesPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout user={user} onLogout={handleLogout}>
                <SettingsPage onUserUpdate={handleUserUpdate} />
              </DashboardLayout>
            }
          />
          <Route
            path="/help"
            element={
              <DashboardLayout user={user} onLogout={handleLogout}>
                <HelpPage />
              </DashboardLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
