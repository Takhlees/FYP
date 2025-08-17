"use client";

import AuthProvider from "../AuthProvider";

export default function ProtectedLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
