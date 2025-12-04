import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getTransactions,
  getTransactionStats,
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

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PageTitleSection = styled.div``;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 480px) {
    font-size: 14px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const PrimaryButton = styled(Button)`
  background: #10b981;
  color: white;
  border-color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #059669;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: ${(props) => (props.noHover ? "none" : "all 0.2s ease")};

  @media (max-width: 480px) {
    padding: 16px;
  }

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

  @media (max-width: 480px) {
    font-size: 24px;
  }
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
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

const FilterHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterHeaderButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const FilterIcon = styled.span`
  font-size: 16px;
`;

const FilterContent = styled.div`
  padding: 20px;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: flex-end;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
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
  box-sizing: border-box;

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
  box-sizing: border-box;

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

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
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
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.sortable ? "#f3f4f6" : "#f9fafb")};
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 11px;
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

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 13px;
  }
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Futura", sans-serif;
  white-space: nowrap;
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

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 11px;
  }
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

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-family: "Futura", sans-serif;

  @media (max-width: 480px) {
    padding: 40px 16px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    font-size: 48px;
  }
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  color: #9ca3af;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  font-family: "Futura", sans-serif;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #6b7280;

  @media (max-width: 600px) {
    text-align: center;
    font-size: 13px;
  }
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    justify-content: center;
  }
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

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Futura", sans-serif;
  font-size: 14px;
  color: #6b7280;
`;

const TableContainerWrapper = styled.div`
  position: relative;
`;

// Mobile card view for transactions
const MobileCardList = styled.div`
  display: none;

  @media (max-width: 600px) {
    display: block;
  }
`;

const MobileCard = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const MobileCardPerson = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Futura", sans-serif;
`;

const MobileCardAmount = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => (props.type === "lent" ? "#10b981" : "#dc2626")};
  font-family: "Futura", sans-serif;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
`;

const MobileCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
`;

const DesktopTable = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

export default function AllTransactionsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL params once on initial render
  const initialParams = new URLSearchParams(location.search);
  const initialPersonParam = initialParams.get("person");
  const initialAddNew = initialParams.get("addNew") === "true";

  const [transactions, setTransactions] = useState([]);
  const [people, setPeople] = useState([]);
  const [moneySources, setMoneySources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prefilledPerson, setPrefilledPerson] = useState(
    initialPersonParam ? decodeURIComponent(initialPersonParam) : null
  );
  const [pendingAddNew, setPendingAddNew] = useState(initialAddNew);

  // Stats
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalLent: 0,
    totalBorrowed: 0,
    netBalance: 0,
  });

  // Filter states - initialize from URL params
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterPerson, setFilterPerson] = useState(
    initialPersonParam ? decodeURIComponent(initialPersonParam) : "all"
  );
  const [filterSource, setFilterSource] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Multi-column sort state
  const [sortColumns, setSortColumns] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  });
  const itemsPerPage = 5;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch helper data (people, money sources, stats)
  const fetchHelperData = async () => {
    try {
      const [peopleRes, sourcesRes, statsRes] = await Promise.all([
        getPeople(),
        getMoneySources(),
        getTransactionStats(),
      ]);
      setPeople(peopleRes.people || []);
      setMoneySources(sourcesRes.moneySources || []);
      setStats(statsRes);

      // Open add form after people data is loaded if pending
      if (pendingAddNew) {
        setPendingAddNew(false);
        setShowForm(true);
        // Clean up the URL
        const newParams = new URLSearchParams(location.search);
        newParams.delete("addNew");
        navigate(
          `/transactions${
            newParams.toString() ? `?${newParams.toString()}` : ""
          }`,
          { replace: true }
        );
      }
    } catch (error) {
      console.error("Error fetching helper data:", error);
    }
  };

  // Fetch transactions with all filters
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Build sort string
      const sortBy =
        sortColumns.length > 0
          ? sortColumns.map((s) => `${s.column}:${s.order}`).join(",")
          : undefined;

      const params = {
        page: showAll ? 1 : currentPage,
        limit: showAll ? 1000 : itemsPerPage,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterPerson !== "all" && { person: filterPerson }),
        ...(filterSource !== "all" && { moneySourceId: filterSource }),
        ...(filterType !== "all" && { type: filterType }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
        ...(sortBy && { sortBy }),
      };

      const res = await getTransactions(params);
      setTransactions(res.transactions || []);
      setPagination(
        res.pagination || {
          total: 0,
          page: 1,
          limit: itemsPerPage,
          totalPages: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    showAll,
    debouncedSearch,
    filterPerson,
    filterSource,
    filterType,
    fromDate,
    toDate,
    sortColumns,
  ]);

  useEffect(() => {
    fetchHelperData();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    filterPerson,
    filterSource,
    filterType,
    fromDate,
    toDate,
    sortColumns,
  ]);

  const handleAddTransaction = async (data) => {
    try {
      await createTransaction(data);
      fetchTransactions();
      fetchHelperData(); // Refresh stats and money sources
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
      fetchHelperData(); // Refresh stats and money sources
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
        fetchHelperData(); // Refresh stats and money sources
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
        return [...prev, { column, order: "asc" }];
      } else {
        const existing = prev[existingIndex];
        if (existing.order === "asc") {
          const newSort = [...prev];
          newSort[existingIndex] = { column, order: "desc" };
          return newSort;
        } else {
          return prev.filter((s) => s.column !== column);
        }
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setFilterPerson("all");
    setFilterSource("all");
    setFilterType("all");
    setFromDate("");
    setToDate("");
  };

  const clearSorting = () => {
    setSortColumns([]);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    filterPerson !== "all" ||
    filterSource !== "all" ||
    filterType !== "all" ||
    fromDate !== "" ||
    toDate !== "";

  const hasActiveSorting = sortColumns.length > 0;

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
          <StatValue>{stats.totalTransactions}</StatValue>
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
            ₹{stats.totalLent.toLocaleString("en-IN")}
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
            ₹{stats.totalBorrowed.toLocaleString("en-IN")}
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
            {stats.netBalance >= 0 ? "+" : "-"}₹
            {Math.abs(stats.netBalance).toLocaleString("en-IN")}
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

      <TableContainerWrapper>
        <TableContainer>
          {/* Desktop Table View */}
          <DesktopTable>
            <TableWrapper>
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
                  {transactions.length === 0 ? (
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
                    transactions.map((txn) => (
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
                        <Td>{formatDate(txn.dueDate || txn.createdAt)}</Td>
                        <Td style={{ color: "#6b7280" }}>
                          {txn.description || "-"}
                        </Td>
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
            </TableWrapper>
          </DesktopTable>

          {/* Mobile Card View */}
          <MobileCardList>
            {transactions.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📭</EmptyIcon>
                <EmptyText>No transactions found</EmptyText>
                <EmptySubtext>
                  {hasActiveFilters
                    ? "Try adjusting your filters"
                    : "Start by adding your first transaction"}
                </EmptySubtext>
              </EmptyState>
            ) : (
              transactions.map((txn) => (
                <MobileCard key={txn.id}>
                  <MobileCardHeader>
                    <MobileCardPerson>{txn.person}</MobileCardPerson>
                    <MobileCardAmount type={txn.type}>
                      {txn.type === "lent" ? "+" : "-"}₹
                      {txn.amount.toLocaleString("en-IN")}
                    </MobileCardAmount>
                  </MobileCardHeader>
                  <MobileCardRow>
                    <span>Type</span>
                    <Badge type={txn.type}>
                      {txn.type === "lent" ? "↑ Given" : "↓ Taken"}
                    </Badge>
                  </MobileCardRow>
                  <MobileCardRow>
                    <span>Source</span>
                    <span>{getSourceName(txn.moneySourceId)}</span>
                  </MobileCardRow>
                  <MobileCardRow>
                    <span>Date</span>
                    <span>{formatDate(txn.dueDate || txn.createdAt)}</span>
                  </MobileCardRow>
                  {txn.description && (
                    <MobileCardRow>
                      <span>Note</span>
                      <span style={{ textAlign: "right", maxWidth: "60%" }}>
                        {txn.description}
                      </span>
                    </MobileCardRow>
                  )}
                  <MobileCardActions>
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
                  </MobileCardActions>
                </MobileCard>
              ))
            )}
          </MobileCardList>

          {transactions.length > 0 && (
            <Pagination>
              <PaginationInfo>
                {showAll
                  ? `Showing all ${pagination.total} transactions`
                  : `Showing ${
                      (currentPage - 1) * itemsPerPage + 1
                    } to ${Math.min(
                      currentPage * itemsPerPage,
                      pagination.total
                    )} of ${pagination.total} transactions`}
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
                        setCurrentPage((p) =>
                          Math.min(pagination.totalPages, p + 1)
                        )
                      }
                      disabled={
                        currentPage === pagination.totalPages ||
                        pagination.totalPages === 0
                      }
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
        {loading && <LoadingOverlay>Loading...</LoadingOverlay>}
      </TableContainerWrapper>

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
            setPrefilledPerson(null);
          }}
          initialData={
            editingTransaction ||
            (prefilledPerson ? { person: prefilledPerson } : null)
          }
        />
      )}
    </>
  );
}
