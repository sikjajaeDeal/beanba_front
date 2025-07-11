
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';

interface MemberInfo {
  memberId: string;
  email: string;
  nickname: string;
  provider: string;
  role: string;
  latitude: number;
  longitude: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  memberInfo: MemberInfo | null;
  login: (memberId: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);

  useEffect(() => {
    const loggedIn = authService.isLoggedIn();
    const member = authService.getMemberInfo();
    
    setIsLoggedIn(loggedIn);
    setMemberInfo(member);
  }, []);

  const login = async (memberId: string, password: string) => {
    try {
      const response = await authService.login({ memberId, password });
      
      authService.saveTokens(response.accessToken, response.refreshToken);
      authService.saveMemberInfo(response.memberResponse);
      
      setIsLoggedIn(true);
      setMemberInfo(response.memberResponse);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setMemberInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, memberInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
