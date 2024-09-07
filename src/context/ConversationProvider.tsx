import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type Contact, useContacts } from "./ContactsProvider";
import { arrayEquality } from "../utils/helper";
import { useSocket } from "./SocketProvider";

type message = {
  text: string;
  id: string;
  sender: string;
  fromMe: string;
};
type Conversation = {
  recipients: Contact[];
  messages: message[];
  selected?: boolean;
};
type ConversationsContextValue = {
  conversations: Conversation[];
  createConversation: (recipientsIds: string[]) => void;
  selectConversationIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedConversation: Conversation;
  sendMessage: (recipients: string[], text: string) => void;
};

const ConversationsContext = createContext<ConversationsContextValue | null>(
  null
);

export function ConversationsProvider({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    [] as Conversation[]
  );
  const { contacts } = useContacts();
  const { socket } = useSocket();

  function createConversation(recipientsIds: string[]) {
    const recipients = recipientsIds.map((recipient: string) => {
      const contact = contacts.find((contact) => {
        return contact.id === recipient;
      });

      const name = (contact && contact.name) || recipient;

      return { id: recipient, name };
    });

    setConversations((prevConversatoins: Conversation[]) => {
      return [...prevConversatoins, { recipients, messages: [] }];
    });
  }

  const addMessageToConversation = useCallback(
    ({
      recipients,
      text,
      sender,
    }: {
      recipients: string[];
      text: string;
      sender: string;
    }) => {
      setConversations((prevConversations: Conversation[]) => {
        let madeChange = false;
        const newMessage = { sender, text };
        const newConversations = prevConversations.map((conversation) => {
          if (
            arrayEquality(
              conversation.recipients.map((r) => r.id),
              recipients
            )
          ) {
            madeChange = true;
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            };
          }

          return conversation;
        });

        if (madeChange) {
          return newConversations;
        } else {
          return [...prevConversations, { recipients, messages: [newMessage] }];
        }
      });
    },
    [setConversations]
  );

  useEffect(() => {
    if (socket == null) return;

    socket.on("receive-message", addMessageToConversation);

    return () => {
      socket.off("receive-message");
    };
  }, [socket, addMessageToConversation]);

  function sendMessage(recipients: string[], text: string) {
    socket?.emit("send-message", { recipients, text });

    addMessageToConversation({ recipients, text, sender: id });
  }

  const formattedConversation = conversations.map(
    (conversation: Conversation, index: number) => {
      const selected = index === selectedConversationIndex;

      const messages = conversation.messages.map((message) => {
        const contact = contacts.find((contact) => {
          return contact.id === message.sender;
        });

        const name = (contact && contact.name) || message.sender;
        const fromMe = id === message.sender;

        return { ...message, sender: name, fromMe };
      });

      return { ...conversation, messages, selected };
    }
  );

  const value = {
    conversations: formattedConversation,
    selectedConversation: formattedConversation[selectedConversationIndex],
    selectConversationIndex: setSelectedConversationIndex,
    createConversation,
    sendMessage,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);

  if (!context) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }

  return context;
}
