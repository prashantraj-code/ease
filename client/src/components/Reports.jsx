import { useEffect, useState } from "react";
import styled from "styled-components";
import { getTransactions } from "../api";

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 24px 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const SummaryCard = styled.div`
  padding: 20px;
  background: ${(props) => props.bgColor || "#f9fafb"};
  border-radius: 12px;
  text-align: center;
`;

const SummaryLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${(props) => props.color || "#374151"};
`;

const ChartSection = styled.div`
  margin: 32px 0;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 16px 0;
`;

const BarChart = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-end;
  height: 200px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
`;

const Bar = styled.div`
  flex: 1;
  background: ${(props) => props.color};
  border-radius: 8px 8px 0 0;
  height: ${(props) => props.height}%;
  min-height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 8px;
  position: relative;
`;

const BarLabel = styled.div`
  position: absolute;
  bottom: -30px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-align: center;
  width: 100%;
`;

const BarValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
`;

const ExportSection = styled.div`
  margin-top: 32px;
  display: flex;
  gap: 12px;
`;

const ExportButton = styled.button`
  flex: 1;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;

const TransactionsByPerson = styled.div`
  margin-top: 32px;
`;

const PersonItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const PersonName = styled.span`
  font-weight: 600;
  color: #374151;
`;

const PersonAmount = styled.span`
  font-weight: 700;
  color: ${(props) => (props.positive ? "#16a34a" : "#dc2626")};
`;

export default function Reports({ summary }) {
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      const res = await getTransactions({ limit: 1000 });
      setAllTransactions(res.data.transactions);
    } catch (err) {
      console.error("Failed to fetch all transactions", err);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getMaxValue = () => {
    return Math.max(summary.totalLent, summary.totalBorrowed, 1);
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Type",
      "Person",
      "Amount",
      "Status",
      "Due Date",
      "Description",
    ];
    const rows = allTransactions.map((t) => [
      new Date(t.createdAt).toLocaleDateString(),
      t.type,
      t.person,
      t.amount,
      t.status,
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "",
      t.description || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ease-transactions-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  const getTransactionsByPerson = () => {
    const personMap = {};

    allTransactions.forEach((t) => {
      if (!personMap[t.person]) {
        personMap[t.person] = { lent: 0, borrowed: 0 };
      }
      if (t.type === "lent") {
        personMap[t.person].lent += t.amount;
      } else {
        personMap[t.person].borrowed += t.amount;
      }
    });

    return Object.entries(personMap)
      .map(([person, amounts]) => ({
        person,
        net: amounts.lent - amounts.borrowed,
      }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  };

  return (
    <Card>
      <Title>📈 Reports & Analytics</Title>

      <SummaryGrid>
        <SummaryCard bgColor="#dcfce7">
          <SummaryLabel>Total Lent</SummaryLabel>
          <SummaryValue color="#16a34a">
            {formatCurrency(summary.totalLent)}
          </SummaryValue>
        </SummaryCard>
        <SummaryCard bgColor="#fee2e2">
          <SummaryLabel>Total Borrowed</SummaryLabel>
          <SummaryValue color="#dc2626">
            {formatCurrency(summary.totalBorrowed)}
          </SummaryValue>
        </SummaryCard>
        <SummaryCard bgColor="#fef3c7">
          <SummaryLabel>Unpaid Lent</SummaryLabel>
          <SummaryValue color="#ca8a04">
            {formatCurrency(summary.totalLentUnpaid)}
          </SummaryValue>
        </SummaryCard>
        <SummaryCard bgColor="#e0e7ff">
          <SummaryLabel>Net Balance</SummaryLabel>
          <SummaryValue color="#667eea">
            {formatCurrency(summary.netBalance)}
          </SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <ChartSection>
        <ChartTitle>Financial Overview</ChartTitle>
        <BarChart>
          <Bar
            color="linear-gradient(135deg, #34d399 0%, #10b981 100%)"
            height={(summary.totalLent / getMaxValue()) * 100}
          >
            <BarValue>{formatCurrency(summary.totalLent)}</BarValue>
            <BarLabel>Total Lent</BarLabel>
          </Bar>
          <Bar
            color="linear-gradient(135deg, #f87171 0%, #ef4444 100%)"
            height={(summary.totalBorrowed / getMaxValue()) * 100}
          >
            <BarValue>{formatCurrency(summary.totalBorrowed)}</BarValue>
            <BarLabel>Total Borrowed</BarLabel>
          </Bar>
          <Bar
            color="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
            height={(summary.totalLentUnpaid / getMaxValue()) * 100}
          >
            <BarValue>{formatCurrency(summary.totalLentUnpaid)}</BarValue>
            <BarLabel>Unpaid Lent</BarLabel>
          </Bar>
          <Bar
            color="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
            height={(summary.totalBorrowedUnpaid / getMaxValue()) * 100}
          >
            <BarValue>{formatCurrency(summary.totalBorrowedUnpaid)}</BarValue>
            <BarLabel>Unpaid Borrowed</BarLabel>
          </Bar>
        </BarChart>
      </ChartSection>

      <TransactionsByPerson>
        <ChartTitle>Net Balance by Person</ChartTitle>
        {getTransactionsByPerson().map(({ person, net }) => (
          <PersonItem key={person}>
            <PersonName>{person}</PersonName>
            <PersonAmount positive={net > 0}>
              {net > 0 ? "+" : ""}
              {formatCurrency(net)}
            </PersonAmount>
          </PersonItem>
        ))}
      </TransactionsByPerson>

      <ExportSection>
        <ExportButton onClick={exportToCSV}>📥 Export as CSV</ExportButton>
      </ExportSection>
    </Card>
  );
}
