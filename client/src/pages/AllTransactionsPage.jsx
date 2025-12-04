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

const ControlBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const LeftControls = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 11px 16px 11px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  background: white;
  font-family: "Futura", sans-serif;
  width: 300px;
  position: relative;

  &:focus {
    border-color: #10b981;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchWrapper = styled.div`
  position: relative;

  &:before {
    content: "🔍";
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
  }
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
  padding: 11px 20px;
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

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const StatLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  font-family: "Futura", sans-serif;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.color || "#1f2937"};
  font-family: "Futura", sans-serif;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f9fafb;
`;

const Th = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Futura", sans-serif;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  font-size: 15px;
  color: #374151;
  font-family: "Futura", sans-serif;
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Futura", sans-serif;
  background: ${(props) =>
    props.type === "lent"
      ? "#d1fae5"
      : props.type === "borrowed"
      ? "#fee2e2"
      : "#e5e7eb"};
  color: ${(props) =>
    props.type === "lent"
      ? "#059669"
      : props.type === "borrowed"
      ? "#dc2626"
      : "#6b7280"};
`;

const StatusBadge = styled(Badge)`
  background: ${(props) => (props.status === "paid" ? "#d1fae5" : "#fef3c7")};
  color: ${(props) => (props.status === "paid" ? "#059669" : "#d97706")};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-family: "Futura", sans-serif;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  color: #9ca3af;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  font-family: "Futura", sans-serif;
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions({ limit: 1000 });
      setTransactions(res.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (data) => {
    try {
      await createTransaction(data);
      fetchTransactions();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction");
    }
  };

  const handleEditTransaction = async (id, data) => {
    try {
      await updateTransaction(id, data);
      fetchTransactions();
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
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction");
      }
    }
  };

  // Filter and search
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      searchQuery === "" ||
      txn.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.amount.toString().includes(searchQuery) ||
      (txn.description &&
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "all" || txn.type === filterType;
    const matchesStatus = filterStatus === "all" || txn.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "amount") {
      return b.amount - a.amount;
    } else if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === "person") {
      return a.person.localeCompare(b.person);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalTransactions = transactions.length;
  const totalLent = transactions
    .filter((t) => t.type === "lent")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBorrowed = transactions
    .filter((t) => t.type === "borrowed")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions
    .filter((t) => t.status === "unpaid")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <PageHeader>
        <PageTitle>All Transactions</PageTitle>
        <PageSubtitle>
          Complete list of all your lending and borrowing transactions
        </PageSubtitle>
      </PageHeader>

      <StatsBar>
        <StatCard>
          <StatLabel>Total Transactions</StatLabel>
          <StatValue>{totalTransactions}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Lent</StatLabel>
          <StatValue color="#10b981">₹{totalLent.toFixed(2)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Borrowed</StatLabel>
          <StatValue color="#dc2626">₹{totalBorrowed.toFixed(2)}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Pending Amount</StatLabel>
          <StatValue color="#d97706">₹{pendingAmount.toFixed(2)}</StatValue>
        </StatCard>
      </StatsBar>

      <ControlBar>
        <LeftControls>
          <SearchWrapper>
            <SearchInput
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
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
            <option value="person">Sort by Person</option>
            <option value="dueDate">Sort by Due Date</option>
          </Select>
        </LeftControls>
        <PrimaryButton onClick={() => setShowForm(true)}>
          <span style={{ fontSize: "18px" }}>+</span>
          Add Transaction
        </PrimaryButton>
      </ControlBar>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Person</Th>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Due Date</Th>
              <Th>Date Added</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedTransactions.length === 0 ? (
              <Tr>
                <Td colSpan="7">
                  <EmptyState>
                    <EmptyIcon>📭</EmptyIcon>
                    <EmptyText>No transactions found</EmptyText>
                    <EmptySubtext>
                      {searchQuery ||
                      filterType !== "all" ||
                      filterStatus !== "all"
                        ? "Try adjusting your filters"
                        : "Start by adding your first transaction"}
                    </EmptySubtext>
                  </EmptyState>
                </Td>
              </Tr>
            ) : (
              paginatedTransactions.map((txn) => (
                <Tr key={txn.id}>
                  <Td style={{ fontWeight: 600 }}>{txn.person}</Td>
                  <Td>
                    <Badge type={txn.type}>
                      {txn.type === "lent" ? "📤 Lent" : "📥 Borrowed"}
                    </Badge>
                  </Td>
                  <Td style={{ fontWeight: 600 }}>
                    ₹{txn.amount.toLocaleString("en-IN")}
                  </Td>
                  <Td>
                    <StatusBadge status={txn.status}>
                      {txn.status === "paid" ? "✓ Paid" : "⏰ Unpaid"}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {txn.dueDate
                      ? new Date(txn.dueDate).toLocaleDateString()
                      : "-"}
                  </Td>
                  <Td>{new Date(txn.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <ActionButtons>
                      <IconButton
                        onClick={() => {
                          setEditingTransaction(txn);
                          setShowForm(true);
                        }}
                        title="Edit"
                      >
                        ✏️
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteTransaction(txn.id)}
                        title="Delete"
                      >
                        🗑️
                      </IconButton>
                    </ActionButtons>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
        {paginatedTransactions.length > 0 && (
          <Pagination>
            <PaginationInfo>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedTransactions.length)}{" "}
              of {sortedTransactions.length} transactions
            </PaginationInfo>
            <PaginationButtons>
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </PaginationButtons>
          </Pagination>
        )}
      </TableContainer>

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
