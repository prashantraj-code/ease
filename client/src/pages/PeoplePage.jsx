import { useState, useEffect } from "react";
import styled from "styled-components";
import { getPeople, createPerson, updatePerson, deletePerson } from "../api";

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

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

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

  &:focus {
    border-color: #10b981;
  }

  &::placeholder {
    color: #9ca3af;
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const PersonCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const PersonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
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

const PersonContact = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
`;

const PersonNotes = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
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

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-family: "Futura", sans-serif;
  outline: none;
  resize: vertical;
  min-height: 80px;

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

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const fetchPeople = async () => {
    try {
      const res = await getPeople();
      setPeople(res.people || []);
    } catch (error) {
      console.error("Error fetching people:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone")?.trim() || null,
      email: formData.get("email")?.trim() || null,
      notes: formData.get("notes")?.trim() || null,
    };

    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, data);
      } else {
        await createPerson(data);
      }
      fetchPeople();
      setShowModal(false);
      setEditingPerson(null);
    } catch (error) {
      console.error("Error saving person:", error);
      alert(
        "Failed to save person: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      try {
        await deletePerson(id);
        fetchPeople();
      } catch (error) {
        console.error("Error deleting person:", error);
        alert("Failed to delete person");
      }
    }
  };

  // Filter by search
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (loading) {
    return (
      <EmptyState>
        <EmptyText>Loading...</EmptyText>
      </EmptyState>
    );
  }

  return (
    <>
      <PageHeader>
        <PageTitle>People</PageTitle>
        <PageSubtitle>
          Manage people you have financial transactions with
        </PageSubtitle>
      </PageHeader>

      <TopBar>
        <SearchWrapper>
          <SearchInput
            placeholder="Search people by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
        <PrimaryButton onClick={() => setShowModal(true)}>
          <span style={{ fontSize: "18px" }}>+</span>
          Add Person
        </PrimaryButton>
      </TopBar>

      {filteredPeople.length === 0 ? (
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyText>
            {searchQuery ? "No people found" : "No people added yet"}
          </EmptyText>
          <EmptySubtext>
            {searchQuery
              ? "Try adjusting your search"
              : "Add people to start tracking transactions with them"}
          </EmptySubtext>
        </EmptyState>
      ) : (
        <Grid>
          {filteredPeople.map((person) => (
            <PersonCard key={person.id}>
              <PersonHeader>
                <Avatar color={getAvatarColor(person.name)}>
                  {person.name.charAt(0).toUpperCase()}
                </Avatar>
                <PersonInfo>
                  <PersonName>{person.name}</PersonName>
                  {(person.phone || person.email) && (
                    <PersonContact>
                      {person.phone && <span>📞 {person.phone}</span>}
                      {person.phone && person.email && " • "}
                      {person.email && <span>✉️ {person.email}</span>}
                    </PersonContact>
                  )}
                </PersonInfo>
              </PersonHeader>

              {person.notes && <PersonNotes>📝 {person.notes}</PersonNotes>}

              <ActionButtons>
                <SmallButton
                  onClick={() => {
                    setEditingPerson(person);
                    setShowModal(true);
                  }}
                >
                  ✏️ Edit
                </SmallButton>
                <SmallButton onClick={() => handleDelete(person.id)}>
                  🗑️ Delete
                </SmallButton>
              </ActionButtons>
            </PersonCard>
          ))}
        </Grid>
      )}

      {showModal && (
        <Modal
          onClick={() => {
            setShowModal(false);
            setEditingPerson(null);
          }}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {editingPerson ? "Edit Person" : "Add Person"}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name *</Label>
                <Input
                  name="name"
                  placeholder="Enter person's name"
                  defaultValue={editingPerson?.name}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Phone (Optional)</Label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  defaultValue={editingPerson?.phone}
                />
              </FormGroup>
              <FormGroup>
                <Label>Email (Optional)</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  defaultValue={editingPerson?.email}
                />
              </FormGroup>
              <FormGroup>
                <Label>Notes (Optional)</Label>
                <TextArea
                  name="notes"
                  placeholder="Add any notes about this person"
                  defaultValue={editingPerson?.notes}
                />
              </FormGroup>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPerson(null);
                  }}
                >
                  Cancel
                </Button>
                <PrimaryButton type="submit">
                  {editingPerson ? "Update Person" : "Add Person"}
                </PrimaryButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
