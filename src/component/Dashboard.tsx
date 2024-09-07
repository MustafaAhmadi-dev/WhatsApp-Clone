import { useConversations } from "../context/ConversationProvider";
import OpenConversation from "./OpenConversation";
import Sidebar from "./Sidebar";

function Dashboard({ id }: { id: string }) {
    const {selectedConversation} = useConversations();

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar id={id} />
      {selectedConversation && <OpenConversation />}
    </div>
  );
}

export default Dashboard;
