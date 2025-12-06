import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = '2xl' }) => {
    const [show, setShow] = useState(isOpen);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            setTimeout(() => setAnimate(true), 10);
            document.body.style.overflow = 'hidden';
        } else {
            setAnimate(false);
            const timer = setTimeout(() => setShow(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!show) return null;

    const sizeClasses = {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl'
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${animate ? 'backdrop-blur-sm bg-black/60' : 'backdrop-blur-none bg-transparent'
            }`}>
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className={`
                bg-white dark:bg-stone-900 
                rounded-2xl shadow-2xl w-full 
                ${sizeClasses[size]} 
                flex flex-col 
                min-h-[50vh] max-h-[90vh]
                transform transition-all duration-300 ease-out
                ${animate ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
                relative z-10 border border-stone-200/50
            `}>
                <div className="flex justify-between items-center p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 rounded-t-2xl backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 hover:text-red-500 active:scale-95 duration-200"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
