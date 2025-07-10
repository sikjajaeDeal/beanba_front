
import React from 'react';
import { X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Chat {
  id: string;
  userName: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  product: string;
}

interface ChatListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chat: Chat) => void;
}

const ChatList = ({ isOpen, onClose, onSelectChat }: ChatListProps) => {
  const mockChats: Chat[] = [
    {
      id: '1',
      userName: '김농부',
      lastMessage: '쌀 언제 받으러 오실 수 있나요?',
      time: '오후 2:30',
      unread: 2,
      avatar: 'photo-1472099645785-5658abf4ff4e',
      product: '유기농 쌀 20kg'
    },
    {
      id: '2',
      userName: '이농장',
      lastMessage: '토마토 상태 정말 좋습니다!',
      time: '오후 1:15',
      unread: 0,
      avatar: 'photo-1438761681033-6461ffad8d80',
      product: '방울토마토 5kg'
    },
    {
      id: '3',
      userName: '박과수원',
      lastMessage: '사과 할인 가능한지 문의드려요',
      time: '오전 11:20',
      unread: 1,
      avatar: 'photo-1500648767791-00dcc994a43e',
      product: '홍로 사과 10kg'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Chat List Panel */}
      <div className={`fixed bottom-0 right-4 w-80 h-96 bg-white z-50 shadow-2xl rounded-t-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-green-50">
            <h2 className="text-lg font-bold text-gray-900">채팅</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-green-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={`https://images.unsplash.com/${chat.avatar}?w=40&h=40&fit=crop&crop=face`}
                    alt={chat.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {chat.userName}
                      </h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1 truncate">{chat.product}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;
