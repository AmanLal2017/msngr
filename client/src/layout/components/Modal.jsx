import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";

export const Modal = ({ children }) => {
  const { isModalOpen: isOpen, setIsModalOpen: setIsOpen } = useContext(ChatContext);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setIsOpen]);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto
        transform transition-transform duration-300 ease-in-out no-scrollbar 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-0
      `}>
        <div className="md:pt-0">
          {children}
        </div>
      </div>
    </>
  );
};