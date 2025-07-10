
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (formData: any) => void;
  prefilledEmail?: string;
}

const AuthForm = ({ isLogin, onSubmit, prefilledEmail = '' }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  });

  // 이메일 인증 후 이메일 미리 채우기
  useEffect(() => {
    if (prefilledEmail) {
      setFormData(prev => ({
        ...prev,
        email: prefilledEmail
      }));
    }
  }, [prefilledEmail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      // 회원가입 시 비밀번호 확인 검증
      if (formData.password !== formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="userId">아이디</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="userId"
              name="userId"
              type="text"
              placeholder="아이디를 입력하세요"
              value={formData.userId}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            disabled={!!prefilledEmail && !isLogin}
            required
          />
        </div>
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="nickname">닉네임</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={formData.nickname}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {isLogin ? '로그인' : '회원가입'}
      </Button>
    </form>
  );
};

export default AuthForm;
