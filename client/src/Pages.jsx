import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ChatLayout from "./ChatLayout"
import Login from "./Login";

export const Pages = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <ChatLayout />;
  }

  return (
    <Login />
  );
}