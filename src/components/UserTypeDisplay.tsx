'use client';

import { useUserType } from '../contexts/UserTypeContext';
import { Button } from './ui/button';

export default function UserTypeDisplay() {
  const { userType, setUserType, isNewUser } = useUserType();

  const handleClearUserType = () => {
    setUserType(null);
    // Also clear from localStorage to reset the popup
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userType');
      localStorage.removeItem('hasSeenUserTypePopup');
      // Reload to show popup again
      window.location.reload();
    }
  };

 

  const v1 = () => {
    return   <div className="fixed bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs z-40">
      <div className="space-y-1">
        <p><strong>User Type:</strong> {userType || 'Not set'}</p>
        <p><strong>New User:</strong> {isNewUser ? 'Yes' : 'No'}</p>
        <Button 
          onClick={handleClearUserType}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Reset User Type
        </Button>
      </div>
    </div>;
  }

  return <></>;
}