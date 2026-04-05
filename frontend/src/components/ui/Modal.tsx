import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const Modal = ({ isOpen, onClose, title, children, maxWidth = "md" }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-shell" role="presentation">
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={["modal-dialog", `modal-dialog--${maxWidth}`].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="modal-dialog__header">
          <div>
            <p className="modal-dialog__eyebrow">Studio editor</p>
            <h3 className="modal-dialog__title" id="modal-headline">
              {title}
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="button--icon"
            aria-label="Close dialog"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="modal-dialog__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
