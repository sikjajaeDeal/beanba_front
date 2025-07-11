
interface LoginRequest {
  memberId: string;
  password: string;
}

interface MemberResponse {
  memberId: string;
  email: string;
  nickname: string;
  provider: string;
  role: string;
  latitude: number;
  longitude: number;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  memberResponse: MemberResponse;
}

export const authService = {
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('로그인에 실패했습니다.');
    }

    return response.json();
  },

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  saveMemberInfo(memberInfo: MemberResponse) {
    localStorage.setItem('memberInfo', JSON.stringify(memberInfo));
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  getMemberInfo(): MemberResponse | null {
    const memberInfo = localStorage.getItem('memberInfo');
    return memberInfo ? JSON.parse(memberInfo) : null;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('memberInfo');
  },

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
};
