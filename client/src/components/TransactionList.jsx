import styled from "styled-components";

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 20px 0;
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchInput = styled.input`
  grid-column: 1 / -1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  background: white;

  &:focus {
    border-color: #667eea;
  }
`;

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const TransactionCard = styled.div`
  padding: 16px;
  background: ${(props) => (props.type === "lent" ? "#dcfce7" : "#fee2e2")};
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const PersonName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 4px;
`;

const TransactionDetails = styled.div`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => {
    if (props.type === "status") {
      return props.value === "paid" ? "#16a34a" : "#dc2626";
    }
    return "#667eea";
  }};
  color: white;
`;

const Amount = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${(props) => (props.type === "lent" ? "#16a34a" : "#dc2626")};
  margin-right: 16px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.danger ? "#dc2626" : "#667eea")};
  color: white;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: ${(props) => (props.active ? "#667eea" : "white")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #667eea;
  font-weight: 600;
`;

export default function TransactionList({
  transactions,
  loading,
  filters,
  setFilters,
  pagination,
  onEdit,
  onDelete,
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  return (
    <Card>
      <Title>📋 All Transactions</Title>

      <FilterSection>
        <SearchInput
          type="text"
          placeholder="Search by person or description..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <Select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="lent">Lent</option>
          <option value="borrowed">Borrowed</option>
        </Select>
        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </Select>
        <Select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split("-");
            setFilters({ ...filters, sortBy, order, page: 1 });
          }}
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="amount-desc">Amount: High to Low</option>
          <option value="amount-asc">Amount: Low to High</option>
          <option value="dueDate-asc">Due Date: Earliest</option>
          <option value="dueDate-desc">Due Date: Latest</option>
        </Select>
      </FilterSection>

      {loading ? (
        <LoadingState>Loading transactions...</LoadingState>
      ) : transactions.length === 0 ? (
        <EmptyState>
          No transactions found. Add your first transaction to get started!
        </EmptyState>
      ) : (
        <>
          <TransactionsList>
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} type={transaction.type}>
                <TransactionInfo>
                  <PersonName>{transaction.person}</PersonName>
                  <TransactionDetails>
                    <Badge type="status" value={transaction.status}>
                      {transaction.status.toUpperCase()}
                    </Badge>
                    <span>{formatDate(transaction.createdAt)}</span>
                    {transaction.dueDate && (
                      <span>Due: {formatDate(transaction.dueDate)}</span>
                    )}
                    {transaction.description && (
                      <span>{transaction.description}</span>
                    )}
                  </TransactionDetails>
                </TransactionInfo>
                <Amount type={transaction.type}>
                  {transaction.type === "lent" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </Amount>
                <Actions>
                  <ActionButton onClick={() => onEdit(transaction)}>
                    Edit
                  </ActionButton>
                  <ActionButton danger onClick={() => onDelete(transaction.id)}>
                    Delete
                  </ActionButton>
                </Actions>
              </TransactionCard>
            ))}
          </TransactionsList>

          {pagination && pagination.totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </PageButton>
              <PageInfo>
                Page {pagination.page} of {pagination.totalPages}
              </PageInfo>
              <PageButton
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Card>
  );
}
