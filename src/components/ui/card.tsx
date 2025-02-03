import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>{children}</div>;
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};
