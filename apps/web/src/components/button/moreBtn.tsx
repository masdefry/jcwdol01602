import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/solid';
interface IMoreBtn {
  title?: string;
  runFunction: () => void;
  disabled?: boolean;
  style?: string;
}
export const DetailBtn = ({ runFunction }: IMoreBtn) => {
  return (
    <button
      onClick={() => runFunction()}
      className="border bg-gray-300 text-black p-2 flex items-end gap-1 rounded-lg hover:bg-purple-400  duration-150 ease-in-out justify-center w-[80px]"
    >
      <p>More</p>
      <EllipsisHorizontalIcon className="w-4 h-4" />
    </button>
  );
};

export const EditBtn = ({ title, runFunction }: IMoreBtn) => {
  return (
    <button
      onClick={() => runFunction()}
      className="flex gap-2 items-center text-center px-2 py-2 rounded-lg border bg-gray-300 hover:bg-yellow-400  duration-150 ease-in-out justify-center w-[80px]"
    >
      <PencilSquareIcon className="w-4 h-4" />
      <p>Edit</p>
    </button>
  );
};

export const DeleteBtn = ({ runFunction }: IMoreBtn) => {
  return (
    <button
      onClick={() => runFunction()}
      className="flex gap-2 items-center text-center p-2 rounded-lg border bg-red-300 hover:bg-red-400 ease-in-out duration-150 justify-center"
    >
      <TrashIcon className="w-4 h-4" />
      <p>Delete</p>
    </button>
  );
};

export const ApproveBtn = ({ runFunction, disabled }: IMoreBtn) => {
  return (
    <button
      onClick={() => runFunction()}
      className={`flex gap-2 items-center text-center p-2 rounded-lg border bg-gray-300  justify-center ${disabled ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-green-400  duration-150 ease-in-out'}`}
      disabled={disabled}
    >
      <CheckCircleIcon className="w-4 h-4" />
      <p>Approve</p>
    </button>
  );
};

export const RejectBtn = ({ runFunction, disabled }: IMoreBtn) => {
  return (
    <button
      onClick={() => runFunction()}
      className={`flex gap-2 items-center text-center p-2 rounded-lg border bg-gray-300  justify-center ${disabled ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-red-400  duration-150 ease-in-out'}`}
      disabled={disabled}
    >
      <XCircleIcon className="w-4 h-4" />
      <p>Reject</p>
    </button>
  );
};

export const TrashBtn = ({ runFunction, disabled }: IMoreBtn) => {
  return (
    <button
      className={`p-2 rounded-lg ${disabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white ease-in-out duration-150'}`}
      onClick={() => runFunction()}
      disabled={disabled}
    >
      <TrashIcon width={20} height={20} />
    </button>
  );
};

export const AddBtn = ({ title, runFunction, style }: IMoreBtn) => {
  return (
    <div className="flex items-center">
      <button
        className={`px-2 py-2 flex items-center gap-1 rounded-lg  duration-150 ease-in-out ${style ? style : 'bg-blue-300 text-black hover:bg-blue-400'}`}
        onClick={() => runFunction()}
      >
        <PlusIcon width={20} height={20} />
        <p>{title ? title : 'Add New Data'}</p>
      </button>
    </div>
  );
};

export const ReturnBtn = ({ title, runFunction }: IMoreBtn) => {
  return (
    <div className="flex items-center">
      <button
        className="bg-gray-200 text-gray-800 hover:text-black px-2 py-2 flex items-center gap-1 rounded-lg hover:bg-yellow-400 duration-150 ease-in-out"
        onClick={() => runFunction()}
      >
        <ArrowUturnLeftIcon width={20} height={20} />
        <p>{title}</p>
      </button>
    </div>
  );
};
