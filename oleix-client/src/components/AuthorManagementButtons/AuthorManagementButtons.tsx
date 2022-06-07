import React, { FC, useState } from 'react';
import { Button, Stack } from 'react-bootstrap';
import PopupModal from '../PopupModal/PopupModal';

interface AuthorManagementButtonsProps {
  className?: string;
  onEditClicked: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDeleteClicked: (e: React.MouseEvent<HTMLButtonElement>) => void;
  forceModal?: boolean;
}

const AuthorManagementButtons: FC<AuthorManagementButtonsProps> = ({
  className = '',
  onDeleteClicked,
  onEditClicked,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const deleteClickedEventHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <Stack direction="horizontal" gap={2} className={className}>
        <Button variant="outline-dark" onClick={onEditClicked}>
          Edit
        </Button>
        <Button variant="outline-danger" onClick={deleteClickedEventHandler}>
          Delete
        </Button>
      </Stack>

      <PopupModal
        title="DELETE ADVERT"
        onAccept={onDeleteClicked}
        show={showModal}
        buttonAcceptContent="Yes, delete it"
        children={<p>Are you sure you want to delete this advert?</p>}
        buttonAcceptVariant="danger"
      />
    </>
  );
};

export default AuthorManagementButtons;
