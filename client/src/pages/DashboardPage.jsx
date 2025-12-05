import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api";
import TransactionForm from "../components/TransactionForm";

const PageHeader = styled.div`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const PageTitle = styled.h1`
  font-size: 38px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 8px;
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

  @media (max-width: 480px) {
    padding: 10px 18px;
    font-size: 14px;
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
`;

const StatCard = styled.div`
  background: ${(props) => props.bgColor || "white"};
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
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

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const StatValue = styled.div`
  font-size: 44px;
  font-weight: 700;
  color: ${(props) => props.color || "#1f2937"};
  line-height: 1;
  margin-bottom: 8px;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
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
  grid-template-columns: 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const CardTitle = styled.h3`
  font-size: 21px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 18px;
    margin: 0 0 16px 0;
  }
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

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const PersonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
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
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

const PersonDetails = styled.div`
  min-width: 0;
`;

const PersonName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Futura", sans-serif;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const PersonSubtext = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Futura", sans-serif;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const AmountBadge = styled.div`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background: ${(props) => (props.positive ? "#d1fae5" : "#fee2e2")};
  color: ${(props) => (props.positive ? "#059669" : "#dc2626")};
  font-family: "Futura", sans-serif;
  flex-shrink: 0;

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 13px;
  }
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  font-size: 14px;

  &:hover {
    background: #f9fafb;
  }
`;

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getTransactions({ limit: 1000 });
      setTransactions(res.transactions || []);
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

  const totalLent = transactions
    .filter((t) => t.type === "lent")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBorrowed = transactions
    .filter((t) => t.type === "borrowed")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingTransactions = transactions.filter(
    (t) => t.status === "unpaid"
  ).length;

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
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
                  color: totalLent - totalBorrowed >= 0 ? "#10b981" : "#dc2626",
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
                totalLent - totalBorrowed >= 0 ? "16, 185, 129" : "220, 38, 38"
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
            {transactions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#9ca3af",
                  fontFamily: "Futura",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  No transactions yet
                </div>
                <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                  Start by adding your first transaction
                </div>
              </div>
            ) : (
              sortedTransactions.map((txn) => {
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTransaction(txn);
                            setShowForm(true);
                          }}
                        >
                          ✏️
                        </IconButton>
                        <IconButton
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
              })
            )}
          </PeopleList>
        </Card>
      </ContentGrid>

      {showForm && (
        <TransactionForm
          onSubmit={
            editingTransaction?.id
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
    </>
  );
}
