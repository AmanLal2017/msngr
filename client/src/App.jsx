import { useContext } from "react";
import { ChatContextProvider } from "./context/ChatContext";
import { AuthContext } from "./context/AuthContext";
import { Pages } from "./Pages";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <ChatContextProvider user={user}>
      <Pages />
    </ChatContextProvider>
  );
}

export default App;
