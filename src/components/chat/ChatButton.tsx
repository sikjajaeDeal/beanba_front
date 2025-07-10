
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

interface Chat {
  id: string;
  userName: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  product: string;
}

const ChatButton = () => {
  const [showChatList, setShowChatList] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowChatList(false);
    setShowChatWindow(true);
  };

  const handleBackToList = () => {
    setShowChatWindow(false);
    setShowChatList(true);
  };

  const handleCloseAll = () => {
    setShowChatList(false);
    setShowChatWindow(false);
    setSelectedChat(null);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setShowChatList(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-30"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          3
        </div>
      </Button>

      {/* Chat List */}
      <ChatList
        isOpen={showChatList}
        onClose={handleCloseAll}
        onSelectChat={handleSelectChat}
      />

      {/* Chat Window */}
      <ChatWindow
        chat={selectedChat}
        isOpen={showChatWindow}
        onClose={handleCloseAll}
        onBack={handleBackToList}
      />
    </>
  );
};

export default ChatButton;
