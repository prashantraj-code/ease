import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const PersonName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
`;

const TransactionCount = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0;
`;

const Balance = styled.div`
  margin-bottom: 20px;
`;

const BalanceLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BalanceAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => (props.positive ? "#10b981" : "#ef4444")};
  margin-bottom: 4px;
`;

const BalanceText = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const PrimaryButton = styled(Button)`
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;

  &:hover {
    background: #2563eb;
    border-color: #2563eb;
  }
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;

  &:hover {
    background: #2563eb;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

export default function PeopleView({
  transactions,
  onAddTransaction,
  onEdit,
  onDelete,
  selectedPerson,
  onSelectPerson,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Aggregate transactions by person
  const getPeopleData = () => {
    const peopleMap = {};

    transactions.forEach((txn) => {
      if (!peopleMap[txn.person]) {
        peopleMap[txn.person] = {
          name: txn.person,
          transactions: [],
          totalLent: 0,
          totalBorrowed: 0,
          netBalance: 0,
        };
      }

      peopleMap[txn.person].transactions.push(txn);

      if (txn.type === "lent") {
        peopleMap[txn.person].totalLent += txn.amount;
      } else {
        peopleMap[txn.person].totalBorrowed += txn.amount;
      }
    });

    Object.values(peopleMap).forEach((person) => {
      person.netBalance = person.totalLent - person.totalBorrowed;
    });

    return Object.values(peopleMap);
  };

  const peopleData = getPeopleData();
  const filteredPeople = peopleData.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>People</Title>
        <Subtitle>
          Manage loans and debts with {peopleData.length} people
        </Subtitle>
      </Header>

      <AddButton onClick={onAddTransaction}>+ Add Transaction</AddButton>

      {filteredPeople.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
          <p>No transactions yet. Add your first transaction to get started!</p>
        </EmptyState>
      ) : (
        <Grid>
          {filteredPeople.map((person) => {
            const isPositive = person.netBalance > 0;
            const absBalance = Math.abs(person.netBalance);

            return (
              <Card key={person.name}>
                <CardHeader>
                  <div>
                    <PersonName>{person.name}</PersonName>
                    <TransactionCount>
                      {person.transactions.length} transaction
                      {person.transactions.length !== 1 ? "s" : ""}
                    </TransactionCount>
                  </div>
                </CardHeader>

                <Balance>
                  <BalanceLabel>Net Balance</BalanceLabel>
                  <BalanceAmount positive={isPositive}>
                    ₹{absBalance.toLocaleString("en-IN")}
                  </BalanceAmount>
                  <BalanceText>
                    {isPositive
                      ? `${person.name} owes you`
                      : person.netBalance < 0
                      ? `You owe ${person.name}`
                      : "Settled"}
                  </BalanceText>
                </Balance>

                <ButtonGroup>
                  <Button onClick={() => onSelectPerson(person.name)}>
                    View Details
                  </Button>
                  <PrimaryButton onClick={onAddTransaction}>Add</PrimaryButton>
                </ButtonGroup>
              </Card>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
