import { FaUser } from 'react-icons/fa';
import { AiOutlineDownload, AiOutlineUpload, AiOutlineDesktop, AiFillDelete, AiFillEdit, AiFillSave, AiOutlineCopy } from 'react-icons/ai';
import { MdChat } from 'react-icons/md'
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { v4 as uuid } from 'uuid';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import AutoResizingTextarea from './components/AutoResizingTextarea';


function App() {
  const loadPreviousConversations = () => {
    const storedConversations = localStorage.getItem("previousConversations");
    return storedConversations ? JSON.parse(storedConversations) : [];
  };
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState(loadPreviousConversations());
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationIdCounter] = useState(0);
  const [currentConversationId, setCurrentConversationId] = useState(conversationIdCounter);
  const handleNewConversation = () => { setMessages([]); setCurrentConversationId(uuid()); };
  const handleChange = (e) => { setInput(e.target.value); };
  const [showConversationList, setShowConversationList] = useState(true);
  const toggleConversationList = () => {
    setShowConversationList((prevState) => !prevState);
  };
  const handleConversationClick = (index) => {
    if (index === -1) {
      setSelectedConversation({ id: currentConversationId, messages: messages });
    } else {
      setSelectedConversation(conversations[index]);
      setMessages(conversations[index].messages);
      setCurrentConversationId(conversations[index].id);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("Your Backend URL", {
        user_input: input,
        conversation: messages.length === 0 ? undefined : messages,
      }
      );
      /*,{headers:
        {
          'Origin':window.location.origin
        }
        ,});*/
      if (response.data && Array.isArray(response.data)) {
        const newMessage = response.data[response.data.length - 1];
        const updatedMessages = [
          ...messages,
          { role: "user", content: input },
          newMessage,
        ];
        setMessages(updatedMessages);
        const updatedConversations = [...conversations];
        const currentConversationIndex = conversations.findIndex(
          (conv) => conv.id === currentConversationId
        );
        if (currentConversationIndex >= 0) {
          updatedConversations[currentConversationIndex] = {
            id: currentConversationId,
            name: conversations[currentConversationIndex].name,
            messages: updatedMessages,
          };
        } else {
          if (messages.length === 0) {
            updatedConversations.unshift({
              id: currentConversationId,
              messages: updatedMessages,
            });
          }
        }
        setConversations(updatedConversations);
        localStorage.setItem(
          "previousConversations",
          JSON.stringify(updatedConversations)
        );
      }
    } catch (error) {
      console.error(error);
      setMessages([
        ...messages,
        { role: "assistant", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };
  useEffect(() => {
    const savedConversations = localStorage.getItem("previousConversations");
    if (savedConversations) {
      const parsedConversations = JSON.parse(savedConversations);
      setConversations(parsedConversations);
    }
    setMessages([]);
    setCurrentConversationId(uuid());
  }, []);
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);
  return (
    <div>
      <button
        className="toggle-conversation-list"
        onClick={toggleConversationList}
        title="Toggle conversation list"
      >
        <MdChat size={24} />
      </button>
      <div className="main-container">
        {showConversationList && (
          <div className="conversation-list-container">
            <ConversationsList
              conversations={conversations}
              onSelectConversation={handleConversationClick}
              setConversations={setConversations}
              currentConversationId={currentConversationId}
              selectedConversationId={selectedConversation ? selectedConversation.id : null}
            />
          </div>
        )}

        <div className="message-list-container">
          <div className="container">
            <header className="header">
              <h1>DT instance on Azure </h1>
            </header>
            <main>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="input">Your question:</label>
                  <AutoResizingTextarea
                    id="input"
                    className="form-control"
                    value={input}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </form>
              <MessageList messages={messages} />
            </main>
          </div>
          <div className="new-conversation-button">
            <button className="new-conversation-button" onClick={handleNewConversation}>
              New Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
const copyToClipboard = async (text, event) => {
  event.preventDefault();
  try {
    await navigator.clipboard.writeText(text);
    console.log("Code copied to clipboard");
  } catch (err) {
    console.error("Failed to copy code: ", err);
  }
};
const getCodeInfo = (content) => {
  const regex = /^```(\w+)?\n([\s\S]+)```$/;
  const match = content.match(regex);
  if (match) {
    return {
      language: match[1] || '',
      code: match[2],
    };
  }
  return null;
};

export function MessageList({ messages }) {
  const renderContent = (content, role) => {
    const regex = /(```(?:\w+\n)?[\s\S]*?```)/gm;
    const contentParts = content.split(regex);

    return contentParts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeInfo = getCodeInfo(part);
        const code = codeInfo.code;

        return (

          <div key={index} className="code-block">
            {codeInfo.language && <div className="code-language">{codeInfo.language}</div>}
            <button
              className="copy-code-btn"
              title="Copy code"
              onClick={(event) => copyToClipboard(code, event)}
            >
              <AiOutlineCopy />
            </button>

            <SyntaxHighlighter
              language={codeInfo.language}
              style={docco}
              customStyle={{
                padding: '1em',
                borderRadius: '4px',
                backgroundColor: role === 'user' ? '#f8f9fa' : '#e9ecef', // Adjust the background color based on the role
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        return <p key={index}>{part}</p>;
      }
    });
  };
  return (
    <div className="message-list">
      <ul>
        {messages.slice().reverse().map((message, index) => (
          <li key={index}>
            <div className="icon-container">
              {message.role === "user" ? (
                <FaUser className="icon" />
              ) : (
                <AiOutlineDesktop className="icon" />
              )}
            </div>
            <div className={message.role === "user" ? "user-message" : "chatgpt-message"}>
              {renderContent(message.content, message.role)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConversationsList({ conversations, onSelectConversation, setConversations, currentConversationId, selectedConversationId }) {
  const [isRenaming, setIsRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const handleDeleteConversation = (index) => {
    const updatedConversations = conversations.filter((_, i) => i !== index);
    setConversations(updatedConversations);
    localStorage.setItem("previousConversations", JSON.stringify(updatedConversations));
  };
  const handleRenameConversation = (index) => {
    setIsRenaming(index);
    setRenameValue(conversations[index].name);
  };
  const handleSaveRename = (index) => {
    if (conversations.some((conv) => conv.name === renameValue)) {
      alert('Name already exists. Please choose a different name.');
      return;
    }
    const updatedConversations = [...conversations];
    updatedConversations[index].name = renameValue;
    setConversations(updatedConversations);
    localStorage.setItem("previousConversations", JSON.stringify(updatedConversations));
    setIsRenaming(null);
    setRenameValue('');
  };
  const handleRenameChange = (e) => {
    setRenameValue(e.target.value);
  };
  const exportConversations = () => {
    const data = JSON.stringify(conversations);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conversations.json';
    link.click();
  };
  const importConversations = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      try {
        const importedConversations = JSON.parse(data);
        setConversations(importedConversations);
      } catch (error) {
        console.error('Error importing conversations:', error);
        alert('Invalid conversation file');
      }
    };
    reader.readAsText(file);
  };
  return (
    <div className="conversations-list">
      <h3 className="hisoty-title">History</h3>
      <ul>
        {conversations.map((conversation, index) => (
          <li key={index}>
            <div
              className={`conversation-row ${conversation.id === selectedConversationId ? 'selected-conversation' : ''}`}
              onClick={() => onSelectConversation(index)}
            >
              {isRenaming === index ? (
                <>
                  <input
                    type="text"
                    value={renameValue}
                    onChange={handleRenameChange}
                    className="rename-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                </>
              ) : (
                <span>{conversation.name || `Conversation ${conversation.id}`}</span>
              )}
              {isRenaming === index ? (
                <AiFillSave
                  className="save-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveRename(index);
                  }}
                />) : (
                <span className="action-icons">
                  <AiFillEdit
                    className="edit-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameConversation(index);
                    }}
                  />
                  <AiFillDelete
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(index);
                    }}
                  />
                </span>
                )}
            </div>
          </li>
        ))}
      </ul>
      <div className="conversation-import-export">
        <label htmlFor="import-conversations" className="import-conversations">
          <AiOutlineUpload />
          <span className="import-export-text">Import</span>
          <input
            type="file"
            id="import-conversations"
            onChange={importConversations}
            accept=".json"
            style={{ display: 'none' }}
          />
        </label>
        <button className="export-conversations" onClick={exportConversations}>
          <AiOutlineDownload />
          <span className="import-export-text">Export</span>
        </button>
      </div>
    </div>
  );
}

export default App;
