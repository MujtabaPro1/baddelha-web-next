'use client';

import UserTypePopup from './UserTypePopup';
import UserTypeDisplay from './UserTypeDisplay';

export default function UserTypePopupWrapper() {
  //const { showUserTypePopup } = useUserType();
  const showUserTypePopup = false;

  return (
    <>
      {showUserTypePopup && <UserTypePopup />}
      <UserTypeDisplay />
    </>
  );
}
