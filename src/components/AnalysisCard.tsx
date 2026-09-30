import React from 'react';

interface AnalysisCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'text-[#E65A3C] bg-[#FDF2F0]',
  icon,
  children,
  className = '',
  action
}) => {
  return (
    <div className={`p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DE] text-[#1C1917] shrink-0">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {title}
              </h3>
              {badge && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#78716C] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action && <div>{action}</div>}
      </div>

      <div>{children}</div>
    </div>
  );
};
