
import { authService } from './authService';

interface OpenChattingRoomRequest {
  postPk: number;
}

interface OpenChattingRoomResponse {
  roomPk: number;
  memberPk: number;
}

interface MessageHistoryItem {
  messagePk: number;
  roomPk: number;
  memberPkFrom: number;
  memberNameFrom: string;
  message: string;
  messageAt: string;
}

interface ChattingRoomListItem {
  chattingRoomPk: number;
  message: string;
  messageAt: string;
  chatWith: number;
  chatWithNickname: string;
  readYn: string;
  postPk: number;
  memberPk: number;
}

export const chatService = {
  async openChattingRoom(postPk: number): Promise<OpenChattingRoomResponse> {
    const accessToken = authService.getAccessToken();
    
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch('http://localhost:8080/api/chatting/openChattingRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ postPk }),
    });

    if (!response.ok) {
      throw new Error('채팅방 생성에 실패했습니다.');
    }

    return response.json();
  },

  async getAllChattingRoomList(): Promise<ChattingRoomListItem[]> {
    const accessToken = authService.getAccessToken();
    
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch('http://localhost:8080/api/chatting/getAllChattingRoomList', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('채팅방 리스트를 가져오는데 실패했습니다.');
    }

    const data = await response.json();
    return data || [];
  },

  async connectWebSocket(memberPk: number): Promise<WebSocket> {
    const wsUrl = `ws://localhost:8080/api/ws-chat?memberPk=${memberPk}`;
    
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('웹소켓 연결 성공');
        resolve(ws);
      };
      
      ws.onerror = (error) => {
        console.error('웹소켓 연결 실패:', error);
        reject(new Error('웹소켓 연결에 실패했습니다.'));
      };
      
      ws.onclose = () => {
        console.log('웹소켓 연결 종료');
      };
    });
  },

  async getMessageHistory(roomPk: number): Promise<MessageHistoryItem[]> {
    const accessToken = authService.getAccessToken();
    
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`http://localhost:8080/api/chatting/getMessageList?roomPk=${roomPk}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('메시지 기록을 가져오는데 실패했습니다.');
    }

    const data = await response.json();
    return data || [];
  },

  async markMessageAsRead(roomPk: number): Promise<void> {
    const accessToken = authService.getAccessToken();
    
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`http://localhost:8080/messageRead/${roomPk}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('메시지 읽음 처리 실패');
    }
  },

  subscribeToRoom(webSocket: WebSocket, roomPk: number): void {
    if (webSocket.readyState === WebSocket.OPEN) {
      const subscribeMessage = {
        action: 'subscribe',
        destination: `localhost:8080/topic/room.${roomPk}`
      };
      webSocket.send(JSON.stringify(subscribeMessage));
      console.log(`채팅방 구독: localhost:8080/topic/room.${roomPk}`);
    }
  },

  sendMessage(webSocket: WebSocket, roomPk: number, postPk: number, message: string): void {
    if (webSocket.readyState === WebSocket.OPEN) {
      const messageData = {
        action: 'sendMessage',
        destination: 'localhost:8080/api/chatting/sendMessage',
        roomPk,
        postPk,
        message
      };
      webSocket.send(JSON.stringify(messageData));
      console.log('메시지 전송:', messageData);
    }
  },

  formatMessageTime(messageAt: string): string {
    const date = new Date(messageAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
};
