import type { ReactNode } from 'react';

export function AuthLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}