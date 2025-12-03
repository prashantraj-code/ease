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

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 12px 0;
`;

const NotificationItem = styled.div`
  padding: 12px;
  background: ${(props) => (props.overdue ? "#fee2e2" : "#fef3c7")};
  border-radius: 10px;
  margin-bottom: 8px;
  border-left: 4px solid ${(props) => (props.overdue ? "#dc2626" : "#f59e0b")};
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const PersonName = styled.span`
  font-weight: 700;
  color: #374151;
  font-size: 14px;
`;

const Amount = styled.span`
  font-weight: 700;
  color: ${(props) => (props.type === "lent" ? "#16a34a" : "#dc2626")};
  font-size: 14px;
`;

const Details = styled.div`
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 14px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${(props) => (props.overdue ? "#dc2626" : "#f59e0b")};
  color: white;
  margin-left: 8px;
`;

export default function NotificationPanel({ notifications }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <Title>🔔 Notifications</Title>

      {notifications.overdue && notifications.overdue.length > 0 && (
        <Section>
          <SectionTitle>⚠️ Overdue</SectionTitle>
          {notifications.overdue.map((item) => (
            <NotificationItem key={item.id} overdue>
              <NotificationHeader>
                <PersonName>{item.person}</PersonName>
                <Amount type={item.type}>{formatCurrency(item.amount)}</Amount>
              </NotificationHeader>
              <Details>
                <span>
                  {item.type === "lent" ? "You lent" : "You borrowed"}
                </span>
                <Badge overdue>
                  {Math.abs(getDaysUntilDue(item.dueDate))} days overdue
                </Badge>
              </Details>
            </NotificationItem>
          ))}
        </Section>
      )}

      {notifications.upcoming && notifications.upcoming.length > 0 && (
        <Section>
          <SectionTitle>📅 Upcoming (Next 7 Days)</SectionTitle>
          {notifications.upcoming.map((item) => (
            <NotificationItem key={item.id}>
              <NotificationHeader>
                <PersonName>{item.person}</PersonName>
                <Amount type={item.type}>{formatCurrency(item.amount)}</Amount>
              </NotificationHeader>
              <Details>
                <span>
                  {item.type === "lent" ? "You lent" : "You borrowed"}
                </span>
                <span>Due: {formatDate(item.dueDate)}</span>
                <Badge>{getDaysUntilDue(item.dueDate)} days left</Badge>
              </Details>
            </NotificationItem>
          ))}
        </Section>
      )}

      {(!notifications.overdue || notifications.overdue.length === 0) &&
        (!notifications.upcoming || notifications.upcoming.length === 0) && (
          <EmptyState>
            🎉 No pending notifications!
            <br />
            All caught up.
          </EmptyState>
        )}
    </Card>
  );
}
