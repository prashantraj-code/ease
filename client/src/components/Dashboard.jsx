import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api";
import PeopleView from "./PeopleView";
import TransactionForm from "./TransactionForm";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
`;

const Sidebar = styled.div`
  width: 280px;
  background: #fafafa;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
`;

const Logo = styled.div`
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid white;
    border-radius: 50%;
    top: 6px;
    left: 6px;
  }

  &:after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid white;
    border-radius: 50%;
    bottom: 6px;
    right: 6px;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 24px 16px;
`;

const NavSection = styled.div`
  margin-bottom: 8px;
`;

const NavItem = styled.div`
  padding: 11px 16px;
  margin: 2px 0;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  background: ${(props) => (props.active ? "white" : "transparent")};
  color: ${(props) => (props.active ? "#1f2937" : "#6b7280")};
  transition: all 0.15s;
  position: relative;

  &:hover {
    background: ${(props) => (props.active ? "white" : "#f9fafb")};
    color: ${(props) => (props.active ? "#1f2937" : "#374151")};
  }

  ${(props) =>
    props.active &&
    `
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  `}
`;

const NavIcon = styled.span`
  font-size: 16px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.active ? "#1f2937" : "#9ca3af")};
`;

const SubNavItem = styled(NavItem)`
  padding-left: 52px;
  font-size: 13px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
`;

const Badge = styled.span`
  margin-left: auto;
  background: #fed7aa;
  color: #92400e;
  padding: 3px 9px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
`;

const GreenBadge = styled(Badge)`
  background: #86efac;
  color: #14532d;
`;

const LogoutButton = styled.div`
  padding: 12px 24px;
  margin: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6b7280;
  transition: color 0.2s;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;

  &:hover {
    color: #111827;
  }
`;

const MainContent = styled.div`
  margin-left: 280px;
  flex: 1;
  padding: 40px 48px;
  max-width: calc(100vw - 280px);
  background: #fafafa;
`;

export default function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState("people");
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const fetchData = async () => {
    try {
      const [transactionsRes, summaryRes] = await Promise.all([
        getTransactions({ limit: 1000 }),
        getSummary(),
      ]);

      setTransactions(transactionsRes.transactions || []);
      setSummary(summaryRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async (data) => {
    try {
      await createTransaction(data);
      fetchData();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction");
    }
  };

  const handleEditTransaction = async (id, data) => {
    try {
      await updateTransaction(id, data);
      fetchData();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction");
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const [showProductMenu, setShowProductMenu] = useState(true);

  return (
    <AppContainer>
      <Sidebar>
        <Logo>
          <LogoIcon></LogoIcon>
        </Logo>
        <Nav>
          <NavSection>
            <NavItem
              active={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            >
              <NavIcon active={activeView === "dashboard"}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="11"
                    y="3"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="3"
                    y="11"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="11"
                    y="11"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </NavIcon>
              Dashboard
            </NavItem>

            <NavItem
              active={activeView === "people" || showProductMenu}
              onClick={() => {
                setShowProductMenu(!showProductMenu);
                setActiveView("people");
              }}
            >
              <NavIcon active={activeView === "people" || showProductMenu}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 3C10 3 8 3 8 5C8 7 10 7 10 7C10 7 12 7 12 5C12 3 10 3 10 3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M16 6C16 6 15 6 15 7C15 8 16 8 16 8C16 8 17 8 17 7C17 6 16 6 16 6Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 6C4 6 3 6 3 7C3 8 4 8 4 8C4 8 5 8 5 7C5 6 4 6 4 6Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 10C5 10 6 9 10 9C14 9 15 10 15 10V13C15 14 14 15 10 15C6 15 5 14 5 13V10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 11C3 11 3.5 10.5 4 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 11C17 11 16.5 10.5 16 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </NavIcon>
              People
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "11px",
                  color: "#9ca3af",
                }}
              >
                {showProductMenu ? "⌄" : "›"}
              </span>
            </NavItem>

            {showProductMenu && (
              <>
                <SubNavItem
                  active={activeView === "people"}
                  onClick={() => setActiveView("people")}
                >
                  Overview
                </SubNavItem>
                <SubNavItem
                  active={activeView === "lent"}
                  onClick={() => setActiveView("lent")}
                >
                  Money Lent
                  <GreenBadge>
                    {
                      transactions.filter(
                        (t) => t.type === "lent" && t.status === "unpaid"
                      ).length
                    }
                  </GreenBadge>
                </SubNavItem>
                <SubNavItem
                  active={activeView === "borrowed"}
                  onClick={() => setActiveView("borrowed")}
                >
                  Money Borrowed
                  <Badge>
                    {
                      transactions.filter(
                        (t) => t.type === "borrowed" && t.status === "unpaid"
                      ).length
                    }
                  </Badge>
                </SubNavItem>
                <SubNavItem
                  active={activeView === "settled"}
                  onClick={() => setActiveView("settled")}
                >
                  Settled
                </SubNavItem>
                <SubNavItem
                  active={activeView === "overdue"}
                  onClick={() => setActiveView("overdue")}
                >
                  Overdue
                </SubNavItem>
              </>
            )}

            <NavItem
              active={activeView === "transactions"}
              onClick={() => setActiveView("transactions")}
            >
              <NavIcon active={activeView === "transactions"}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 6H17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 10H17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 14H17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="15" cy="6" r="1" fill="currentColor" />
                  <circle cx="15" cy="10" r="1" fill="currentColor" />
                  <circle cx="15" cy="14" r="1" fill="currentColor" />
                </svg>
              </NavIcon>
              All Transactions
            </NavItem>

            <NavItem
              active={activeView === "analytics"}
              onClick={() => setActiveView("analytics")}
            >
              <NavIcon active={activeView === "analytics"}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 14L8 10L11 13L16 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 8H16V11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </NavIcon>
              Analytics
            </NavItem>

            <NavItem
              active={activeView === "reminders"}
              onClick={() => setActiveView("reminders")}
            >
              <NavIcon active={activeView === "reminders"}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle
                    cx="10"
                    cy="6"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 10V6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 6H12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 14C6 14 7 13 10 13C13 13 14 14 14 14V16H6V14Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </NavIcon>
              Reminders
            </NavItem>

            <NavItem
              active={activeView === "settings"}
              onClick={() => setActiveView("settings")}
            >
              <NavIcon active={activeView === "settings"}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle
                    cx="10"
                    cy="10"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 3V5M10 15V17M17 10H15M5 10H3M15.5 4.5L14 6M6 14L4.5 15.5M15.5 15.5L14 14M6 6L4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </NavIcon>
              Settings
            </NavItem>
          </NavSection>
        </Nav>
        <LogoutButton onClick={onLogout}>
          <NavIcon>→</NavIcon>
          Logout
        </LogoutButton>
      </Sidebar>

      <MainContent>
        {activeView === "people" && (
          <PeopleView
            transactions={transactions}
            onAddTransaction={() => setShowForm(true)}
            onEdit={handleEdit}
            onDelete={handleDeleteTransaction}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
          />
        )}
        {activeView !== "people" && (
          <div style={{ color: "#6b7280", fontSize: "18px" }}>
            {activeView.charAt(0).toUpperCase() + activeView.slice(1)} view
            coming soon...
          </div>
        )}
      </MainContent>

      {showForm && (
        <TransactionForm
          onSubmit={
            editingTransaction
              ? (data) => handleEditTransaction(editingTransaction.id, data)
              : handleAddTransaction
          }
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          initialData={editingTransaction}
        />
      )}
    </AppContainer>
  );
}
