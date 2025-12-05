import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
`;

const Sidebar = styled.div`
  width: 240px;
  background: white;
  padding: 24px 16px;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: ${(props) =>
      props.$isOpen ? "translateX(0)" : "translateX(-100%)"};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px 24px 8px;
`;

const LogoText = styled.div`
  font-size: 44px;
  font-weight: 800;
  color: #10b981;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MenuLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  padding: 16px 12px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Futura", sans-serif;
`;

const NavSection = styled.nav``;

const NavSectionGeneral = styled.nav`
  margin-top: 16px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  margin: 2px 0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: ${(props) => (props.active ? "700" : "600")};
  color: ${(props) => (props.active ? "white" : "#6b7280")};
  background: ${(props) => (props.active ? "#10b981" : "transparent")};
  transition: all 0.2s;
  position: relative;
  font-family: "Futura", sans-serif;

  &:hover {
    background: ${(props) => (props.active ? "#10b981" : "#f3f4f6")};
  }

  ${(props) =>
    props.active &&
    `
    box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);
  `}
`;

const NavIcon = styled.span`
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const MainContent = styled.div`
  margin-left: 240px;
  flex: 1;
  padding: 32px 40px;
  max-width: calc(100vw - 240px);
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
    max-width: 100vw;
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 20px;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${(props) => (props.$hasImage ? "transparent" : "#10b981")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  font-family: "Futura", sans-serif;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

const UserDetails = styled.div`
  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Futura", sans-serif;
`;

const UserEmail = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
`;

export default function DashboardLayout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    onLogout();
  };

  if (!user) return null;

  return (
    <AppContainer>
      <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar $isOpen={sidebarOpen}>
        <CloseButton onClick={() => setSidebarOpen(false)}>✕</CloseButton>
        <Logo>
          <LogoText>Ease</LogoText>
        </Logo>

        <MenuLabel>MENU</MenuLabel>
        <NavSection>
          <NavItem
            active={isActive("/dashboard")}
            onClick={() => handleNavClick("/dashboard")}
          >
            <NavIcon>📊</NavIcon>
            Dashboard
          </NavItem>
          <NavItem
            active={isActive("/transactions")}
            onClick={() => handleNavClick("/transactions")}
          >
            <NavIcon>💰</NavIcon>
            All transactions
          </NavItem>
          <NavItem
            active={isActive("/people")}
            onClick={() => handleNavClick("/people")}
          >
            <NavIcon>👥</NavIcon>
            People
          </NavItem>
          <NavItem
            active={isActive("/sources")}
            onClick={() => handleNavClick("/sources")}
          >
            <NavIcon>🏦</NavIcon>
            Money sources
          </NavItem>
          <NavItem
            active={isActive("/notes")}
            onClick={() => handleNavClick("/notes")}
          >
            <NavIcon>📝</NavIcon>
            Notes
          </NavItem>
        </NavSection>

        <NavSectionGeneral>
          <MenuLabel>GENERAL</MenuLabel>
          <NavItem
            active={isActive("/settings")}
            onClick={() => handleNavClick("/settings")}
          >
            <NavIcon>⚙️</NavIcon>
            Settings
          </NavItem>
          <NavItem
            active={isActive("/help")}
            onClick={() => handleNavClick("/help")}
          >
            <NavIcon>❓</NavIcon>
            Help
          </NavItem>
          <NavItem onClick={handleLogout}>
            <NavIcon>→</NavIcon>
            Log out
          </NavItem>
        </NavSectionGeneral>
      </Sidebar>

      <MainContent>
        <TopBar>
          <HamburgerButton onClick={() => setSidebarOpen(true)}>
            ☰
          </HamburgerButton>
          <UserSection>
            <UserInfo>
              <Avatar $hasImage={!!user?.profilePic}>
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" />
                ) : (
                  (user?.name || user?.username || "U").charAt(0).toUpperCase()
                )}
              </Avatar>
              <UserDetails>
                <UserName>{user?.name || user?.username || "User"}</UserName>
                <UserEmail>{user?.email || ""}</UserEmail>
              </UserDetails>
            </UserInfo>
          </UserSection>
        </TopBar>

        {children}
      </MainContent>
    </AppContainer>
  );
}
