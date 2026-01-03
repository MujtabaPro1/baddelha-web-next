'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function ReCaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleReCaptchaProvider
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
      reCaptchaKey={'6Lc2Cj8sAAAAAJi90fdNKuQDvS-5BBA9Woj6sYvl'}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
