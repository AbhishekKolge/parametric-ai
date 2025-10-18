import { useState } from "react";

export const useDisclosure = ({ onClose }: { onClose?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    onClose?.();
  };
  const toggle = () => {
    setIsOpen((prev) => {
      if (prev) {
        onClose?.();
      }
      return !prev;
    });
  };

  return { isOpen, open, close, toggle };
};
