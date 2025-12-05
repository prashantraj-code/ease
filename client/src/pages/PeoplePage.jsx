import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { getPeople, createPerson, updatePerson, deletePerson } from "../api";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// Toast notification
const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2000;
`;

const Toast = styled.div`
  background: ${(props) => (props.type === "error" ? "#fee2e2" : "#d1fae5")};
  color: ${(props) => (props.type === "error" ? "#dc2626" : "#059669")};
  padding: 12px 20px;
  border-radius: 8px;
  font-family: "Futura", sans-serif;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.2s ease-out;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 26px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 600px) {
    max-width: none;
  }

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

  &:disabled {
    opacity: 0.6;
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

  &:hover:not(:disabled) {
    background: #059669;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const PersonCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const PersonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  min-height: 50px;
`;

const PersonLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${(props) => props.color || "#10b981"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  font-family: "Futura", sans-serif;
  flex-shrink: 0;
`;

const PersonName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  font-family: "Futura", sans-serif;
`;

const InfoButtonWrapper = styled.div`
  position: relative;
`;

const InfoButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-family: "Futura", sans-serif;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #374151;
  }
`;

const InfoPopover = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  padding: 16px;
  min-width: 240px;
  max-width: 320px;
  width: max-content;
  z-index: 100;
  animation: ${fadeIn} 0.15s ease-out;

  @media (max-width: 600px) {
    right: auto;
    left: 0;
  }

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    right: 12px;
    width: 12px;
    height: 12px;
    background: white;
    border-left: 1px solid #e5e7eb;
    border-top: 1px solid #e5e7eb;
    transform: rotate(45deg);

    @media (max-width: 600px) {
      right: auto;
      left: 12px;
    }
  }
`;

const PopoverSection = styled.div`
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const PopoverLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  font-family: "Futura", sans-serif;
`;

const PopoverValue = styled.div`
  font-size: 14px;
  color: #374151;
  font-family: "Futura", sans-serif;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  word-break: break-word;
  line-height: 1.4;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }

  a {
    color: #3b82f6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const PopoverRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
`;

const PopoverStatLabel = styled.span`
  font-size: 13px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
`;

const PopoverStatValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.color || "#374151"};
  font-family: "Futura", sans-serif;
`;

const PopoverNoContact = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-style: italic;
  font-family: "Futura", sans-serif;
`;

const BalanceDisplay = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.color || "#1f2937"};
  font-family: "Futura", sans-serif;
  text-align: center;
  padding: 20px 0;
`;

const CardActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  padding: 10px 8px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Futura", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &.delete:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
  }
`;

const ActionButtonVertical = styled(ActionButton)`
  flex-direction: column;
  gap: 2px;
  padding: 8px;

  .emoji {
    font-size: 16px;
  }

  .text {
    font-size: 12px;
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
  border: 1px solid ${(props) => (props.error ? "#ef4444" : "#e5e7eb")};
  border-radius: 8px;
  font-size: 15px;
  font-family: "Futura", sans-serif;
  outline: none;

  &:focus {
    border-color: ${(props) => (props.error ? "#ef4444" : "#10b981")};
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

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
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
  margin-bottom: 24px;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #ef4444;
  font-family: "Futura", sans-serif;
`;

export default function PeoplePage() {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [activePopover, setActivePopover] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null);

  // Form state (controlled inputs to fix defaultValue issue)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActivePopover(null);
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setActivePopover(null);
      }
    };

    if (activePopover) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [activePopover]);

  // Focus trap for modal
  useEffect(() => {
    if (showModal && firstInputRef.current) {
      firstInputRef.current.focus();
    }

    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showModal]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchPeople = useCallback(async () => {
    try {
      setFetchError(null);
      const res = await getPeople();
      setPeople(res.people || []);
    } catch (error) {
      console.error("Error fetching people:", error);
      setFetchError("Failed to load people. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const openModal = (person = null) => {
    setEditingPerson(person);
    setFormData({
      name: person?.name || "",
      phone: person?.phone || "",
      email: person?.email || "",
      notes: person?.notes || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPerson(null);
    setFormData({ name: "", phone: "", email: "", notes: "" });
    setFormError("");
  };

  const validateForm = () => {
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setFormError("Name is required");
      return false;
    }

    // Check for duplicate names (case-insensitive)
    const isDuplicate = people.some(
      (p) =>
        p.name.toLowerCase() === trimmedName.toLowerCase() &&
        p.id !== editingPerson?.id
    );

    if (isDuplicate) {
      setFormError("A person with this name already exists");
      return false;
    }

    // Validate email format if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setFormError("Please enter a valid email address");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    const data = {
      name: formData.name.trim(),
      phone: formData.phone.trim() || null,
      email: formData.email.trim() || null,
      notes: formData.notes.trim() || null,
    };

    setFormLoading(true);

    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, data);
        showToast(`${data.name} updated successfully`);
      } else {
        await createPerson(data);
        showToast(`${data.name} added successfully`);
      }
      fetchPeople();
      closeModal();
    } catch (error) {
      console.error("Error saving person:", error);
      setFormError(
        error.response?.data?.message ||
          "Failed to save person. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      try {
        await deletePerson(person.id);
        showToast(`${person.name} deleted successfully`);
        fetchPeople();
      } catch (error) {
        console.error("Error deleting person:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to delete person";
        showToast(errorMessage, "error");
      }
    }
  };

  // Filter by debounced search
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Get consistent color for avatar based on name
  const getAvatarColor = (name) => {
    const colors = [
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
    ];
    // Use sum of char codes for better distribution
    const charSum = name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  if (loading) {
    return (
      <EmptyState>
        <Spinner
          style={{ width: 32, height: 32, borderWidth: 3, color: "#10b981" }}
        />
        <EmptyText style={{ marginTop: 16 }}>Loading...</EmptyText>
      </EmptyState>
    );
  }

  if (fetchError) {
    return (
      <ErrorState>
        <EmptyIcon>⚠️</EmptyIcon>
        <EmptyText style={{ color: "#ef4444" }}>{fetchError}</EmptyText>
        <PrimaryButton onClick={fetchPeople} style={{ margin: "0 auto" }}>
          Try Again
        </PrimaryButton>
      </ErrorState>
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
        <PrimaryButton onClick={() => openModal()}>
          <span style={{ fontSize: "18px" }}>+</span>
          Add Person
        </PrimaryButton>
      </TopBar>

      {filteredPeople.length === 0 ? (
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyText>
            {debouncedSearch ? "No people found" : "No people added yet"}
          </EmptyText>
          <EmptySubtext>
            {debouncedSearch
              ? "Try adjusting your search"
              : "Add people to start tracking transactions with them"}
          </EmptySubtext>
          {!debouncedSearch && (
            <PrimaryButton onClick={() => openModal()}>
              <span style={{ fontSize: "18px" }}>+</span>
              Add Your First Person
            </PrimaryButton>
          )}
        </EmptyState>
      ) : (
        <Grid>
          {filteredPeople.map((person) => {
            const totalLent = person.totalLent || 0;
            const totalBorrowed = person.totalBorrowed || 0;
            const netBalance = person.netBalance || 0;
            const balanceColor =
              netBalance > 0
                ? "#10b981"
                : netBalance < 0
                ? "#ef4444"
                : "#6b7280";

            return (
              <PersonCard key={person.id}>
                <PersonHeader>
                  <PersonLeft>
                    <Avatar color={getAvatarColor(person.name)}>
                      {person.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <PersonName>{person.name}</PersonName>
                  </PersonLeft>
                  <InfoButtonWrapper>
                    <InfoButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePopover(
                          activePopover === person.id ? null : person.id
                        );
                      }}
                      aria-label="View details"
                      aria-expanded={activePopover === person.id}
                    >
                      i
                    </InfoButton>
                    {activePopover === person.id && (
                      <InfoPopover
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-label={`Details for ${person.name}`}
                      >
                        <PopoverSection>
                          <PopoverLabel>Contact</PopoverLabel>
                          {person.phone || person.email ? (
                            <>
                              {person.phone && (
                                <PopoverValue>
                                  📞{" "}
                                  <a href={`tel:${person.phone}`}>
                                    {person.phone}
                                  </a>
                                </PopoverValue>
                              )}
                              {person.email && (
                                <PopoverValue>
                                  ✉️{" "}
                                  <a href={`mailto:${person.email}`}>
                                    {person.email}
                                  </a>
                                </PopoverValue>
                              )}
                            </>
                          ) : (
                            <PopoverNoContact>
                              No contact info added
                            </PopoverNoContact>
                          )}
                        </PopoverSection>
                        <PopoverSection>
                          <PopoverLabel>Transaction Summary</PopoverLabel>
                          <PopoverRow>
                            <PopoverStatLabel>Given</PopoverStatLabel>
                            <PopoverStatValue color="#ef4444">
                              ₹{totalLent.toLocaleString()}
                            </PopoverStatValue>
                          </PopoverRow>
                          <PopoverRow>
                            <PopoverStatLabel>Taken</PopoverStatLabel>
                            <PopoverStatValue color="#10b981">
                              ₹{totalBorrowed.toLocaleString()}
                            </PopoverStatValue>
                          </PopoverRow>
                          <PopoverRow>
                            <PopoverStatLabel>Net Balance</PopoverStatLabel>
                            <PopoverStatValue color={balanceColor}>
                              {netBalance >= 0 ? "+" : "-"}₹
                              {Math.abs(netBalance).toLocaleString()}
                            </PopoverStatValue>
                          </PopoverRow>
                        </PopoverSection>
                        {person.notes && (
                          <PopoverSection>
                            <PopoverLabel>Notes</PopoverLabel>
                            <PopoverValue
                              style={{ fontSize: "12px", color: "#6b7280" }}
                            >
                              {person.notes}
                            </PopoverValue>
                          </PopoverSection>
                        )}
                      </InfoPopover>
                    )}
                  </InfoButtonWrapper>
                </PersonHeader>

                <BalanceDisplay color={balanceColor}>
                  {netBalance === 0
                    ? "₹0"
                    : `${netBalance > 0 ? "+" : "-"}₹${Math.abs(
                        netBalance
                      ).toLocaleString()}`}
                </BalanceDisplay>

                <CardActions>
                  <ActionButton
                    onClick={() =>
                      navigate(
                        `/transactions?person=${encodeURIComponent(
                          person.name
                        )}`
                      )
                    }
                  >
                    📊 View
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      navigate(
                        `/transactions?person=${encodeURIComponent(
                          person.name
                        )}&addNew=true`
                      )
                    }
                  >
                    ➕ Add
                  </ActionButton>
                  <ActionButtonVertical onClick={() => openModal(person)}>
                    <span className="emoji">✏️</span>
                    <span className="text">Edit</span>
                  </ActionButtonVertical>
                  <ActionButtonVertical
                    className="delete"
                    onClick={() => handleDelete(person)}
                  >
                    <span className="emoji">🗑️</span>
                    <span className="text">Delete</span>
                  </ActionButtonVertical>
                </CardActions>
              </PersonCard>
            );
          })}
        </Grid>
      )}

      {showModal && (
        <Modal
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <ModalContent onClick={(e) => e.stopPropagation()} ref={modalRef}>
            <ModalTitle id="modal-title">
              {editingPerson ? "Edit Person" : "Add Person"}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Name *</Label>
                <Input
                  ref={firstInputRef}
                  id="name"
                  name="name"
                  placeholder="Enter person's name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={formError && formError.includes("name")}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={formError && formError.includes("email")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  placeholder="Add any notes about this person"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </FormGroup>

              {formError && <ErrorText>{formError}</ErrorText>}

              <ButtonGroup>
                <Button
                  type="button"
                  onClick={closeModal}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <PrimaryButton type="submit" disabled={formLoading}>
                  {formLoading && <Spinner />}
                  {editingPerson ? "Update Person" : "Add Person"}
                </PrimaryButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {toast && (
        <ToastContainer>
          <Toast type={toast.type}>
            {toast.type === "error" ? "❌" : "✅"} {toast.message}
          </Toast>
        </ToastContainer>
      )}
    </>
  );
}
