'use client';
import { useRouter } from 'next/navigation';
import React, { ButtonHTMLAttributes } from 'react';

interface IButtonCustom {
  btnName: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const ButtonCustom: React.FC<IButtonCustom> = ({
  btnName,
  onClick,
  href,
  disabled,
  type,
}) => {
  const router = useRouter();
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (href) {
      router.push(href);
    }
  };
  return (
    <button
      onClick={handleClick}
      className={`font-semibold py-2 px-4 rounded-full text-gray-600  ${disabled ? 'bg-gray-300 cursor-wait' : 'bg-yellow-300 hover:bg-yellow-400 hover:text-black ease-in-out duration-200'}`}
      disabled={disabled}
      type={type}
    >
      {btnName}
    </button>
  );
};

export default ButtonCustom;
