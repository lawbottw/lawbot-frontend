import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.googleusercontent.com https://firebasestorage.googleapis.com https://www.google-analytics.com https://www.google.com https://www.google.com.tw https://*.google.com.tw https://googleads.g.doubleclick.net https://www.googleadservices.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' 
      https://*.googleapis.com 
      https://firestore.googleapis.com
      https://*.firebaseio.com 
      https://firebasestorage.googleapis.com 
      wss://*.firebaseio.com 
      https://identitytoolkit.googleapis.com 
      https://securetoken.googleapis.com 
      https://*.cloudfunctions.net 
      https://api.lawbot.tw 
      https://api2.lawbot.tw 
      http://127.0.0.1:8000 
      wss://*.pusher.com 
      https://*.pusher.com 
      https://www.google-analytics.com 
      https://analytics.google.com 
      https://www.google.com 
      https://googleads.g.doubleclick.net 
      https://www.googleadservices.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src https://*.firebaseapp.com https://*.google.com https://www.googletagmanager.com;
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;