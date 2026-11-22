import React from "react";
import { ExpandPopoverModal } from "@/components/ui/ExpandPopoverModal";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const WIDTH_CLASS: Record<NonNullable<ModalProps["maxWidth"]>, string> = {
  sm: "w-[calc(100vw-24px)] sm:w-[356px]",
  md: "w-[calc(100vw-24px)] sm:w-[388px]",
  lg: "w-[calc(100vw-24px)] sm:w-[408px]",
  xl: "w-[calc(100vw-24px)] sm:w-[424px]",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = "md",
  children,
}) => {
  return (
    <ExpandPopoverModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      widthClassName={WIDTH_CLASS[maxWidth]}
    >
      {children}
    </ExpandPopoverModal>
  );
};
