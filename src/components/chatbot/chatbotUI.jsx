import React, { useState, useEffect, useRef } from 'react';
import './chatbotUI.css'; 
import { IoSendSharp } from "react-icons/io5"; 

import { API_KEY } from "../../config.js"

const systemMessage = {
  role: "system",
  content: "You are a customer support chatbot, providing answers ONLY to questions relating to the Hoobank's services, questions that are not related to hoobanks services should be answered and declined shortly, which include:\n" +
           "- Billing & invoicing\n" +
           "- Over 3,800 active users\n" +
           "- Over 230 companies involved and trusted\n" +
           "- 20 % discount for 1 month for new accounts\n" +
           "- Rewards The best credit cards offer some tantalizing combinations of promotions and prizes\n" +
           "- 100% Secured We take proactive steps make sure your information and transactions are secure.\n" +
           "- Balance Transfer A balance transfer credit card can save you a lot of money in interest charges.\n" +
           "- Customer service number +399888299 if needed.\n" +
           "- Over $230 million in transactions"
};

function ChatbotUI({ isOpen }) {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm HooBanks customer service bot! Ask me anything about our services!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef(null);

  const [isSending, setIsSending] = useState(false);

  const handleSend = async (message) => {
    if (!message.trim() || isSending) {
      return;
    }

    setIsSending(true);

    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);

    setIsSending(false);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages,
      ],
      temperature: 0.3,
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT"
          },
        ]);
        setIsTyping(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessages([
          ...chatMessages,
          {
            message: "An error occurred. Please try again later.",
            sender: "ChatGPT"
          },
        ]);
        setIsTyping(false);
      });
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const [typingIndicator, setTypingIndicator] = useState("HooBank is typing");
  const [dots, setDots] = useState("");
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    let interval;
    if (isTyping) {
      interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
      }, 500);
    } else {
      clearInterval(interval);
      setDots("");
    }

    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <div className="ChatbotUI">
      {isOpen && (
        
          <div className="custom-chat-container">
            <div ref={chatContainerRef} className="custom-message-list">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`custom-message ${
                    message.sender === 'user' ? 'user-message' : 'assistant-message'
                  }`}
                >
                  {message.message}
                </div>
              ))}
              {isTyping && (
                <div className="custom-typing-indicator">
                  {`${typingIndicator}${dots}`}
                </div>
              )}
            </div>

            <div className="custom-input-container">
              <input
                type="text"
                placeholder="Type message here"
                className="custom-message-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend(e.target.value);
                    e.target.value = '';
                  }
                }}
                disabled={isSending}
              />
              <button
                onClick={() => {
                  handleSend(document.querySelector('.custom-message-input').value);
                  document.querySelector('.custom-message-input').value = '';
                }}
                className="send-button"
                disabled={isSending}
              >
                <IoSendSharp className="send-icon" />
              </button>
            </div>
          </div>
        
      )}
    </div>
  );
}

export default ChatbotUI;