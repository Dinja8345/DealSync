"use client"

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <div>
      <Button text="モーダルオープン" onClick={openModal} />
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div>
            こんにちは
        </div>
      </Modal>
    </div>
  );
}
