import { useState, useEffect, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
  getMoneySources,
  createMoneySource,
  updateMoneySource,
  deleteMoneySource,
} from "../api";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PageHeaderLeft = styled.div``;

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

const TotalBalanceSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TotalLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
  margin-bottom: 4px;
`;

const TotalAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.color || "#10b981"};
  font-family: "Futura", sans-serif;

  @media (max-width: 768px) {
    font-size: 26px;
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

const SourceCard = styled.div`
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

const SourceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  min-height: 50px;
`;

const SourceLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const SourceIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${(props) => props.color || "#10b981"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const SourceInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SourceName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  font-family: "Futura", sans-serif;
`;

const SourceType = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-family: "Futura", sans-serif;
  text-transform: capitalize;
  margin-top: 2px;
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
  min-width: 220px;
  max-width: 300px;
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
  word-break: break-word;
  line-height: 1.4;
`;

const PopoverNoDescription = styled.div`
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
  gap: 6px;
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

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-family: "Futura", sans-serif;
  outline: none;
  cursor: pointer;
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

export default function MoneySourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [activePopover, setActivePopover] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "bank",
    balance: "",
    description: "",
  });

  const firstInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = () => setActivePopover(null);
    const handleEscape = (e) => {
      if (e.key === "Escape") setActivePopover(null);
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

  useEffect(() => {
    if (showModal && firstInputRef.current) firstInputRef.current.focus();
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) closeModal();
    };
    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showModal]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchSources = useCallback(async () => {
    try {
      setFetchError(null);
      const res = await getMoneySources();
      setSources(res.moneySources || []);
    } catch (error) {
      console.error("Error fetching money sources:", error);
      setFetchError("Failed to load money sources. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const openModal = (source = null) => {
    setEditingSource(source);
    setFormData({
      name: source?.name || "",
      type: source?.type || "bank",
      balance: source?.balance?.toString() || "",
      description: source?.description || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSource(null);
    setFormData({ name: "", type: "bank", balance: "", description: "" });
    setFormError("");
  };

  const validateForm = () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setFormError("Name is required");
      return false;
    }
    const isDuplicate = sources.some(
      (s) =>
        s.name.toLowerCase() === trimmedName.toLowerCase() &&
        s.id !== editingSource?.id
    );
    if (isDuplicate) {
      setFormError("A money source with this name already exists");
      return false;
    }
    if (!formData.balance || isNaN(parseFloat(formData.balance))) {
      setFormError("Please enter a valid balance");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validateForm()) return;

    const data = {
      name: formData.name.trim(),
      type: formData.type,
      balance: parseFloat(formData.balance),
      description: formData.description.trim() || null,
    };

    setFormLoading(true);
    try {
      if (editingSource) {
        await updateMoneySource(editingSource.id, data);
        showToast(`${data.name} updated successfully`);
      } else {
        await createMoneySource(data);
        showToast(`${data.name} added successfully`);
      }
      fetchSources();
      closeModal();
    } catch (error) {
      console.error("Error saving money source:", error);
      setFormError(
        error.response?.data?.message ||
          "Failed to save money source. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (source) => {
    if (window.confirm(`Are you sure you want to delete ${source.name}?`)) {
      try {
        await deleteMoneySource(source.id);
        showToast(`${source.name} deleted successfully`);
        fetchSources();
      } catch (error) {
        console.error("Error deleting money source:", error);
        showToast(
          error.response?.data?.message || "Failed to delete money source",
          "error"
        );
      }
    }
  };

  const filteredSources = sources.filter((source) =>
    source.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

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

  const getTypeLabel = (type) => {
    switch (type) {
      case "cash":
        return "Cash";
      case "bank":
        return "Bank Account";
      case "wallet":
        return "Digital Wallet";
      case "credit":
        return "Credit Card";
      default:
        return type;
    }
  };

  const totalBalance = sources.reduce((sum, s) => sum + (s.balance || 0), 0);

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
        <PrimaryButton onClick={fetchSources} style={{ margin: "0 auto" }}>
          Try Again
        </PrimaryButton>
      </ErrorState>
    );
  }

  return (
    <>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>Money Sources</PageTitle>
          <PageSubtitle>
            Manage your payment methods and track available funds
          </PageSubtitle>
        </PageHeaderLeft>
        <TotalBalanceSection>
          <TotalLabel>Total Available Balance</TotalLabel>
          <TotalAmount color={totalBalance >= 0 ? "#10b981" : "#dc2626"}>
            ₹{totalBalance.toLocaleString("en-IN")}
          </TotalAmount>
        </TotalBalanceSection>
      </PageHeader>

      <TopBar>
        <SearchWrapper>
          <SearchInput
            placeholder="Search money sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
        <PrimaryButton onClick={() => openModal()}>
          <span style={{ fontSize: "18px" }}>+</span>
          Add Money Source
        </PrimaryButton>
      </TopBar>

      {filteredSources.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🏦</EmptyIcon>
          <EmptyText>
            {debouncedSearch
              ? "No money sources found"
              : "No money sources added yet"}
          </EmptyText>
          <EmptySubtext>
            {debouncedSearch
              ? "Try adjusting your search"
              : "Add your payment methods to start tracking your funds"}
          </EmptySubtext>
          {!debouncedSearch && (
            <PrimaryButton onClick={() => openModal()}>
              <span style={{ fontSize: "18px" }}>+</span>
              Add Your First Money Source
            </PrimaryButton>
          )}
        </EmptyState>
      ) : (
        <Grid>
          {filteredSources.map((source) => {
            const balance = source.balance || 0;
            const balanceColor = balance >= 0 ? "#10b981" : "#dc2626";

            return (
              <SourceCard key={source.id}>
                <SourceHeader>
                  <SourceLeft>
                    <SourceIcon color={getColorForType(source.type)}>
                      {getIconForType(source.type)}
                    </SourceIcon>
                    <SourceInfo>
                      <SourceName>{source.name}</SourceName>
                      <SourceType>{getTypeLabel(source.type)}</SourceType>
                    </SourceInfo>
                  </SourceLeft>
                  <InfoButtonWrapper>
                    <InfoButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePopover(
                          activePopover === source.id ? null : source.id
                        );
                      }}
                      aria-label="View details"
                      aria-expanded={activePopover === source.id}
                    >
                      i
                    </InfoButton>
                    {activePopover === source.id && (
                      <InfoPopover
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-label={`Details for ${source.name}`}
                      >
                        <PopoverSection>
                          <PopoverLabel>Type</PopoverLabel>
                          <PopoverValue>
                            {getIconForType(source.type)}{" "}
                            {getTypeLabel(source.type)}
                          </PopoverValue>
                        </PopoverSection>
                        <PopoverSection>
                          <PopoverLabel>Description</PopoverLabel>
                          {source.description ? (
                            <PopoverValue>{source.description}</PopoverValue>
                          ) : (
                            <PopoverNoDescription>
                              No description added
                            </PopoverNoDescription>
                          )}
                        </PopoverSection>
                        <PopoverSection>
                          <PopoverLabel>Created</PopoverLabel>
                          <PopoverValue>
                            {new Date(source.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </PopoverValue>
                        </PopoverSection>
                      </InfoPopover>
                    )}
                  </InfoButtonWrapper>
                </SourceHeader>

                <BalanceDisplay color={balanceColor}>
                  ₹{balance.toLocaleString("en-IN")}
                </BalanceDisplay>

                <CardActions>
                  <ActionButton onClick={() => openModal(source)}>
                    ✏️ Edit
                  </ActionButton>
                  <ActionButton
                    className="delete"
                    onClick={() => handleDelete(source)}
                  >
                    🗑️ Delete
                  </ActionButton>
                </CardActions>
              </SourceCard>
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
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle id="modal-title">
              {editingSource ? "Edit Money Source" : "Add Money Source"}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Source Name *</Label>
                <Input
                  ref={firstInputRef}
                  id="name"
                  name="name"
                  placeholder="e.g., Main Bank Account, Slice, Cash"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={formError && formError.includes("name")}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="type">Type *</Label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="cash">💵 Cash</option>
                  <option value="bank">🏦 Bank Account</option>
                  <option value="wallet">📱 Digital Wallet</option>
                  <option value="credit">💳 Credit Card</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="balance">Current Balance *</Label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                  error={formError && formError.includes("balance")}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="description">Description (Optional)</Label>
                <TextArea
                  id="description"
                  name="description"
                  placeholder="Add a note about this money source"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                  {editingSource ? "Update Source" : "Add Source"}
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
