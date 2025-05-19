"use client";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b">
          {title && <h3 className="text-lg font-semibold text-coral">{title}</h3>}
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-coral"
            aria-label="Modal schließen"
          >
            <FiX />
          </button>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
