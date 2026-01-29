// Utility functions for user type management

export const getUserTypeFromStorage = (): 'individual' | 'dealer' | null => {
  if (typeof window === 'undefined') return null;
  
  const userType = localStorage.getItem('userType');
  return userType as 'individual' | 'dealer' | null;
};

export const setUserTypeInStorage = (type: 'individual' | 'dealer'): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('userType', type);
};

export const clearUserTypeFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('userType');
  localStorage.removeItem('hasSeenUserTypePopup');
};

export const hasUserSeenPopup = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return localStorage.getItem('hasSeenUserTypePopup') === 'true';
};
