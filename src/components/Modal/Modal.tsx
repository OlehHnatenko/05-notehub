import { useEffect } from "react";
import css from "./Modal.module.css"
import { createPortal } from "react-dom";

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}
export default function Modal({ onClose, children }: ModalProps) {

    const handleBackdropClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        if (evt.target === evt.currentTarget) {
            onClose();
        }
    };
    useEffect(() => {
        const handleKeyDown = (evt: KeyboardEvent) => {
            if (evt.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";

        }

    }, [onClose])
    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>
                {children}
            </div>
        </div>, document.body
    );
}
