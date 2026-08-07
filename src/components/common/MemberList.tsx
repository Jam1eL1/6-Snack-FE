import { useModal } from "@/providers/ModalProvider";
import { TMemberItem } from "@/types/memberList.types";
import Badge from "../ui/Badge";
import DeleteAccountConfirmModal from "./DeleteAccountConfirmModal";
import InviteMemberModal from "./InviteMemberModal";
import MenuDropdown from "./MenuDropdown";

type TMemberListProps = TMemberItem & {
  onClickDeleteUser?: (id: string) => void;
  onRoleUpdate?: (data: { name: string; email: string; role: "USER" | "ADMIN" }) => void;
};

export default function MemberList({ id, name, email, role, onClickDeleteUser, onRoleUpdate }: TMemberListProps) {
  const { openModal, closeModal } = useModal();
  return (
    <>
      {/* Mobile layout */}
      <div className="sm:hidden min-w-0 w-full py-4 border-b border-[#e6e6e6] flex justify-between gap-3 hover:bg-primary-25 transition-colors">
        <div className="flex gap-3 flex-1 min-w-0">
          <div className="shrink-0 w-12 h-12 bg-primary-50 rounded-full flex justify-center items-center text-black text-sm font-medium ">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex flex-col justify-between min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-primary-950 text-base font-bold truncate">{name}</div>
              <Badge type={role === "ADMIN" ? "admin" : "user"} />
            </div>
            <div className="min-w-0 text-primary-950 text-base truncate">{email}</div>
          </div>
        </div>
        <MenuDropdown
          className="shrink-0"
          menuType="member"
          onEdit={() => {
            openModal(
              <InviteMemberModal
                mode="edit"
                defaultValues={{ name, email, role, id }}
                onCancel={closeModal}
                onSubmit={(data) => {
                  onRoleUpdate?.(data);
                  closeModal();
                }}
              />,
            );
          }}
          onDelete={() =>
            openModal(
              <DeleteAccountConfirmModal
                name={name}
                email={email}
                onCancel={closeModal}
                onConfirm={() => {
                  onClickDeleteUser?.(id);
                  closeModal();
                }}
              />,
            )
          }
        />
      </div>

      {/* Desktop and tablet layout */}
      <div className="hidden sm:inline-flex w-full px-5 h-24 border-b border-[#e6e6e6] justify-start items-center gap-8 hover:bg-primary-25 transition-colors">
        <div className="flex justify-start items-center gap-5">
          <div className="w-8 h-8 relative bg-primary-50 rounded-full overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-[10px] font-medium">
              {name.slice(0, 1).toUpperCase()}
            </div>
          </div>
          <div className="w-24 inline-flex flex-col justify-center items-start">
            <div className="text-primary-950 text-base font-bold truncate w-full">{name}</div>
          </div>
        </div>

        <div className="flex-1 text-primary-950 text-base truncate">{email}</div>

        <Badge type={role === "ADMIN" ? "admin" : "user"} />

        <div className="flex gap-2">
          <button
            type="button"
            className="flex min-w-28 cursor-pointer items-center justify-center rounded-xs bg-white px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-primary-900 outline-1 outline-offset-[-1px] outline-primary-300 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={() => {
              openModal(
                <InviteMemberModal
                  mode="edit"
                  defaultValues={{ name, email, role, id }}
                  onCancel={closeModal}
                  onSubmit={(data) => {
                    onRoleUpdate?.(data);
                    closeModal();
                  }}
                />,
              );
            }}
          >
            Change Role
          </button>
          <button
            type="button"
            className="flex min-w-28 cursor-pointer items-center justify-center rounded-xs bg-red px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={() =>
              openModal(
                <DeleteAccountConfirmModal
                  name={name}
                  email={email}
                  onCancel={closeModal}
                  onConfirm={() => {
                    onClickDeleteUser?.(id);
                    closeModal();
                  }}
                />,
              )
            }
          >
            Remove User
          </button>
        </div>
      </div>
    </>
  );
}
