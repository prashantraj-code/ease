import { useState, useEffect } from "react";
import styled from "styled-components";
import { getTransactions } from "../api";

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

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;

  &:before {
    content: "🔍";
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
  }
`;

const SearchInput = styled.input`
  padding: 11px 16px 11px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  background: white;
  font-family: "Futura", sans-serif;
  width: 100%;
  max-width: 500px;

  &:focus {
    border-color: #10b981;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const PersonCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const PersonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${(props) => props.color || "#10b981"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 24px;
  font-family: "Futura", sans-serif;
`;

const PersonInfo = styled.div`
  flex: 1;
`;

const PersonName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-family: "Futura", sans-serif;
`;

const TransactionCount = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatBox = styled.div`
  background: ${(props) => props.bgColor || "#f9fafb"};
  padding: 12px;
  border-radius: 8px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
  font-family: "Futura", sans-serif;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.color || "#1f2937"};
  font-family: "Futura", sans-serif;
`;

const BalanceCard = styled.div`
  background: ${(props) => (props.positive ? "#d1fae5" : "#fee2e2")};
  padding: 12px;
  border-radius: 8px;
  text-align: center;
`;

const BalanceLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.positive ? "#059669" : "#dc2626")};
  margin-bottom: 4px;
  font-family: "Futura", sans-serif;
`;

const BalanceValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => (props.positive ? "#059669" : "#dc2626")};
  font-family: "Futura", sans-serif;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
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

const SummaryBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const SummaryLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  font-family: "Futura", sans-serif;
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.color || "#1f2937"};
  font-family: "Futura", sans-serif;
`;

export default function PeoplePage() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions({ limit: 1000 });
        setTransactions(res.transactions || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Group transactions by person
  const peopleMap = {};
  transactions.forEach((txn) => {
    if (!peopleMap[txn.person]) {
      peopleMap[txn.person] = {
        name: txn.person,
        transactions: [],
        totalLent: 0,
        totalBorrowed: 0,
        unpaidLent: 0,
        unpaidBorrowed: 0,
      };
    }
    peopleMap[txn.person].transactions.push(txn);
    if (txn.type === "lent") {
      peopleMap[txn.person].totalLent += txn.amount;
      if (txn.status === "unpaid") {
        peopleMap[txn.person].unpaidLent += txn.amount;
      }
    } else {
      peopleMap[txn.person].totalBorrowed += txn.amount;
      if (txn.status === "unpaid") {
        peopleMap[txn.person].unpaidBorrowed += txn.amount;
      }
    }
  });

  const people = Object.values(peopleMap);

  // Filter by search
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary stats
  const totalPeople = people.length;
  const peopleOwingYou = people.filter((p) => p.unpaidLent > 0).length;
  const peopleYouOwe = people.filter((p) => p.unpaidBorrowed > 0).length;

  // Get random color for avatar
  const getAvatarColor = (name) => {
    const colors = [
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <PageHeader>
        <PageTitle>People</PageTitle>
        <PageSubtitle>
          View all people you have financial transactions with
        </PageSubtitle>
      </PageHeader>

      <SummaryBar>
        <SummaryCard>
          <SummaryLabel>Total People</SummaryLabel>
          <SummaryValue>{totalPeople}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>People Owing You</SummaryLabel>
          <SummaryValue color="#10b981">{peopleOwingYou}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>People You Owe</SummaryLabel>
          <SummaryValue color="#dc2626">{peopleYouOwe}</SummaryValue>
        </SummaryCard>
      </SummaryBar>

      <SearchWrapper>
        <SearchInput
          placeholder="Search people by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchWrapper>

      {filteredPeople.length === 0 ? (
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyText>
            {searchQuery ? "No people found" : "No people yet"}
          </EmptyText>
          <EmptySubtext>
            {searchQuery
              ? "Try adjusting your search"
              : "Add transactions to see people here"}
          </EmptySubtext>
        </EmptyState>
      ) : (
        <Grid>
          {filteredPeople.map((person) => {
            const netBalance = person.totalLent - person.totalBorrowed;
            const isPositive = netBalance >= 0;

            return (
              <PersonCard key={person.name}>
                <PersonHeader>
                  <Avatar color={getAvatarColor(person.name)}>
                    {person.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <PersonInfo>
                    <PersonName>{person.name}</PersonName>
                    <TransactionCount>
                      {person.transactions.length} transaction
                      {person.transactions.length !== 1 ? "s" : ""}
                    </TransactionCount>
                  </PersonInfo>
                </PersonHeader>

                <StatsGrid>
                  <StatBox bgColor="#d1fae5">
                    <StatLabel>Lent</StatLabel>
                    <StatValue color="#059669">
                      ₹{person.totalLent.toFixed(0)}
                    </StatValue>
                  </StatBox>
                  <StatBox bgColor="#fee2e2">
                    <StatLabel>Borrowed</StatLabel>
                    <StatValue color="#dc2626">
                      ₹{person.totalBorrowed.toFixed(0)}
                    </StatValue>
                  </StatBox>
                </StatsGrid>

                <BalanceCard positive={isPositive}>
                  <BalanceLabel positive={isPositive}>
                    {isPositive ? "They owe you" : "You owe them"}
                  </BalanceLabel>
                  <BalanceValue positive={isPositive}>
                    ₹{Math.abs(netBalance).toFixed(0)}
                  </BalanceValue>
                </BalanceCard>
              </PersonCard>
            );
          })}
        </Grid>
      )}
    </>
  );
}
