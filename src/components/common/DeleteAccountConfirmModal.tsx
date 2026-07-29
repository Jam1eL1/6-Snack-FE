import React from "react";
import Button from "../ui/Button";
import ExclamationMarkIconSvg from "../svg/ExclamationMarkIconSvg";

type TDeleteModalProps = {
  name: string;
  email: string;
  onCancel: () => void;
  onConfirm: () => void;
};
export default function DeleteAccountConfirmModal({ name, email, onCancel, onConfirm }: TDeleteModalProps) {
  return (
    <div className="absolute left-1/2 top-1/2 translate-[-50%] w-[327px] sm:w-[512px] px-7.5 pt-10 pb-7.5 bg-white rounded-md shadow-[0px_0px_30px_0px_rgba(0,0,0,0.14)] inline-flex flex-col justify-center items-center gap-9">
      <div className="flex flex-col justify-start items-center gap-2">
        <h2 className="justify-center text-black text-lg font-bold">Remove User</h2>
        <div className="flex flex-col justify-start items-center gap-2">
          <ExclamationMarkIconSvg className="hidden sm:block text-red" />
          <div className="text-center justify-center">
            {/* Mobile */}
            <div className="block sm:hidden">
              <span className="text-gray-900 text-base font-bold leading-relaxed">
                {name}({email})
              </span>
              <span className="text-gray-900 text-base font-normal leading-relaxed">
                <br />
                Are you sure you want to remove this user?
              </span>
            </div>

            {/* Desktop */}
            <div className="hidden sm:block">
              <span className="text-gray-900 text-base font-bold leading-relaxed">
                {name}({email})
              </span>
              <span className="text-gray-900 text-base font-normal leading-relaxed">
                {" "}
                Are you sure you want to remove this user?
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <Button
          type="white"
          label="Cancel"
          className="h-[50px] sm:h-[64px] flex-1 text-sm/[17px] sm:text-base/[20px] font-bold tracking-tight"
          onClick={onCancel}
        />
        <Button
          type="black"
          label="Remove User"
          className="bg-primary-950 h-[50px] sm:h-[64px] flex-1 text-sm/[17px] sm:text-base/[20px] font-bold tracking-tight"
          onClick={onConfirm}
        />
      </div>
    </div>
  );
}
