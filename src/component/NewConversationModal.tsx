import { FormEvent, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useContacts } from "../context/ContactsProvider";
import { useConversations } from "../context/ConversationProvider";

function NewConversationModal({ onClose }: { onClose: () => void }) {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const { createConversation } = useConversations();
  const { contacts } = useContacts();

  function handleCheckboxChange(contactId: string) {
    setSelectedContactIds((prevSelectedContactId) => {
      if (prevSelectedContactId.includes(contactId)) {
        return prevSelectedContactId.filter((prevId) => prevId !== contactId);
      } else {
        return [...prevSelectedContactId, contactId];
      }
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createConversation(selectedContactIds);
    onClose();
  }

  return (
    <>
      <Modal.Header closeButton>Create New Conversaion</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map((contact) => (
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
                type="checkbox"
                label={contact.name}
                value={selectedContactIds.includes(contact.id) ? "true" : ""}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            </Form.Group>
          ))}

          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
}

export default NewConversationModal;
