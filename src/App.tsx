import Dashboard from "./component/Dashboard";
import Login from "./component/Login";
import { SocketProvider } from "./context/SocketProvider";
import { ContactsProvider } from "./context/ContactsProvider";
import { ConversationsProvider } from "./context/ConversationProvider";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [id, setId] = useLocalStorage<string>("id", "");

  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  );

  return id ? dashboard : <Login onIdSubmit={setId} />;
}

export default App;
