import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  disableScroll?: boolean;
  style?: React.CSSProperties;
}

export const Layout: React.FC<LayoutProps> = ({ children, disableScroll, style }) => {
  return (
    <div className={`layout-container ${disableScroll ? 'no-scroll' : ''}`} style={style}>
      {children}
      <style>{`
        .layout-container {
          margin: 0 auto;
          width: 100%;
          min-height: calc(100vh - 90px);
          padding: var(--spacing-sm);
          display: flex;
          flex-direction: column;
          padding-bottom: 120px; /* Extra padding for bottom scrollers */
        }
        
        .layout-container.no-scroll {
            height: calc(100vh - 90px);
            overflow: hidden;
            padding-bottom: var(--spacing-sm);
        }

        /* Desktop */
        @media (min-width: 769px) {
          .layout-container, .layout-container.no-scroll {
            max-width: 1000px;
            padding: var(--spacing-xl);
            height: auto;
            min-height: 100vh;
            overflow: visible;
          }
        }
      `}</style>
    </div>
  );
};
