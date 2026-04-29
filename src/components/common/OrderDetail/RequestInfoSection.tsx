"use client";

type TRequestInfoSectionProps = {
  requester?: string;
  userName?: string;
  createdAt?: string | null;
  requestMessage?: string | null;
  formatDate: (dateString: string | undefined | null) => string;
};

export default function RequestInfoSection({
  requester,
  userName,
  createdAt,
  requestMessage,
  formatDate,
}: TRequestInfoSectionProps) {
  // Use whichever requester name is available.
  const displayName = requester || userName || "-";

  return (
    <div className="self-stretch flex flex-col justify-start items-start">
      <div className="self-stretch py-3.5 border-b border-primary-800 inline-flex justify-start items-center gap-2 sm:pl-2">
        <div className="text-center justify-center text-primary-950 text-sm sm:text-base font-extrabold ">
          Request Info
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-center items-start sm:flex sm:flex-row sm:justify-start sm:items-stretch">
        <div className="self-stretch inline-flex justify-start items-center sm:flex-1">
          <div className="w-36 h-12 p-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
            <div className="text-center justify-center text-primary-950 text-sm sm:text-base font-normal ">
              Requester
            </div>
          </div>
          <div className="flex-1 h-12 px-4 py-2 border-b border-primary-200 flex justify-start items-center gap-2 sm:border-r">
            <div className="text-center justify-center text-primary-900 text-sm sm:text-base font-bold ">
              {displayName}
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-start items-center sm:flex-1">
          <div className="w-36 h-12 p-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
            <div className="text-center justify-center text-primary-950 text-sm sm:text-base font-normal ">
              Request Date
            </div>
          </div>
          <div className="flex-1 h-12 px-4 py-2 border-b border-primary-200 flex justify-start items-center gap-2">
            <div className="text-center justify-center text-primary-900 text-sm sm:text-base font-bold ">
              {formatDate(createdAt)}
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center">
        <div className="w-36 h-12 px-2 py-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
          <div className="text-center justify-center text-primary-950 text-sm sm:text-base font-normal ">
            Request Message
          </div>
        </div>
        <div className="flex-1 h-12 px-4 py-2 border-b border-primary-200 flex justify-start items-center gap-2">
          <div className="flex-1 justify-center text-primary-900 text-sm sm:text-base font-bold  leading-snug">
            {requestMessage || "No request message."}
          </div>
        </div>
      </div>
    </div>
  );
} 
