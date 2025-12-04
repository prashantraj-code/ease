import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getPeople,
  getMoneySources,
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
  justify-content: flex-end;
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

// Filter Section
const FilterSection = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  overflow: hidden;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Futura", sans-serif;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const FilterIcon = styled.span`
  font-size: 16px;
`;

const FilterContent = styled.div`
  padding: 20px;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Futura", sans-serif;
`;

const FilterInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: #f9fafb;
  font-family: "Futura", sans-serif;
  width: 100%;

  &:focus {
    border-color: #1f2937;
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  font-family: "Futura", sans-serif;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #1f2937;
    background: white;
  }
`;

const ClearFiltersButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Futura", sans-serif;
  white-space: nowrap;

  &:hover {
    background: #f9fafb;
  }
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
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
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

const SortIndicator = styled.span`
  margin-left: 4px;
  font-size: 10px;
`;

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [people, setPeople] = useState([]);
  const [moneySources, setMoneySources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPerson, setFilterPerson] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Sort state
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const [txnRes, peopleRes, sourcesRes] = await Promise.all([
        getTransactions({ limit: 1000 }),
        getPeople(),
        getMoneySources(),
      ]);
      setTransactions(txnRes.transactions || []);
      setPeople(peopleRes.people || []);
      setMoneySources(sourcesRes.moneySources || []);
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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPerson("all");
    setFilterSource("all");
    setFilterType("all");
    setFromDate("");
    setToDate("");
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    // Search in description
    const matchesSearch =
      searchQuery === "" ||
      (txn.description &&
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Person filter
    const matchesPerson = filterPerson === "all" || txn.person === filterPerson;

    // Source filter
    const matchesSource =
      filterSource === "all" || txn.moneySourceId === filterSource;

    // Type filter
    const matchesType = filterType === "all" || txn.type === filterType;

    // Date range filter
    const txnDate = new Date(txn.dueDate || txn.createdAt);
    const matchesFromDate = !fromDate || txnDate >= new Date(fromDate);
    const matchesToDate = !toDate || txnDate <= new Date(toDate + "T23:59:59");

    return (
      matchesSearch &&
      matchesPerson &&
      matchesSource &&
      matchesType &&
      matchesFromDate &&
      matchesToDate
    );
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case "person":
        aVal = a.person.toLowerCase();
        bVal = b.person.toLowerCase();
        break;
      case "amount":
        aVal = a.amount;
        bVal = b.amount;
        break;
      case "type":
        aVal = a.type;
        bVal = b.type;
        break;
      case "source":
        const aSource = moneySources.find((s) => s.id === a.moneySourceId);
        const bSource = moneySources.find((s) => s.id === b.moneySourceId);
        aVal = aSource?.name?.toLowerCase() || "zzz";
        bVal = bSource?.name?.toLowerCase() || "zzz";
        break;
      case "description":
        aVal = (a.description || "").toLowerCase();
        bVal = (b.description || "").toLowerCase();
        break;
      case "date":
      default:
        aVal = new Date(a.dueDate || a.createdAt);
        bVal = new Date(b.dueDate || b.createdAt);
        break;
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
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

  const getSourceName = (sourceId) => {
    const source = moneySources.find((s) => s.id === sourceId);
    return source?.name || "-";
  };

  const getSortIndicator = (column) => {
    if (sortBy !== column) return null;
    return <SortIndicator>{sortOrder === "asc" ? "▲" : "▼"}</SortIndicator>;
  };

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
          <StatLabel>Total Given</StatLabel>
          <StatValue color="#10b981">
            ₹{totalLent.toLocaleString("en-IN")}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Taken</StatLabel>
          <StatValue color="#dc2626">
            ₹{totalBorrowed.toLocaleString("en-IN")}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Pending Amount</StatLabel>
          <StatValue color="#d97706">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </StatValue>
        </StatCard>
      </StatsBar>

      <ControlBar>
        <PrimaryButton onClick={() => setShowForm(true)}>
          <span style={{ fontSize: "18px" }}>+</span>
          Add Transaction
        </PrimaryButton>
      </ControlBar>

      {/* Filters Section */}
      <FilterSection>
        <FilterHeader onClick={() => setFiltersOpen(!filtersOpen)}>
          <FilterIcon>🔽</FilterIcon>
          Filters
        </FilterHeader>
        <FilterContent isOpen={filtersOpen}>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Search</FilterLabel>
              <FilterInput
                type="text"
                placeholder="In descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Person</FilterLabel>
              <FilterSelect
                value={filterPerson}
                onChange={(e) => setFilterPerson(e.target.value)}
              >
                <option value="all">All people</option>
                {people.map((person) => (
                  <option key={person.id} value={person.name}>
                    {person.name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Source</FilterLabel>
              <FilterSelect
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
              >
                <option value="all">All sources</option>
                {moneySources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Type</FilterLabel>
              <FilterSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All types</option>
                <option value="lent">Given</option>
                <option value="borrowed">Taken</option>
              </FilterSelect>
            </FilterGroup>
          </FilterGrid>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>From Date</FilterLabel>
              <FilterInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>To Date</FilterLabel>
              <FilterInput
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </FilterGroup>
            <ClearFiltersButton onClick={clearFilters}>
              Clear Filters
            </ClearFiltersButton>
          </FilterRow>
        </FilterContent>
      </FilterSection>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th onClick={() => handleSort("person")}>
                Person {getSortIndicator("person")}
              </Th>
              <Th onClick={() => handleSort("amount")}>
                Amount {getSortIndicator("amount")}
              </Th>
              <Th onClick={() => handleSort("type")}>
                Type {getSortIndicator("type")}
              </Th>
              <Th onClick={() => handleSort("source")}>
                Money Source {getSortIndicator("source")}
              </Th>
              <Th onClick={() => handleSort("date")}>
                Date {getSortIndicator("date")}
              </Th>
              <Th onClick={() => handleSort("description")}>
                Description {getSortIndicator("description")}
              </Th>
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
                      filterPerson !== "all" ||
                      filterSource !== "all" ||
                      filterType !== "all" ||
                      fromDate ||
                      toDate
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
                  <Td style={{ fontWeight: 600 }}>
                    ₹{txn.amount.toLocaleString("en-IN")}
                  </Td>
                  <Td>
                    <Badge type={txn.type}>
                      {txn.type === "lent" ? "↑ Given" : "↓ Taken"}
                    </Badge>
                  </Td>
                  <Td>{getSourceName(txn.moneySourceId)}</Td>
                  <Td>
                    {new Date(txn.dueDate || txn.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </Td>
                  <Td style={{ color: "#6b7280" }}>{txn.description || "-"}</Td>
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
