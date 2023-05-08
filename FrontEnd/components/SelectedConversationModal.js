import React from "react";
import Modal from "./Modal";
import { MessageList } from "../App";

function SelectedConversationModal({ isOpen, onClose, messages }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {messages && <MessageList messages={messages} />}
    </Modal>
  );
}

export default SelectedConversationModal;
