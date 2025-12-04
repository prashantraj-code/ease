import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api";
import TransactionForm from "./TransactionForm";

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

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: "";
    width: 16px;
    height: 16px;
    border: 2.5px solid white;
    border-radius: 50%;
    display: block;
  }
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

const Badge = styled.span`
  margin-left: auto;
  background: #10b981;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  font-family: "Futura", sans-serif;
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

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    background: #f9fafb;
  }
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

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 38px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

const Select = styled.select`
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Futura", sans-serif;
  outline: none;

  &:hover {
    border-color: #10b981;
  }

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const Button = styled.button`
  padding: 13px 26px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 10px;
  font-size: 15px;
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
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #059669;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${(props) => props.bgColor || "white"};
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.color || "#6b7280"};
  margin-bottom: 12px;
  font-family: "Futura", sans-serif;
`;

const StatValue = styled.div`
  font-size: 44px;
  font-weight: 700;
  color: ${(props) => props.color || "#1f2937"};
  line-height: 1;
  margin-bottom: 8px;
  font-family: "Futura", sans-serif;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${(props) => props.color || "#6b7280"};
  font-family: "Futura", sans-serif;
`;

const TrendIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.bgColor || "rgba(16, 185, 129, 0.1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
`;

const CardTitle = styled.h3`
  font-size: 21px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
  font-family: "Futura", sans-serif;
`;

const PeopleList = styled.div`
  display: grid;
  gap: 16px;
`;

const PersonCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const PersonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PersonAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${(props) => props.color || "#10b981"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 17px;
  font-family: "Futura", sans-serif;
`;

const PersonDetails = styled.div``;

const PersonName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Futura", sans-serif;
`;

const PersonSubtext = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
`;

const AmountBadge = styled.div`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background: ${(props) => (props.positive ? "#d1fae5" : "#fee2e2")};
  color: ${(props) => (props.positive ? "#059669" : "#dc2626")};
  font-family: "Futura", sans-serif;
`;

export default function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, lent, borrowed
  const [filterStatus, setFilterStatus] = useState("all"); // all, paid, unpaid
  const [sortBy, setSortBy] = useState("createdAt"); // createdAt, amount, dueDate

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

  // Calculate stats
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(
    (t) => t.status === "paid"
  ).length;
  const pendingTransactions = transactions.filter(
    (t) => t.status === "unpaid"
  ).length;
  const totalLent = transactions
    .filter((t) => t.type === "lent")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBorrowed = transactions
    .filter((t) => t.type === "borrowed")
    .reduce((sum, t) => sum + t.amount, 0);

  // Filter and search transactions
  const filteredTransactions = transactions.filter((txn) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      txn.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.amount.toString().includes(searchQuery);

    // Type filter
    const matchesType = filterType === "all" || txn.type === filterType;

    // Status filter
    const matchesStatus = filterStatus === "all" || txn.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "amount") {
      return b.amount - a.amount;
    } else if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else {
      // default: createdAt
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <AppContainer>
      <Sidebar>
        <Logo>
          <LogoText>Ease</LogoText>
        </Logo>

        <MenuLabel>MENU</MenuLabel>
        <Nav>
          <NavItem
            active={activeView === "dashboard"}
            onClick={() => setActiveView("dashboard")}
          >
            <NavIcon>📊</NavIcon>
            Dashboard
          </NavItem>
          <NavItem
            active={activeView === "transactions"}
            onClick={() => setActiveView("transactions")}
          >
            <NavIcon>💰</NavIcon>
            All transactions
          </NavItem>
          <NavItem
            active={activeView === "people"}
            onClick={() => setActiveView("people")}
          >
            <NavIcon>👥</NavIcon>
            People
          </NavItem>
          <NavItem
            active={activeView === "sources"}
            onClick={() => setActiveView("sources")}
          >
            <NavIcon>🏦</NavIcon>
            Money sources
          </NavItem>
          <NavItem
            active={activeView === "notes"}
            onClick={() => setActiveView("notes")}
          >
            <NavIcon>📝</NavIcon>
            Notes
          </NavItem>
        </Nav>

        <MenuLabel>GENERAL</MenuLabel>
        <Nav>
          <NavItem
            active={activeView === "settings"}
            onClick={() => setActiveView("settings")}
          >
            <NavIcon>⚙️</NavIcon>
            Settings
          </NavItem>
          <NavItem
            active={activeView === "help"}
            onClick={() => setActiveView("help")}
          >
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

        <PageHeader>
          <PageTitle>Loan & Debt Tracker</PageTitle>
          <PageSubtitle>
            Manage your loans and debts efficiently in one place.
          </PageSubtitle>
        </PageHeader>

        <ActionButtons>
          <PrimaryButton onClick={() => setShowForm(true)}>
            <span style={{ fontSize: "20px" }}>+</span>
            Add Transaction
          </PrimaryButton>
          <Button>Export Data</Button>
        </ActionButtons>

        <FilterSection>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="lent">Lent Only</option>
            <option value="borrowed">Borrowed Only</option>
          </Select>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="dueDate">Sort by Due Date</option>
          </Select>
        </FilterSection>

        <CardsGrid>
          <StatCard bgColor="#10b981">
            <StatHeader>
              <div>
                <StatLabel color="rgba(255,255,255,0.9)">Total Lent</StatLabel>
                <StatValue color="white">₹{totalLent.toFixed(2)}</StatValue>
                <StatChange color="rgba(255,255,255,0.8)">
                  <span>💸</span> Money you gave
                </StatChange>
              </div>
              <TrendIcon bgColor="rgba(255,255,255,0.2)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3L12 7L8 11"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 7H12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </TrendIcon>
            </StatHeader>
          </StatCard>

          <StatCard>
            <StatHeader>
              <div>
                <StatLabel>Total Borrowed</StatLabel>
                <StatValue>₹{totalBorrowed.toFixed(2)}</StatValue>
                <StatChange>
                  <span style={{ color: "#dc2626" }}>💳</span> Money you took
                </StatChange>
              </div>
              <TrendIcon bgColor="rgba(220, 38, 38, 0.1)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 13L12 9L8 5"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 9H12"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </TrendIcon>
            </StatHeader>
          </StatCard>

          <StatCard>
            <StatHeader>
              <div>
                <StatLabel>Net Balance</StatLabel>
                <StatValue
                  style={{
                    color:
                      totalLent - totalBorrowed >= 0 ? "#10b981" : "#dc2626",
                  }}
                >
                  ₹{(totalLent - totalBorrowed).toFixed(2)}
                </StatValue>
                <StatChange>
                  <span
                    style={{
                      color:
                        totalLent - totalBorrowed >= 0 ? "#10b981" : "#dc2626",
                    }}
                  >
                    {totalLent - totalBorrowed >= 0 ? "✓" : "⚠"}
                  </span>{" "}
                  {totalLent - totalBorrowed >= 0 ? "You are owed" : "You owe"}
                </StatChange>
              </div>
              <TrendIcon
                bgColor={`rgba(${
                  totalLent - totalBorrowed >= 0
                    ? "16, 185, 129"
                    : "220, 38, 38"
                }, 0.1)`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3L12 7L8 11"
                    stroke={
                      totalLent - totalBorrowed >= 0 ? "#10b981" : "#dc2626"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 7H12"
                    stroke={
                      totalLent - totalBorrowed >= 0 ? "#10b981" : "#dc2626"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </TrendIcon>
            </StatHeader>
          </StatCard>

          <StatCard>
            <StatHeader>
              <div>
                <StatLabel>Unpaid Transactions</StatLabel>
                <StatValue>{pendingTransactions}</StatValue>
                <StatChange color="#6b7280">
                  <span>⏰</span> Pending payments
                </StatChange>
              </div>
              <TrendIcon bgColor="rgba(107, 114, 128, 0.1)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3L12 7L8 11"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 7H12"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </TrendIcon>
            </StatHeader>
          </StatCard>
        </CardsGrid>

        <ContentGrid>
          <Card>
            <CardTitle>Recent Transactions</CardTitle>
            <PeopleList>
              {sortedTransactions.slice(0, 5).map((txn) => {
                const isLent = txn.type === "lent";
                const isPaid = txn.status === "paid";

                return (
                  <PersonCard key={txn.id}>
                    <PersonInfo>
                      <PersonAvatar color={isLent ? "#10b981" : "#ef4444"}>
                        {isLent ? "📤" : "📥"}
                      </PersonAvatar>
                      <PersonDetails>
                        <PersonName>{txn.person}</PersonName>
                        <PersonSubtext>
                          {isLent ? "Lent" : "Borrowed"} •{" "}
                          {isPaid ? "✓ Paid" : "⏰ Unpaid"}
                          {txn.dueDate &&
                            ` • Due: ${new Date(
                              txn.dueDate
                            ).toLocaleDateString()}`}
                        </PersonSubtext>
                      </PersonDetails>
                    </PersonInfo>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <AmountBadge positive={isLent}>
                        ₹{txn.amount.toLocaleString("en-IN")}
                      </AmountBadge>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <IconButton
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "14px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTransaction(txn);
                            setShowForm(true);
                          }}
                        >
                          ✏️
                        </IconButton>
                        <IconButton
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "14px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransaction(txn.id);
                          }}
                        >
                          🗑️
                        </IconButton>
                      </div>
                    </div>
                  </PersonCard>
                );
              })}
            </PeopleList>
          </Card>

          <Card>
            <CardTitle>Quick Actions</CardTitle>
            <PeopleList>
              <PersonCard
                onClick={() => {
                  setEditingTransaction({ type: "lent" });
                  setShowForm(true);
                }}
              >
                <PersonInfo>
                  <PersonAvatar color="#10b981">📤</PersonAvatar>
                  <PersonDetails>
                    <PersonName>Add Lent Money</PersonName>
                    <PersonSubtext>Money you gave</PersonSubtext>
                  </PersonDetails>
                </PersonInfo>
              </PersonCard>
              <PersonCard
                onClick={() => {
                  setEditingTransaction({ type: "borrowed" });
                  setShowForm(true);
                }}
              >
                <PersonInfo>
                  <PersonAvatar color="#ef4444">📥</PersonAvatar>
                  <PersonDetails>
                    <PersonName>Add Borrowed Money</PersonName>
                    <PersonSubtext>Money you took</PersonSubtext>
                  </PersonDetails>
                </PersonInfo>
              </PersonCard>
              <PersonCard onClick={() => setActiveView("reports")}>
                <PersonInfo>
                  <PersonAvatar color="#3b82f6">📊</PersonAvatar>
                  <PersonDetails>
                    <PersonName>View Reports</PersonName>
                    <PersonSubtext>Analytics & insights</PersonSubtext>
                  </PersonDetails>
                </PersonInfo>
              </PersonCard>
            </PeopleList>
          </Card>
        </ContentGrid>
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
