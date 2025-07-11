
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SocialLoginButtons from './auth/SocialLoginButtons';
import LocationDisplay from './auth/LocationDisplay';
import AuthForm from './auth/AuthForm';
import EmailVerification from './auth/EmailVerification';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'login' | 'email-verification' | 'signup';

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const handleSubmit = (formData: any) => {
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login clicked`);
    onClose();
  };

  const handleEmailVerified = (email: string) => {
    setVerifiedEmail(email);
    setCurrentStep('signup');
  };

  const handleToggleMode = () => {
    if (currentStep === 'login') {
      setCurrentStep('email-verification');
    } else {
      setCurrentStep('login');
      setVerifiedEmail('');
    }
  };

  const getModalTitle = () => {
    switch (currentStep) {
      case 'login':
        return '로그인';
      case 'email-verification':
        return '이메일 인증';
      case 'signup':
        return '회원가입';
      default:
        return '로그인';
    }
  };

  const getMaxWidth = () => {
    return currentStep === 'signup' ? 'sm:max-w-6xl' : 'sm:max-w-md';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={getMaxWidth()}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-green-700">
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className={`flex gap-8 p-6 ${currentStep !== 'signup' ? 'justify-center' : ''}`}>
          {/* Left Side - Form */}
          <div className={`space-y-6 ${currentStep !== 'signup' ? 'w-full max-w-sm' : 'flex-1'}`}>
            {currentStep === 'email-verification' ? (
              <EmailVerification onVerified={handleEmailVerified} />
            ) : (
              <>
                <SocialLoginButtons 
                  isLogin={currentStep === 'login'} 
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
                  isLogin={currentStep === 'login'} 
                  onSubmit={handleSubmit}
                  prefilledEmail={verifiedEmail}
                  onClose={onClose}
                />
              </>
            )}

            {currentStep !== 'email-verification' && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="text-sm text-green-600 hover:text-green-700 underline"
                >
                  {currentStep === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Location Map for Signup */}
          {currentStep === 'signup' && (
            <LocationDisplay isOpen={isOpen && currentStep === 'signup'} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
