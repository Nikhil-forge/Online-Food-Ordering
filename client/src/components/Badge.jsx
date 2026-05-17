import React from 'react';

export default function Badge({ children, variant = 'info' }) {
  const styles = {
    info: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-leaf',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-tomato'
  };
  return <span className={`badge ${styles[variant]}`}>{children}</span>;
}
