import { useState } from "react";
import { Button, Modal, Nav, Tab } from "react-bootstrap";
import Conversations from "./Conversations";
import Contacts from "./Contacts";
import NewConversationModal from "./NewConversationModal";
import NewContactModal from "./NewContactModal";

const CONVERSATIONS_KEY = "conversations";
const CONTACTS_KEY = "contacts";

function Sidebar({ id }: { id: string }) {
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);
  const [modalOpen, setModalOpen] = useState(false);

  const conversationIsOpen = activeKey === CONVERSATIONS_KEY;

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div style={{ width: "250px" }} className="d-flex flex-column">
      <Tab.Container
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k as string)}
      >
        <Nav variant="tabs" className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="border-right overflow-auto flex-grow-1">
          <Tab.Pane eventKey={CONVERSATIONS_KEY}>
            <Conversations />
          </Tab.Pane>

          <Tab.Pane eventKey={CONTACTS_KEY}>
            <Contacts />
          </Tab.Pane>
        </Tab.Content>

        <div className="p-2 border-top border-right small">
          Your ID: <span className="text-muted">{id}</span>
        </div>

        <Button onClick={() => setModalOpen(true)} className="rounded-0">
          New {conversationIsOpen ? "Conversation" : "Contact"}
        </Button>

        <Modal show={modalOpen} onHide={closeModal}>
          {conversationIsOpen ? (
            <NewConversationModal onClose={closeModal} />
          ) : (
            <NewContactModal onClose={closeModal} />
          )}
        </Modal>
      </Tab.Container>
    </div>
  );
}

export default Sidebar;
