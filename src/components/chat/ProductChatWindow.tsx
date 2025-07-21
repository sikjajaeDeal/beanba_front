
import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatService } from '@/services/chatService';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
  senderName?: string;
}

interface ProductChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  roomPk: number;
  memberPk: number;
  postPk: number;
  productTitle: string;
  sellerName: string;
  webSocket: WebSocket | null;
}

const ProductChatWindow = ({ 
  isOpen, 
  onClose, 
  roomPk, 
  memberPk, 
  postPk,
  productTitle, 
  sellerName,
  webSocket 
}: ProductChatWindowProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { memberInfo } = useAuth();

  // 웹소켓 메시지 처리
  useEffect(() => {
    if (webSocket && memberInfo) {
      webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('웹소켓 메시지 수신:', data);
          
          // 구독을 통해 받은 메시지 처리
          if (data.from && data.message && data.messageAt) {
            const newMessage: ChatMessage = {
              id: Date.now().toString(),
              text: data.message,
              time: chatService.formatMessageTime(data.messageAt),
              isOwn: data.memberPkFrom !== memberPk,
              senderName: data.from
            };
            setMessages(prev => [...prev, newMessage]);
            
            // 메시지 읽음 처리
            chatService.markMessageAsRead(roomPk);
          }
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };
    }
  }, [webSocket, memberPk, roomPk, memberInfo]);

  // 채팅방 초기화 (구독 및 과거 메시지 로드)
  useEffect(() => {
    if (isOpen && webSocket && roomPk && memberInfo) {
      initializeChatRoom();
    }
  }, [isOpen, webSocket, roomPk, memberInfo]);

  const initializeChatRoom = async () => {
    if (!webSocket || !memberInfo) return;

    try {
      setIsLoading(true);
      
      // 1. 채팅방 구독
      chatService.subscribeToRoom(webSocket, roomPk);
      
      // 2. 과거 메시지 기록 가져오기
      const messageHistory = await chatService.getMessageHistory(roomPk);
      
      if (messageHistory && messageHistory.length > 0) {
        const historyMessages: ChatMessage[] = messageHistory.map(msg => ({
          id: msg.messagePk.toString(),
          text: msg.message,
          time: chatService.formatMessageTime(msg.messageAt),
          isOwn: msg.memberPkFrom === Number(memberInfo.memberId),
          senderName: msg.memberNameFrom
        }));
        
        setMessages(historyMessages);
      }
      
    } catch (error) {
      console.error('채팅방 초기화 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 메시지 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && webSocket && webSocket.readyState === WebSocket.OPEN) {
      // 웹소켓을 통해 메시지 전송
      chatService.sendMessage(webSocket, roomPk, postPk, message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Chat Window */}
      <div className={`fixed bottom-0 right-4 w-96 h-[500px] bg-white z-50 shadow-2xl rounded-t-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-green-50">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{sellerName}</h3>
              <p className="text-xs text-gray-500 truncate">{productTitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-green-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-500 text-sm">
                대화 기록을 불러오는 중...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">
                채팅을 시작해보세요!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.isOwn
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {!msg.isOwn && msg.senderName && (
                      <p className="text-xs text-gray-600 mb-1">{msg.senderName}</p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isOwn ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1"
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={!message.trim() || !webSocket || webSocket.readyState !== WebSocket.OPEN || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductChatWindow;
