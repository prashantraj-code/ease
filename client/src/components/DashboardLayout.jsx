import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
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

const Nav = styled.nav`
  flex: 1;
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
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const SearchBar = styled.div`
  position: relative;
  width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 11px 16px 11px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  background: white;
  font-family: "Futura", sans-serif;

  &:focus {
    border-color: #10b981;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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
  background: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  font-family: "Futura", sans-serif;
`;

const UserDetails = styled.div``;

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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path) => location.pathname === path;

  return (
    <AppContainer>
      <Sidebar>
        <Logo>
          <LogoText>Ease</LogoText>
        </Logo>

        <MenuLabel>MENU</MenuLabel>
        <Nav>
          <NavItem
            active={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          >
            <NavIcon>📊</NavIcon>
            Dashboard
          </NavItem>
          <NavItem
            active={isActive("/transactions")}
            onClick={() => navigate("/transactions")}
          >
            <NavIcon>💰</NavIcon>
            All transactions
          </NavItem>
          <NavItem
            active={isActive("/people")}
            onClick={() => navigate("/people")}
          >
            <NavIcon>👥</NavIcon>
            People
          </NavItem>
          <NavItem
            active={isActive("/sources")}
            onClick={() => navigate("/sources")}
          >
            <NavIcon>🏦</NavIcon>
            Money sources
          </NavItem>
          <NavItem
            active={isActive("/notes")}
            onClick={() => navigate("/notes")}
          >
            <NavIcon>📝</NavIcon>
            Notes
          </NavItem>
        </Nav>

        <MenuLabel>GENERAL</MenuLabel>
        <Nav>
          <NavItem
            active={isActive("/settings")}
            onClick={() => navigate("/settings")}
          >
            <NavIcon>⚙️</NavIcon>
            Settings
          </NavItem>
          <NavItem active={isActive("/help")} onClick={() => navigate("/help")}>
            <NavIcon>❓</NavIcon>
            Help
          </NavItem>
          <NavItem onClick={onLogout}>
            <NavIcon>→</NavIcon>
            Log out
          </NavItem>
        </Nav>
      </Sidebar>

      <MainContent>
        <TopBar>
          <SearchBar>
            <SearchIcon>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M13 13L17 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </SearchIcon>
            <SearchInput
              placeholder="Search by person or amount"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <UserSection>
            <UserInfo>
              <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
              <UserDetails>
                <UserName>{user.username}</UserName>
                <UserEmail>
                  {user.email || `${user.username}@email.com`}
                </UserEmail>
              </UserDetails>
            </UserInfo>
          </UserSection>
        </TopBar>

        {children}
      </MainContent>
    </AppContainer>
  );
}
