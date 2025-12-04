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

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;

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
  width: 300px;

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

const NoteCard = styled.div`
  background: ${(props) => props.color || "#fff"};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const NoteTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  font-family: "Futura", sans-serif;
  flex: 1;
`;

const NoteActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;

  ${NoteCard}:hover & {
    opacity: 1;
  }
`;

const IconButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const NoteContent = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 12px 0;
  font-family: "Futura", sans-serif;
  word-wrap: break-word;
`;

const NoteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const NoteDate = styled.div`
  font-size: 12px;
  color: #9ca3af;
  font-family: "Futura", sans-serif;
`;

const NoteTag = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  font-family: "Futura", sans-serif;
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

const Textarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-family: "Futura", sans-serif;
  outline: none;
  min-height: 120px;
  resize: vertical;

  &:focus {
    border-color: #10b981;
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 3px solid ${(props) => (props.selected ? "#10b981" : "transparent")};
  background: ${(props) => props.color};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
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

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("#fef3c7");

  const colors = [
    "#fef3c7", // yellow
    "#dbeafe", // blue
    "#fce7f3", // pink
    "#d1fae5", // green
    "#e0e7ff", // indigo
    "#fed7aa", // orange
    "#f3e8ff", // purple
    "#ffffff", // white
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newNote = {
      id: editingNote?.id || Date.now(),
      title: formData.get("title"),
      content: formData.get("content"),
      tag: formData.get("tag"),
      color: selectedColor,
      date: editingNote?.date || new Date().toISOString(),
    };

    if (editingNote) {
      setNotes(notes.map((n) => (n.id === editingNote.id ? newNote : n)));
    } else {
      setNotes([newNote, ...notes]);
    }

    setShowModal(false);
    setEditingNote(null);
    setSelectedColor("#fef3c7");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setSelectedColor(note.color);
    setShowModal(true);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader>
        <PageTitle>Notes & Reminders</PageTitle>
        <PageSubtitle>
          Keep track of important information about your transactions
        </PageSubtitle>
      </PageHeader>

      <ControlBar>
        <SearchWrapper>
          <SearchInput
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
        <PrimaryButton onClick={() => setShowModal(true)}>
          <span style={{ fontSize: "18px" }}>+</span>
          Add Note
        </PrimaryButton>
      </ControlBar>

      {filteredNotes.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyText>
            {searchQuery ? "No notes found" : "No notes yet"}
          </EmptyText>
          <EmptySubtext>
            {searchQuery
              ? "Try adjusting your search"
              : "Create notes to remember important transaction details"}
          </EmptySubtext>
        </EmptyState>
      ) : (
        <Grid>
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} color={note.color}>
              <NoteHeader>
                <NoteTitle>{note.title}</NoteTitle>
                <NoteActions>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                  >
                    ✏️
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                  >
                    🗑️
                  </IconButton>
                </NoteActions>
              </NoteHeader>
              <NoteContent>{note.content}</NoteContent>
              <NoteFooter>
                <NoteDate>
                  {new Date(note.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </NoteDate>
                {note.tag && <NoteTag>{note.tag}</NoteTag>}
              </NoteFooter>
            </NoteCard>
          ))}
        </Grid>
      )}

      {showModal && (
        <Modal
          onClick={() => {
            setShowModal(false);
            setEditingNote(null);
            setSelectedColor("#fef3c7");
          }}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingNote ? "Edit Note" : "Create Note"}</ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Title *</Label>
                <Input
                  name="title"
                  placeholder="Enter note title"
                  defaultValue={editingNote?.title}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Content *</Label>
                <Textarea
                  name="content"
                  placeholder="Write your note here..."
                  defaultValue={editingNote?.content}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Tag (Optional)</Label>
                <Input
                  name="tag"
                  placeholder="e.g., Reminder, Goal, Important"
                  defaultValue={editingNote?.tag}
                />
              </FormGroup>
              <FormGroup>
                <Label>Color</Label>
                <ColorPicker>
                  {colors.map((color) => (
                    <ColorOption
                      key={color}
                      type="button"
                      color={color}
                      selected={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </ColorPicker>
              </FormGroup>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingNote(null);
                    setSelectedColor("#fef3c7");
                  }}
                >
                  Cancel
                </Button>
                <PrimaryButton type="submit">
                  {editingNote ? "Update Note" : "Create Note"}
                </PrimaryButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
