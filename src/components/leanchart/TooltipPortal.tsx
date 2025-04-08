// components/TooltipPortal.tsx
import React from "react";
import { createPortal } from "react-dom";

interface TooltipPortalProps {
  children: React.ReactNode;
  position: { top: number; left: number };
}

const TooltipPortal: React.FC<TooltipPortalProps> = ({ children, position }) => {
  return createPortal(
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -100%)",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default TooltipPortal;