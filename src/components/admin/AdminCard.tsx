import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action
}) => {
  return (
    <div
      className={`bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl p-4 sm:p-5 shadow-sm transition ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-navy-800 gap-2">
          <div>
            {title && (
              <h3 className="font-headline font-bold text-base sm:text-lg text-navy-950 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
