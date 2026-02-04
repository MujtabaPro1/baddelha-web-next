'use client';

import UserTypePopup from './UserTypePopup';
import UserTypeDisplay from './UserTypeDisplay';
import { useUserType } from '../contexts/UserTypeContext';
import ReCaptchaProvider from './ReCaptchaProvider';

export default function UserTypePopupWrapper() {
  const { showUserTypePopup } = useUserType();

  return (
    <>
      {showUserTypePopup && (
        <ReCaptchaProvider>
          <UserTypePopup />
        </ReCaptchaProvider>
      )}
      <UserTypeDisplay />
    </>
  );
}
