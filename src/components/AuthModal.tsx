
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SocialLoginButtons from './auth/SocialLoginButtons';
import LocationDisplay from './auth/LocationDisplay';
import AuthForm from './auth/AuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (formData: any) => {
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login clicked`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isLogin ? 'sm:max-w-md' : 'sm:max-w-6xl'}`}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-green-700">
            {isLogin ? '로그인' : '회원가입'}
          </DialogTitle>
        </DialogHeader>

        <div className={`flex gap-8 p-6 ${isLogin ? 'justify-center' : ''}`}>
          {/* Left Side - Form */}
          <div className={`space-y-6 ${isLogin ? 'w-full max-w-sm' : 'flex-1'}`}>
            <SocialLoginButtons 
              isLogin={isLogin} 
              onSocialLogin={handleSocialLogin} 
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <AuthForm 
              isLogin={isLogin} 
              onSubmit={handleSubmit} 
            />

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-green-600 hover:text-green-700 underline"
              >
                {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
              </button>
            </div>
          </div>

          {/* Right Side - Location Map for Signup */}
          {!isLogin && (
            <LocationDisplay isOpen={isOpen && !isLogin} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
