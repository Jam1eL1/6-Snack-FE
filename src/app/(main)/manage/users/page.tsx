import React, { Suspense } from "react";
import User from "./_components/User";

export default function ManageUsersPage() {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col justify-center">
      <Suspense>
        <User />
      </Suspense>
    </div>
  );
}
