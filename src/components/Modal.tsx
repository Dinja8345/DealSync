//z軸の関係上、このmodalは使用するコンポーネントの一番下の行で呼び出してください

interface ModalProps {
  isOpen: boolean;
  closeModal?(...args: any[]): any;
  children: React.ReactNode
}

const Modal = ({ isOpen, closeModal, children }: ModalProps) => {
  const overlayClass = "fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center"
  const contentClass = "z-10 w-1/2 p-4 rounded-md bg-white relative"
  const modalCloseButtonClass = "text-gray-500 hover:text-gray-700 transition duration-200 rounded-full p-2 absolute top-0 right-1 focus:outline-none"

  if (isOpen) {
    return (
      <div className={overlayClass}>
        <div className={contentClass}>
          {!closeModal ? null : <button className={modalCloseButtonClass} onClick={closeModal}>✕</button>}
          {children}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Modal;
