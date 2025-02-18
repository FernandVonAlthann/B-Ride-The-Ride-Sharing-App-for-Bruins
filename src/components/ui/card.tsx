import React from 'react';

// The main Card component
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className || ""}`}>
      {children}
    </div>
  );
};

// The CardHeader component
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={`mb-4 ${className || ""}`}>{children}</div>;
};

// The CardTitle component that now supports className
export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h2 className={`text-xl font-semibold ${className || ""}`}>
      {children}
    </h2>
  );
};

// The CardContent component
export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
