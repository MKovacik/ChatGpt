import React from 'react';

function ConversationDetails({ conversation }) {
  if (!conversation) {
    return null;
  }

  return (
    <div>
      <h3>Conversation from {conversation.timestamp}</h3>
      <ul>
        {conversation.messages.map((message, index) => (
          <li key={index}>
            <strong>{message.role}:</strong> {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConversationDetails;
