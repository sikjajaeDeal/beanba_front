
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { chatService } from '@/services/chatService';
import ChatList from './ChatList';
import ProductChatWindow from './ProductChatWindow';

const ChatButton = () => {
  const [showChatList, setShowChatList] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedRoomPk, setSelectedRoomPk] = useState<number | null>(null);
  const [selectedChatWith, setSelectedChatWith] = useState<number | null>(null);
  const [selectedNickname, setSelectedNickname] = useState<string>('');
  const [selectedPostPk, setSelectedPostPk] = useState<number | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const { isLoggedIn, memberInfo } = useAuth();
  const { toast } = useToast();

  const handleChatButtonClick = () => {
    if (!isLoggedIn) {
      toast({
        title: '로그인 필요',
        description: '채팅 기능을 사용하려면 로그인이 필요합니다.',
        variant: 'destructive'
      });
      return;
    }
    setShowChatList(true);
  };

  const handleSelectChat = async (roomPk: number, chatWith: number, nickname: string, postPk: number) => {
    if (!memberInfo) return;

    try {
      console.log('채팅방 선택:', { roomPk, chatWith, nickname, postPk });
      
      setSelectedRoomPk(roomPk);
      setSelectedChatWith(chatWith);
      setSelectedNickname(nickname);
      setSelectedPostPk(postPk);
      
      // 웹소켓 연결 - memberId를 number로 변환
      const ws = await chatService.connectWebSocket(Number(memberInfo.memberId));
      setWebSocket(ws);
      
      setShowChatList(false);
      setShowChatWindow(true);
      
    } catch (error) {
      console.error('채팅방 연결 실패:', error);
      toast({
        title: '채팅방 연결 실패',
        description: '다시 시도해주세요.',
        variant: 'destructive'
      });
    }
  };

  const handleBackToList = () => {
    setShowChatWindow(false);
    setShowChatList(true);
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
    }
  };

  const handleCloseAll = () => {
    setShowChatList(false);
    setShowChatWindow(false);
    setSelectedRoomPk(null);
    setSelectedChatWith(null);
    setSelectedNickname('');
    setSelectedPostPk(null);
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={handleChatButtonClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-30"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat List */}
      <ChatList
        isOpen={showChatList}
        onClose={handleCloseAll}
        onSelectChat={handleSelectChat}
      />

      {/* Chat Window */}
      {showChatWindow && selectedRoomPk && selectedChatWith && selectedPostPk && (
        <ProductChatWindow
          isOpen={showChatWindow}
          onClose={handleCloseAll}
          roomPk={selectedRoomPk}
          memberPk={selectedChatWith}
          postPk={selectedPostPk}
          productTitle=""
          sellerName={selectedNickname}
          webSocket={webSocket}
        />
      )}
    </>
  );
};

export default ChatButton;
