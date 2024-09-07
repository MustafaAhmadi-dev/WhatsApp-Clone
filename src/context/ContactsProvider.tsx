import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export interface Contact {
  id: string;
  name: string;
}

interface ContactsContextValue {
  contacts: Contact[];
  createContact: (id: string, name: string) => void;
}

const ContactsContext = createContext<ContactsContextValue | null>(null);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useLocalStorage("contacts", [] as Contact[]);

  function createContact(id: string, name: string) {
    setContacts((prevContacts: Contact[]) => {
      return [...prevContacts, { id, name }];
    });
  }

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);

  if (!context) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }

  return context;
}
