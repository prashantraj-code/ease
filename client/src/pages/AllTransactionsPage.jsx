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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

const PageTitleSection = styled.div``;

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
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: ${(props) => (props.noHover ? "none" : "all 0.2s ease")};

  &:hover {
    transform: ${(props) =>
      props.clickable && !props.noHover ? "translateY(-2px)" : "none"};
    box-shadow: ${(props) =>
      props.clickable && !props.noHover
        ? "0 4px 12px rgba(0, 0, 0, 0.1)"
        : "none"};
    background: ${(props) =>
      props.noHover ? undefined : props.hoverBg || "white"};
    border-color: ${(props) =>
      props.noHover ? undefined : props.hoverBorder || "#e5e7eb"};
  }

  &:hover ${() => StatLabel} {
    color: ${(props) =>
      props.noHover ? undefined : props.hoverTextColor || "#6b7280"};
  }

  &:hover ${() => StatValue} {
    color: ${(props) =>
      props.noHover ? undefined : props.hoverTextColor || "inherit"};
  }
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
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Futura", sans-serif;
`;

const FilterHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterHeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterIcon = styled.span`
  font-size: 16px;
`;

const FilterContent = styled.div`
  padding: 20px;
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
  grid-template-columns: 1fr 1fr;
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

const ClearButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 13px;
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
  cursor: ${(props) => (props.sortable ? "pointer" : "default")};
  transition: background 0.2s;
  user-select: none;

  &:hover {
    background: ${(props) => (props.sortable ? "#f3f4f6" : "#f9fafb")};
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
  opacity: 0.8;
`;

const SortBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  font-size: 9px;
  font-weight: 700;
  margin-left: 4px;
`;

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [people, setPeople] = useState([]);
  const [moneySources, setMoneySources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPerson, setFilterPerson] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Multi-column sort state: array of { column, order } objects
  // order can be "asc", "desc", or column not in array means no sort
  const [sortColumns, setSortColumns] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 5;

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

  // Handle sort with 3-state toggle: none -> asc -> desc -> none
  const handleSort = (column) => {
    setSortColumns((prev) => {
      const existingIndex = prev.findIndex((s) => s.column === column);

      if (existingIndex === -1) {
        // Not sorted - add as asc
        return [...prev, { column, order: "asc" }];
      } else {
        const existing = prev[existingIndex];
        if (existing.order === "asc") {
          // asc -> desc
          const newSort = [...prev];
          newSort[existingIndex] = { column, order: "desc" };
          return newSort;
        } else {
          // desc -> remove (no sort)
          return prev.filter((s) => s.column !== column);
        }
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPerson("all");
    setFilterSource("all");
    setFilterType("all");
    setFromDate("");
    setToDate("");
  };

  const clearSorting = () => {
    setSortColumns([]);
  };

  // Check if any filter is applied
  const hasActiveFilters =
    searchQuery !== "" ||
    filterPerson !== "all" ||
    filterSource !== "all" ||
    filterType !== "all" ||
    fromDate !== "" ||
    toDate !== "";

  // Check if any sorting is applied
  const hasActiveSorting = sortColumns.length > 0;

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

  // Get value for sorting
  const getSortValue = (txn, column) => {
    switch (column) {
      case "person":
        return txn.person.toLowerCase();
      case "amount":
        return txn.amount;
      case "type":
        return txn.type;
      case "source":
        const source = moneySources.find((s) => s.id === txn.moneySourceId);
        return source?.name?.toLowerCase() || "zzz";
      case "date":
        return new Date(txn.dueDate || txn.createdAt).getTime();
      default:
        return "";
    }
  };

  // Sort transactions with multi-column support
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    for (const { column, order } of sortColumns) {
      const aVal = getSortValue(a, column);
      const bVal = getSortValue(b, column);

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
    }
    // Default sort by date desc if no sorts applied
    if (sortColumns.length === 0) {
      const aDate = new Date(a.dueDate || a.createdAt).getTime();
      const bDate = new Date(b.dueDate || b.createdAt).getTime();
      return bDate - aDate;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = showAll
    ? sortedTransactions
    : sortedTransactions.slice(
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
  // Net amount = Total Given - Total Taken
  const netAmount = totalLent - totalBorrowed;

  const getSourceName = (sourceId) => {
    const source = moneySources.find((s) => s.id === sourceId);
    return source?.name || "-";
  };

  const getSortIndicator = (column) => {
    const sortInfo = sortColumns.find((s) => s.column === column);
    if (!sortInfo) return null;

    const priority = sortColumns.findIndex((s) => s.column === column) + 1;

    return (
      <>
        <SortIndicator>{sortInfo.order === "asc" ? "▲" : "▼"}</SortIndicator>
        {sortColumns.length > 1 && <SortBadge>{priority}</SortBadge>}
      </>
    );
  };

  return (
    <>
      <PageHeader>
        <PageTitleSection>
          <PageTitle>All Transactions</PageTitle>
          <PageSubtitle>
            Complete list of all your lending and borrowing transactions
          </PageSubtitle>
        </PageTitleSection>
        <PrimaryButton onClick={() => setShowForm(true)}>
          <span style={{ fontSize: "18px" }}>+</span>
          Add Transaction
        </PrimaryButton>
      </PageHeader>

      <StatsBar>
        <StatCard
          clickable
          hoverBg="#1f2937"
          hoverBorder="#1f2937"
          hoverTextColor="white"
          onClick={() => {
            clearFilters();
            clearSorting();
          }}
          title="Click to show all transactions"
        >
          <StatLabel>Total Transactions</StatLabel>
          <StatValue>{totalTransactions}</StatValue>
        </StatCard>
        <StatCard
          clickable
          hoverBg="#d1fae5"
          hoverBorder="#10b981"
          hoverTextColor="#059669"
          onClick={() => {
            clearFilters();
            setFilterType("lent");
          }}
          title="Click to filter Given transactions"
        >
          <StatLabel>Total Given</StatLabel>
          <StatValue color="#10b981">
            ₹{totalLent.toLocaleString("en-IN")}
          </StatValue>
        </StatCard>
        <StatCard
          clickable
          hoverBg="#fee2e2"
          hoverBorder="#dc2626"
          hoverTextColor="#dc2626"
          onClick={() => {
            clearFilters();
            setFilterType("borrowed");
          }}
          title="Click to filter Taken transactions"
        >
          <StatLabel>Total Taken</StatLabel>
          <StatValue color="#dc2626">
            ₹{totalBorrowed.toLocaleString("en-IN")}
          </StatValue>
        </StatCard>
        <StatCard
          noHover
          style={{
            background: "#1f2937",
            borderColor: "#1f2937",
          }}
        >
          <StatLabel style={{ color: "white" }}>Net Balance</StatLabel>
          <StatValue style={{ color: "white" }}>
            {netAmount >= 0 ? "+" : "-"}₹
            {Math.abs(netAmount).toLocaleString("en-IN")}
          </StatValue>
        </StatCard>
      </StatsBar>

      {/* Filters Section */}
      <FilterSection>
        <FilterHeader>
          <FilterHeaderLeft>
            <FilterIcon>🔽</FilterIcon>
            Filters
          </FilterHeaderLeft>
          <FilterHeaderButtons>
            {hasActiveFilters && (
              <ClearButton onClick={clearFilters}>Clear Filters</ClearButton>
            )}
            {hasActiveSorting && (
              <ClearButton onClick={clearSorting}>Clear Sorting</ClearButton>
            )}
          </FilterHeaderButtons>
        </FilterHeader>
        <FilterContent>
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
          </FilterRow>
        </FilterContent>
      </FilterSection>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th sortable onClick={() => handleSort("person")}>
                Person {getSortIndicator("person")}
              </Th>
              <Th sortable onClick={() => handleSort("amount")}>
                Amount {getSortIndicator("amount")}
              </Th>
              <Th sortable onClick={() => handleSort("type")}>
                Type {getSortIndicator("type")}
              </Th>
              <Th sortable onClick={() => handleSort("source")}>
                Money Source {getSortIndicator("source")}
              </Th>
              <Th sortable onClick={() => handleSort("date")}>
                Date {getSortIndicator("date")}
              </Th>
              <Th>Description</Th>
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
                      {hasActiveFilters
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
              {showAll
                ? `Showing all ${sortedTransactions.length} transactions`
                : `Showing ${
                    (currentPage - 1) * itemsPerPage + 1
                  } to ${Math.min(
                    currentPage * itemsPerPage,
                    sortedTransactions.length
                  )} of ${sortedTransactions.length} transactions`}
            </PaginationInfo>
            <PaginationButtons>
              {!showAll && (
                <>
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
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </>
              )}
              <Button
                onClick={() => {
                  setShowAll(!showAll);
                  setCurrentPage(1);
                }}
                style={{
                  background: showAll ? "#1f2937" : "white",
                  color: showAll ? "white" : "#374151",
                }}
              >
                {showAll ? "Default" : "Show All"}
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
