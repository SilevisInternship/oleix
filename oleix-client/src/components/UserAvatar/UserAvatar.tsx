import React, { FC } from 'react';
import { Image } from 'react-bootstrap';
import EmptyAvatar from '../../assets/png/emptyavatar.png';
import CryptoJS from 'crypto-js';
import { useDebounce } from 'use-debounce';

interface UserAvatarProps {
  username: string | null;
  className?: string | undefined;
}

const UserAvatar: FC<UserAvatarProps> = ({ username, className }) => {
  const [debouncedAvatar] = useDebounce(username, 500);
  const imageClassName = `user-avatar rounded-circle d-flex align-items-center ${
    className ? className : 'mt-3 p-3 mx-auto'
  }`;

  return (
    <Image
      className={imageClassName}
      src={
        debouncedAvatar
          ? `https://avatars.dicebear.com/api/bottts/${CryptoJS.SHA256(debouncedAvatar)}.svg`
          : EmptyAvatar
      }
    />
  );
};

export default UserAvatar;
