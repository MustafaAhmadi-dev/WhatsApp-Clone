import { FormEvent, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useContacts } from "../context/ContactsProvider";

function NewContactModal({ onClose }: { onClose: () => void }) {
  const idRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const { createContact } = useContacts();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createContact(idRef.current!.value, nameRef.current!.value);
    onClose();
  }

  return (
    <>
      <Modal.Header closeButton>Create New Contact</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>

          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
}

export default NewContactModal;
