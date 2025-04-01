import { useEffect, useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";
import { InboxView } from "./components/InboxView";
import { UsersView } from "./components/UsersView";
import { NotificationsView } from "./components/NotificationsView";
import { Modal } from "./components/Modal";

export const List = () => {
  const { setIsModalOpen } = useContext(ChatContext);
  const location = useLocation();

  useEffect(() => {
    setIsModalOpen(true);
  }, [location]);

  return (
    <Modal>
      <Routes>
        <Route path="/messages" element={<InboxView />} />
        <Route path="/users" element={<UsersView />} />
        <Route path="/notifications" element={<NotificationsView />} />
        <Route path="*" element={<Navigate to="/messages" replace />} />
      </Routes>
    </Modal>
  );
};