import { useState } from "react";
import styled from "styled-components";

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
  margin-bottom: 24px;

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const SourceCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  position: relative;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const SourceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const SourceIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.bgColor || "#10b981"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const SourceInfo = styled.div`
  flex: 1;
`;

const SourceName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-family: "Futura", sans-serif;
`;

const SourceType = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
`;

const SourceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-family: "Futura", sans-serif;
`;

const DetailLabel = styled.span`
  color: #6b7280;
`;

const DetailValue = styled.span`
  color: #1f2937;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

const SmallButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Futura", sans-serif;

  &:hover {
    background: #f9fafb;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px 0;
  font-family: "Futura", sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  font-family: "Futura", sans-serif;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-family: "Futura", sans-serif;
  outline: none;

  &:focus {
    border-color: #10b981;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-family: "Futura", sans-serif;
  outline: none;

  &:focus {
    border-color: #10b981;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
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
  margin-bottom: 24px;
`;

export default function MoneySourcesPage() {
  const [sources, setSources] = useState([
    {
      id: 1,
      name: "Cash",
      type: "cash",
      icon: "💵",
      color: "#10b981",
      balance: 5000,
      description: "Physical cash on hand",
    },
    {
      id: 2,
      name: "Bank Account",
      type: "bank",
      icon: "🏦",
      color: "#3b82f6",
      accountNumber: "****1234",
      balance: 25000,
      description: "Primary savings account",
    },
    {
      id: 3,
      name: "Digital Wallet",
      type: "wallet",
      icon: "📱",
      color: "#8b5cf6",
      balance: 3500,
      description: "UPI and digital payments",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSource = {
      id: editingSource?.id || Date.now(),
      name: formData.get("name"),
      type: formData.get("type"),
      balance: parseFloat(formData.get("balance") || 0),
      description: formData.get("description"),
      icon: getIconForType(formData.get("type")),
      color: getColorForType(formData.get("type")),
      accountNumber: formData.get("accountNumber") || undefined,
    };

    if (editingSource) {
      setSources(
        sources.map((s) => (s.id === editingSource.id ? newSource : s))
      );
    } else {
      setSources([...sources, newSource]);
    }

    setShowModal(false);
    setEditingSource(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this money source?")) {
      setSources(sources.filter((s) => s.id !== id));
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "cash":
        return "💵";
      case "bank":
        return "🏦";
      case "wallet":
        return "📱";
      case "credit":
        return "💳";
      default:
        return "💰";
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case "cash":
        return "#10b981";
      case "bank":
        return "#3b82f6";
      case "wallet":
        return "#8b5cf6";
      case "credit":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const totalBalance = sources.reduce((sum, s) => sum + (s.balance || 0), 0);

  return (
    <>
      <PageHeader>
        <PageTitle>Money Sources</PageTitle>
        <PageSubtitle>
          Manage your payment methods and track available funds
        </PageSubtitle>
      </PageHeader>

      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              color: "#6b7280",
              fontFamily: "Futura",
              marginBottom: "4px",
            }}
          >
            Total Available Balance
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#10b981",
              fontFamily: "Futura",
            }}
          >
            ₹{totalBalance.toLocaleString("en-IN")}
          </div>
        </div>
        <PrimaryButton onClick={() => setShowModal(true)}>
          <span style={{ fontSize: "18px" }}>+</span>
          Add Money Source
        </PrimaryButton>
      </div>

      {sources.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🏦</EmptyIcon>
          <EmptyText>No money sources added</EmptyText>
          <EmptySubtext>
            Add your payment methods to track your funds
          </EmptySubtext>
          <PrimaryButton onClick={() => setShowModal(true)}>
            <span style={{ fontSize: "18px" }}>+</span>
            Add First Source
          </PrimaryButton>
        </EmptyState>
      ) : (
        <Grid>
          {sources.map((source) => (
            <SourceCard key={source.id}>
              <SourceHeader>
                <SourceIcon bgColor={source.color}>{source.icon}</SourceIcon>
                <SourceInfo>
                  <SourceName>{source.name}</SourceName>
                  <SourceType>{source.type.toUpperCase()}</SourceType>
                </SourceInfo>
              </SourceHeader>
              <SourceDetails>
                {source.accountNumber && (
                  <DetailRow>
                    <DetailLabel>Account</DetailLabel>
                    <DetailValue>{source.accountNumber}</DetailValue>
                  </DetailRow>
                )}
                <DetailRow>
                  <DetailLabel>Balance</DetailLabel>
                  <DetailValue style={{ color: "#10b981", fontSize: "18px" }}>
                    ₹{(source.balance || 0).toLocaleString("en-IN")}
                  </DetailValue>
                </DetailRow>
                {source.description && (
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginTop: "8px",
                      fontFamily: "Futura",
                    }}
                  >
                    {source.description}
                  </div>
                )}
              </SourceDetails>
              <ActionButtons>
                <SmallButton
                  onClick={() => {
                    setEditingSource(source);
                    setShowModal(true);
                  }}
                >
                  ✏️ Edit
                </SmallButton>
                <SmallButton onClick={() => handleDelete(source.id)}>
                  🗑️ Delete
                </SmallButton>
              </ActionButtons>
            </SourceCard>
          ))}
        </Grid>
      )}

      {showModal && (
        <Modal
          onClick={() => {
            setShowModal(false);
            setEditingSource(null);
          }}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {editingSource ? "Edit Money Source" : "Add Money Source"}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Source Name *</Label>
                <Input
                  name="name"
                  placeholder="e.g., Main Bank Account"
                  defaultValue={editingSource?.name}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Type *</Label>
                <Select name="type" defaultValue={editingSource?.type} required>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Account</option>
                  <option value="wallet">Digital Wallet</option>
                  <option value="credit">Credit Card</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Account Number (Optional)</Label>
                <Input
                  name="accountNumber"
                  placeholder="****1234"
                  defaultValue={editingSource?.accountNumber}
                />
              </FormGroup>
              <FormGroup>
                <Label>Current Balance *</Label>
                <Input
                  name="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue={editingSource?.balance}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Description (Optional)</Label>
                <Input
                  name="description"
                  placeholder="Add a note about this source"
                  defaultValue={editingSource?.description}
                />
              </FormGroup>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSource(null);
                  }}
                >
                  Cancel
                </Button>
                <PrimaryButton type="submit">
                  {editingSource ? "Update Source" : "Add Source"}
                </PrimaryButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
