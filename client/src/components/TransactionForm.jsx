import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getPeople,
  createPerson,
  getMoneySources,
  createMoneySource,
} from "../api";

const Overlay = styled.div`
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
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-family: "Futura", sans-serif;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-family: "Futura", sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Futura", sans-serif;
`;

const AddNewLink = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  font-family: "Futura", sans-serif;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;
  font-family: "Futura", sans-serif;
  background: #f9fafb;

  &:focus {
    border-color: #1f2937;
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;
  background: #f9fafb;
  font-family: "Futura", sans-serif;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &:focus {
    border-color: #1f2937;
    background-color: white;
  }
`;

const TypeToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const TypeButton = styled.button`
  padding: 14px 20px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Futura", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${(props) => {
    if (!props.active) return "#f9fafb";
    return props.isGiven ? "#10b981" : "#dc2626";
  }};
  color: ${(props) => (props.active ? "white" : "#6b7280")};

  &:first-child {
    border-right: 1px solid #e5e7eb;
  }

  &:hover {
    background: ${(props) => {
      if (!props.active) return "#e5e7eb";
      return props.isGiven ? "#059669" : "#b91c1c";
    }};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Futura", sans-serif;
`;

const SubmitButton = styled(Button)`
  background: #1f2937;
  color: white;

  &:hover {
    background: #374151;
  }
`;

const CancelButton = styled(Button)`
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #f9fafb;
  }
`;

// Mini Modal for adding new person/money source inline
const MiniModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const MiniModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
`;

const MiniModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  font-family: "Futura", sans-serif;
`;

const MiniForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MiniButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const SmallSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: white;
  font-family: "Futura", sans-serif;
  cursor: pointer;

  &:focus {
    border-color: #1f2937;
  }
`;

export default function TransactionForm({
  transaction,
  initialData,
  onSubmit,
  onClose,
}) {
  const data = transaction || initialData;
  const [people, setPeople] = useState([]);
  const [moneySources, setMoneySources] = useState([]);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddMoneySource, setShowAddMoneySource] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState("bank");
  const [newSourceBalance, setNewSourceBalance] = useState("");

  const [formData, setFormData] = useState({
    type: data?.type || "lent",
    person: data?.person || "",
    amount: data?.amount || "",
    description: data?.description || "",
    status: data?.status || "unpaid",
    moneySourceId: data?.moneySourceId || "",
    dueDate: data?.dueDate
      ? new Date(data.dueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchPeople();
    fetchMoneySources();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await getPeople();
      setPeople(res.people || []);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const fetchMoneySources = async () => {
    try {
      const res = await getMoneySources();
      setMoneySources(res.moneySources || []);
    } catch (error) {
      console.error("Error fetching money sources:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.person || !formData.amount) {
      alert("Person and amount are required");
      return;
    }
    onSubmit(formData);
  };

  const handleAddPerson = async () => {
    if (!newPersonName.trim()) {
      alert("Please enter a name");
      return;
    }
    try {
      const res = await createPerson({ name: newPersonName.trim() });
      await fetchPeople();
      setFormData({ ...formData, person: res.person.name });
      setNewPersonName("");
      setShowAddPerson(false);
    } catch (error) {
      console.error("Error adding person:", error);
      alert("Failed to add person");
    }
  };

  const handleAddMoneySource = async () => {
    if (!newSourceName.trim()) {
      alert("Please enter a name");
      return;
    }
    try {
      const res = await createMoneySource({
        name: newSourceName.trim(),
        type: newSourceType,
        balance: parseFloat(newSourceBalance) || 0,
      });
      await fetchMoneySources();
      setFormData({ ...formData, moneySourceId: res.moneySource.id });
      setNewSourceName("");
      setNewSourceBalance("");
      setShowAddMoneySource(false);
    } catch (error) {
      console.error("Error adding money source:", error);
      alert("Failed to add money source");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .replace(/(\d+)/, (match) => {
        const num = parseInt(match);
        const suffix = ["th", "st", "nd", "rd"][
          num % 10 > 3 ? 0 : (num % 100) - (num % 10) !== 10 ? num % 10 : 0
        ];
        return num + suffix;
      });
  };

  const selectedSource = moneySources.find(
    (s) => s.id === formData.moneySourceId
  );

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            {transaction || initialData?.id
              ? "Edit Transaction"
              : "New Transaction"}
          </Title>
          <Subtitle>
            Record money that you've given or taken from someone.
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <LabelRow>
              <Label>Person</Label>
              <AddNewLink type="button" onClick={() => setShowAddPerson(true)}>
                + Add New
              </AddNewLink>
            </LabelRow>
            <Select
              name="person"
              value={formData.person}
              onChange={handleChange}
              required
            >
              <option value="">Select person</option>
              {people.map((person) => (
                <option key={person.id} value={person.name}>
                  {person.name}
                </option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              name="amount"
              placeholder="₹ 0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Transaction Type</Label>
            <TypeToggle>
              <TypeButton
                type="button"
                active={formData.type === "lent"}
                isGiven={true}
                onClick={() => handleTypeChange("lent")}
              >
                <span>↑</span> Given
              </TypeButton>
              <TypeButton
                type="button"
                active={formData.type === "borrowed"}
                isGiven={false}
                onClick={() => handleTypeChange("borrowed")}
              >
                <span>↓</span> Taken
              </TypeButton>
            </TypeToggle>
          </InputGroup>

          <InputGroup>
            <LabelRow>
              <Label>Money Source</Label>
              <AddNewLink
                type="button"
                onClick={() => setShowAddMoneySource(true)}
              >
                + Add New
              </AddNewLink>
            </LabelRow>
            <Select
              name="moneySourceId"
              value={formData.moneySourceId}
              onChange={handleChange}
            >
              <option value="">Select money source</option>
              {moneySources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name} (₹
                  {(source.balance || 0).toLocaleString("en-IN")})
                </option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Date</Label>
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Description</Label>
            <Input
              type="text"
              name="description"
              placeholder="What was this for?"
              value={formData.description}
              onChange={handleChange}
            />
          </InputGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit">
              {transaction || initialData?.id
                ? "Update Transaction"
                : "Add Transaction"}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </Modal>

      {/* Add Person Mini Modal */}
      {showAddPerson && (
        <MiniModal onClick={() => setShowAddPerson(false)}>
          <MiniModalContent onClick={(e) => e.stopPropagation()}>
            <MiniModalTitle>Add New Person</MiniModalTitle>
            <MiniForm>
              <Input
                type="text"
                placeholder="Enter person's name"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                autoFocus
              />
              <MiniButtonGroup>
                <CancelButton
                  type="button"
                  onClick={() => {
                    setShowAddPerson(false);
                    setNewPersonName("");
                  }}
                  style={{ flex: 1 }}
                >
                  Cancel
                </CancelButton>
                <SubmitButton
                  type="button"
                  onClick={handleAddPerson}
                  style={{ flex: 1 }}
                >
                  Add Person
                </SubmitButton>
              </MiniButtonGroup>
            </MiniForm>
          </MiniModalContent>
        </MiniModal>
      )}

      {/* Add Money Source Mini Modal */}
      {showAddMoneySource && (
        <MiniModal onClick={() => setShowAddMoneySource(false)}>
          <MiniModalContent onClick={(e) => e.stopPropagation()}>
            <MiniModalTitle>Add New Money Source</MiniModalTitle>
            <MiniForm>
              <Input
                type="text"
                placeholder="Source name (e.g., Slice, Cash)"
                value={newSourceName}
                onChange={(e) => setNewSourceName(e.target.value)}
                autoFocus
              />
              <SmallSelect
                value={newSourceType}
                onChange={(e) => setNewSourceType(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Account</option>
                <option value="wallet">Digital Wallet</option>
                <option value="credit">Credit Card</option>
              </SmallSelect>
              <Input
                type="number"
                placeholder="Current balance"
                step="0.01"
                value={newSourceBalance}
                onChange={(e) => setNewSourceBalance(e.target.value)}
              />
              <MiniButtonGroup>
                <CancelButton
                  type="button"
                  onClick={() => {
                    setShowAddMoneySource(false);
                    setNewSourceName("");
                    setNewSourceBalance("");
                  }}
                  style={{ flex: 1 }}
                >
                  Cancel
                </CancelButton>
                <SubmitButton
                  type="button"
                  onClick={handleAddMoneySource}
                  style={{ flex: 1 }}
                >
                  Add Source
                </SubmitButton>
              </MiniButtonGroup>
            </MiniForm>
          </MiniModalContent>
        </MiniModal>
      )}
    </Overlay>
  );
}
