"use client";
import InviteMemberModal from "@/components/common/InviteMemberModal";
import MemberList from "@/components/common/MemberList";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import NoContent from "@/components/common/NoContent";
import { fetchAllCompanyUsers } from "@/lib/api/companyUser.api";
import { sendInvite } from "@/lib/api/invite.api";
import { deleteUserById } from "@/lib/api/superAdmin.api";
import { getUser } from "@/lib/api/user.api";
import { useModal } from "@/providers/ModalProvider";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DogSpinner from "@/components/common/DogSpinner";
import { SessionExpiredError } from "@/lib/api/auth.errors";
import { queryKeys } from "@/lib/queryKeys";
import { useFlashToast } from "@/stores/flashToast";

export default function User() {
  const [currentPaginationPage, setCurrentPaginationPage] = useState<number>(1);
  const { openModal } = useModal();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const queryClient = useQueryClient();
  const setFlash = useFlashToast((state) => state.setFlash);
  const MEMBERS_PAGE = 5;

  // Reset pagination to page 1 when the search term changes
  useEffect(() => {
    setCurrentPaginationPage(1);
  }, [name]);

  // Fetch member list
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: queryKeys.companyUsers.list(name),
    queryFn: () => fetchAllCompanyUsers({ name, limit: 50 }),
  });

  const members = useMemo(() => membersData?.users ?? [], [membersData?.users]);
  const totalPages = Math.ceil(members.length / MEMBERS_PAGE);

  useEffect(() => {
    if (totalPages === 0 || currentPaginationPage > totalPages) {
      setCurrentPaginationPage(1);
    }
  }, [totalPages, currentPaginationPage]);

  // User deletion mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUserById,
    onSuccess: (data) => {
      setFlash(data.message, "success");
      queryClient.invalidateQueries({ queryKey: queryKeys.companyUsers.all });
    },
    onError: (error) => {
      if (error instanceof SessionExpiredError) return;

      setFlash("Failed to delete user.", "error");
      console.error(error);
    },
  });

  // User invitation mutation
  const inviteUserMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; role: "USER" | "ADMIN" }) => {
      const currentUser = await getUser();

      const inviteData = {
        email: data.email,
        name: data.name,
        role: data.role,
        companyId: Number(currentUser.company?.id) || 0,
        invitedById: currentUser.id,
        expiresInDays: 7,
      };

      return sendInvite(inviteData);
    },
    onSuccess: (result) => {
      if (result.emailSent) {
        setFlash("Invitation email sent successfully.", "success");
      } else {
        setFlash("Invitation link created but email sending failed.", "error");
      }
      // Invalidate member list cache to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.companyUsers.all });
    },
    onError: (error) => {
      if (error instanceof SessionExpiredError) return;

      const message: string = (error as Error).message || "";
      const isConflict =
        /Unique constraint/i.test(message) ||
        /already invited/i.test(message) ||
        /email already registered/i.test(message);
      if (isConflict) {
        setFlash("An invitation history already exists.", "error");
      } else {
        setFlash(message || "Failed to send invitation.", "error");
      }
      console.error(error);
    },
  });

  const paginateMembers = useMemo(() => {
    const start = (currentPaginationPage - 1) * MEMBERS_PAGE;
    return members.slice(start, start + MEMBERS_PAGE);
  }, [members, currentPaginationPage]);

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const handleInviteUser = (data: { name: string; email: string; role: "USER" | "ADMIN" }) => {
    inviteUserMutation.mutate(data);
  };

  useEffect(() => {
    if (!membersError) return;

    setFlash(membersError instanceof Error ? membersError.message : "Failed to load member list", "error");
  }, [membersError, setFlash]);

  return (
    <main className="w-full" aria-label="Member Management Page">
      <header className="flex justify-between items-center">
        <h1 className="self-center text-lg font-bold sm:text-2xl">Member Management</h1>
        <Button
          type="black"
          label="Invite Member"
          className="w-50 h-16 hidden sm:block rounded-[2px]"
          onClick={() => {
            openModal(<InviteMemberModal onSubmit={handleInviteUser} />);
          }}
          aria-label="Invite new member"
        />
      </header>

      <Suspense>
        <SearchBar />
      </Suspense>

      <section aria-label="Member List" className="mt-10">
        {/* PC Table Header */}
        <div
          className="w-full mt-10 self-stretch p-5 border-t border-b border-neutral-200 hidden sm:flex justify-start items-center gap-8"
          role="table"
          aria-label="Member list table header"
        >
          <div
            className="min-w-0 px-14 flex justify-start items-center mr-2"
            role="columnheader"
            aria-label="Name column"
          >
            <div className="justify-center text-primary-500 text-base font-bold">Name</div>
          </div>
          <div
            className="min-w-0 flex-1 justify-center text-primary-500 text-base font-bold"
            role="columnheader"
            aria-label="Email column"
          >
            Email
          </div>
          <div
            className="w-20 text-center justify-center text-primary-500 text-base font-bold"
            role="columnheader"
            aria-label="Role column"
          >
            Role
          </div>
          <div
            className="w-48 text-center justify-center text-primary-500 text-base font-bold"
            role="columnheader"
            aria-label="Notes column"
          >
            Notes
          </div>
        </div>

        {/* Member List */}
        <div role="list" aria-label="Member list">
          {isLoadingMembers || deleteUserMutation.isPending || inviteUserMutation.isPending ? (
            <div
              className="py-10 flex justify-center"
              role="status"
              aria-live="polite"
              aria-label="Loading member list"
            >
              <DogSpinner />
            </div>
          ) : paginateMembers.length > 0 ? (
            paginateMembers.map((member) => (
              <div key={member.id} role="listitem">
                <MemberList
                  {...member}
                  onClickDeleteUser={handleDeleteUser}
                  onRoleUpdate={() => setFlash("Role successfully updated.", "success")}
                />
              </div>
            ))
          ) : (
            <NoContent
              title="No Team Members Found"
              subText1="Invite your team members to join!"
              buttonText="Invite Member"
              onClick={() => {
                openModal(<InviteMemberModal mode="invite" onSubmit={handleInviteUser} />);
              }}
            />
          )}
        </div>
      </section>

      {/* Pagination */}
      {paginateMembers.length > 0 && (
        <nav aria-label="Member list pagination" className="mt-6">
          <Pagination
            currentPage={currentPaginationPage}
            totalPages={totalPages}
            onPageChange={setCurrentPaginationPage}
          />
        </nav>
      )}

      {/* Mobile Invite Button */}
      {paginateMembers.length > 0 && (
        <div className="w-full pt-6 flex justify-center">
          <Button
            type="black"
            label="Invite Member"
            className="w-50 h-16 sm:hidden rounded-[2px]"
            onClick={() => {
              openModal(<InviteMemberModal mode="invite" onSubmit={handleInviteUser} />);
            }}
            aria-label="Invite new member (Mobile)"
          />
        </div>
      )}
    </main>
  );
}
