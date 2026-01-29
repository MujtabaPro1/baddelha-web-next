'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'seller' | 'buyer' | null;

interface UserTypeContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isNewUser: boolean;
  hasSeenPopup: boolean;
  setHasSeenPopup: (seen: boolean) => void;
  showUserTypePopup: boolean;
  setShowUserTypePopup: (show: boolean) => void;
}

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

export function UserTypeProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);
  const [showUserTypePopup, setShowUserTypePopup] = useState(false);

  // Check if user type is saved in localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserType = localStorage.getItem('userType');
      const hasSeenPopupStorage = localStorage.getItem('hasSeenUserTypePopup');
      
      if (savedUserType) {
        setUserType(savedUserType as UserType);
        setIsNewUser(false);
      }
      
      if (hasSeenPopupStorage === 'true') {
        setHasSeenPopup(true);
      } else if (!savedUserType) {
        // Show popup for new users who haven't selected a type
        setTimeout(() => {
          setShowUserTypePopup(true);
        }, 2000); // Show after 2 seconds
      }
    }
  }, []);

  // Save user type to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && userType) {
      localStorage.setItem('userType', userType);
      setIsNewUser(false);
    }
  }, [userType]);

  // Save popup seen status
  useEffect(() => {
    if (typeof window !== 'undefined' && hasSeenPopup) {
      localStorage.setItem('hasSeenUserTypePopup', 'true');
    }
  }, [hasSeenPopup]);

  return (
    <UserTypeContext.Provider
      value={{
        userType,
        setUserType,
        isNewUser,
        hasSeenPopup,
        setHasSeenPopup,
        showUserTypePopup,
        setShowUserTypePopup,
      }}
    >
      {children}
    </UserTypeContext.Provider>
  );
}

export function useUserType() {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
}
