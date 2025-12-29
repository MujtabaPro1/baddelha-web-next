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
      reCaptchaKey={'6Le8uTcsAAAAAFQicqxQlu3jXqCdwEJw7TjL7X_q'}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
