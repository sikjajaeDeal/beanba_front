
import React, { useState, useEffect } from 'react';
import { Mail, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailVerificationProps {
  onVerified: (email: string) => void;
}

const EmailVerification = ({ onVerified }: EmailVerificationProps) => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSendEmail = async () => {
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      // TODO: 실제 이메일 전송 API 호출
      const response = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setIsEmailSent(true);
        setTimeLeft(180); // 3분 = 180초
        console.log('이메일 전송 성공');
      } else {
        throw new Error('이메일 전송 실패');
      }
    } catch (error) {
      console.error('이메일 전송 오류:', error);
      // TODO: 실제 구현에서는 임시로 성공 처리
      setIsEmailSent(true);
      setTimeLeft(180);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setTimeLeft(180);
    handleSendEmail();
  };

  const handleProceedToSignup = () => {
    onVerified(email);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          이메일 인증
        </h3>
        <p className="text-sm text-gray-600">
          회원가입을 위해 이메일 인증을 진행해주세요
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">이메일 주소</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={isEmailSent}
              required
            />
          </div>
        </div>

        {!isEmailSent ? (
          <Button
            onClick={handleSendEmail}
            disabled={!email || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? '전송 중...' : '이메일 전송'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">
                  {email}로 인증 이메일을 전송했습니다.
                </p>
              </div>
              <p className="text-xs text-green-600 mt-1">
                이메일을 확인하고 인증을 완료해주세요.
              </p>
            </div>

            {timeLeft > 0 ? (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Timer className="h-4 w-4" />
                <span>재전송 가능 시간: {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                이메일 재전송
              </Button>
            )}

            <Button
              onClick={handleProceedToSignup}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              회원가입 계속하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
