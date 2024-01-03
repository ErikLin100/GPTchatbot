import React, { useState, useEffect } from 'react';
import { IoChatbubble, IoClose } from 'react-icons/io5';
import ChatbotUI from './chatbotUI';
import './Animated.css';

const Animated = () => {
  const [isAnimatedOpen, setIsAnimatedOpen] = useState(false);
  const [isChatbotUIVisible, setIsChatbotUIVisible] = useState(false);

  const toggleAnimation = () => {
    setIsAnimatedOpen(!isAnimatedOpen);
    if (!isAnimatedOpen) {
      openChatbot();
    }
  };

  const openChatbot = () => {
    
    setTimeout(() => {
      setIsChatbotUIVisible(true);
    }, 1100);
  };

 
  useEffect(() => {
    if (!isAnimatedOpen) {
      setIsChatbotUIVisible(false);
    }
  }, [isAnimatedOpen]);

  return (
    <div>
      <div
        className={`animated-container pulse ${isAnimatedOpen ? 'open' : ''}`}
        onClick={toggleAnimation}
      >
        {!isAnimatedOpen && (
          <IoChatbubble className="chat-icon" onClick={(e) => e.stopPropagation()} />
        )}
        <div className="close-button" onClick={() => setIsAnimatedOpen(false)}><IoClose className='close-icon'/></div>
      </div>

      {isChatbotUIVisible && <ChatbotUI isOpen={isAnimatedOpen} />}
    </div>
  );
};

export default Animated;