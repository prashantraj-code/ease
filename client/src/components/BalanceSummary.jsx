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

const SummaryGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: ${(props) => props.bgColor || "#f9fafb"};
  border-radius: 10px;
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
`;

const Value = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.color || "#374151"};
`;

const NetBalance = styled.div`
  margin-top: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  text-align: center;
`;

const NetLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin-bottom: 8px;
`;

const NetValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: white;
`;

export default function BalanceSummary({ summary }) {
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <Card>
      <Title>💰 Balance Summary</Title>
      <SummaryGrid>
        <SummaryItem bgColor="#dcfce7">
          <Label>Total Lent</Label>
          <Value color="#16a34a">{formatCurrency(summary.totalLent)}</Value>
        </SummaryItem>
        <SummaryItem bgColor="#fee2e2">
          <Label>Total Borrowed</Label>
          <Value color="#dc2626">{formatCurrency(summary.totalBorrowed)}</Value>
        </SummaryItem>
        <SummaryItem bgColor="#fef3c7">
          <Label>Lent Unpaid</Label>
          <Value color="#ca8a04">
            {formatCurrency(summary.totalLentUnpaid)}
          </Value>
        </SummaryItem>
        <SummaryItem bgColor="#fce7f3">
          <Label>Borrowed Unpaid</Label>
          <Value color="#db2777">
            {formatCurrency(summary.totalBorrowedUnpaid)}
          </Value>
        </SummaryItem>
        <SummaryItem>
          <Label>Total Transactions</Label>
          <Value>{summary.totalTransactions}</Value>
        </SummaryItem>
      </SummaryGrid>
      <NetBalance>
        <NetLabel>Net Balance</NetLabel>
        <NetValue>{formatCurrency(summary.netBalance)}</NetValue>
      </NetBalance>
    </Card>
  );
}
