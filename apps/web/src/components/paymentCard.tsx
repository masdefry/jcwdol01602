import { IPayment } from '@/lib/interface';
import React from 'react';
import { TrashBtn } from './button/moreBtn';
import { capitalizeFirstLetter, rupiahFormat } from '@/lib/stringFormat';
import Image from 'next/image';
import ButtonCustom from './button/btn';

interface IPaymentCardProps {
  payment: IPayment;
  bankAccount: string;
  onDelete: (id: string) => void;
  onUpload: (id: string) => void;
}

const PaymentCard: React.FC<IPaymentCardProps> = ({
  payment,
  bankAccount,
  onDelete,
  onUpload,
}) => {
  return (
    <div className="bg-slate-200 m-4 p-4 rounded-xl shadow-lg">
      <div className="bg-gradient-to-b from-fuchsia-600 to-purple-600 p-2 rounded-lg text-white flex gap-4 justify-between items-center">
        <div className="flex gap-4">
          <h1 className="font-bold text-xl">Invoice Number</h1>
          <p className="font-semibold text-lg">{payment.id}</p>
        </div>
        <TrashBtn
          runFunction={() => onDelete(payment.id)}
          disabled={payment.proof !== null}
        />
      </div>
      <div className="flex gap-2 my-2 mx-2">
        <h2>Subscription Plan :</h2>
        <p className="font-semibold">
          {payment.subsCtg?.name
            ? capitalizeFirstLetter(payment.subsCtg.name)
            : 'Not Available'}
        </p>
      </div>
      <div className="flex gap-2 my-2 mx-2">
        <h2>Subscription Price :</h2>
        <p className="font-semibold">
          {payment.subsCtg?.price
            ? rupiahFormat(payment.subsCtg.price)
            : 'Not Available'}
        </p>
      </div>
      <div className="flex flex-col gap-2 my-2 mx-2">
        <div className="flex gap-2">
          <h2>Payment Option :</h2>
          <p className="font-semibold">
            {payment.method
              ? capitalizeFirstLetter(payment.method)
              : 'Not Available'}
          </p>
        </div>
        {payment.method === 'transfer' && !payment.proof && (
          <div className="bg-yellow-200 p-2 rounded-lg border-l-4 border-yellow-500">
            <p>Please proceed payment and transfer to {bankAccount}</p>
          </div>
        )}
      </div>
      {payment.method === 'transfer' && (
        <div className="flex gap-2 my-2 mx-2 items-center">
          <h2 className="text-nowrap">Payment receipt :</h2>
          {payment.proof ? (
            <div className="flex w-full flex-row items-center justify-between">
              <div className="relative w-24 h-24 rounded-lg border-2 border-black bg-white">
                <Image
                  src={payment.proof}
                  fill
                  alt={payment.id}
                  className="object-contain"
                />
              </div>
              <ButtonCustom
                btnName="Re-upload image"
                onClick={() => onUpload(payment.id)}
                disabled={payment.isApproved === true}
              />
            </div>
          ) : (
            <ButtonCustom
              btnName="Upload image"
              onClick={() => onUpload(payment.id)}
            />
          )}
        </div>
      )}
      <div className="flex gap-2 my-2 mx-2">
        {payment.isApproved === null && (
          <p className="bg-yellow-200 p-2 rounded-lg border-l-4 border-yellow-500">
            Please wait for approval
          </p>
        )}
        {payment.isApproved === false && (
          <p className="bg-red-200 p-2 rounded-lg border-l-4 border-red-500">
            Your payment was not approved, please check your receipt.
          </p>
        )}
        {payment.isApproved === true && (
          <p className="bg-green-400 text-black p-2 rounded-lg">Approved</p>
        )}
      </div>
    </div>
  );
};

export default PaymentCard;
