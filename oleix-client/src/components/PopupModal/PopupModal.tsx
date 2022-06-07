import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface PopupModalProps {
  title: string;
  onAccept: ({ ...props }: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: () => void;
  buttonCloseContent?: string | ReactNode;
  buttonAcceptContent?: string | ReactNode;
  show: boolean;
  children: ReactNode;
  buttonAcceptVariant?: string;
}

const PopupModal: FC<PopupModalProps> = ({
  title,
  children,
  onAccept,
  onCancel,
  show = false,
  buttonAcceptContent = 'Accept',
  buttonCloseContent = 'Cancel',
  buttonAcceptVariant = 'dark',
}) => {
  const [showModal, setShowModal] = useState(show);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  const handleClose = () => {
    setShowModal(!show);

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {buttonCloseContent}
        </Button>
        <Button variant={buttonAcceptVariant} onClick={onAccept}>
          {buttonAcceptContent}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupModal;
