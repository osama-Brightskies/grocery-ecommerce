import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, ChevronRight } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import DataTable from "@/components/ui/table";
import PaginationBar from "@/components/ui/pagination";
import { useGetUsers } from "../hooks/useGetUsers";
import { UserRole } from "@/store/types/authStore.types";
import type { User } from "../types/users.types";
import { cn, formatDate, getInitials } from "@/lib/utils";

const COLUMNS = [
  { key: "user", header: "USER", className: "text-left pl-6" },
  { key: "phoneNumber", header: "PHONE NUMBER", className: "text-center" },
  { key: "role", header: "ROLE", className: "text-center" },
  { key: "status", header: "STATUS", className: "text-center" },
  { key: "joined", header: "JOINED", className: "text-center" },
  { key: "actions", header: "ACTIONS", className: "text-right pr-6" },
];

const AVATAR_COLORS = [
  "bg-avatar-emerald text-white",
  "bg-avatar-green text-white",
  "bg-avatar-purple text-white",
  "bg-avatar-blue text-white",
  "bg-avatar-orange text-white",
  "bg-avatar-pink text-white",
];

export default function UsersListPage() {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useGetUsers({ pageNumber, pageSize });

  const rawUsers = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const totalCount = pagination?.totalCount ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const tableData = rawUsers.map((user) => ({
    ...user,
    id: user.guid,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Typography variant="h1">Users</Typography>
        <Typography variant="muted">
          View and manage registered users
        </Typography>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-mint border border-primary/20 text-brand-primary text-xs font-semibold">
          <UsersIcon className="w-4 h-4 text-brand-primary" />
          <span>{totalCount} users</span>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={tableData}
        columns={COLUMNS}
        isLoading={isLoading}
        renderCell={(key: string, item: User & { id: string }) => {
          if (key === "user") {
            const initials = getInitials(
              item.firstName,
              item.lastName,
              item.email,
            );
            const colorIdx =
              Math.abs(item.guid.charCodeAt(0) || 0) % AVATAR_COLORS.length;
            const fullName = [item.firstName, item.lastName]
              .filter(Boolean)
              .join(" ")
              .trim();

            return (
              <div className="flex items-center gap-3 text-left pl-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs",
                    AVATAR_COLORS[colorIdx],
                  )}
                >
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <Typography
                    variant="body"
                    className="font-bold text-sidebar-bg truncate"
                  >
                    {fullName || "No name provided"}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="text-xs text-text-secondary truncate"
                  >
                    {item.email}
                  </Typography>
                </div>
              </div>
            );
          }

          if (key === "phoneNumber") {
            return (
              <Typography
                variant="body"
                className="text-sidebar-bg font-medium"
              >
                {item.phoneNumber || "—"}
              </Typography>
            );
          }

          if (key === "role") {
            return item.role === UserRole.Admin ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-role-admin-bg text-role-admin-text border border-role-admin-text/15">
                Admin
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-role-user-bg text-role-user-text border border-role-user-text/15">
                User
              </span>
            );
          }

          if (key === "status") {
            return item.isActive ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-surface-mint text-brand-primary border border-primary/10">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-status-danger-bg text-status-danger-text border border-destructive/10">
                Inactive
              </span>
            );
          }

          if (key === "joined") {
            return (
              <Typography
                variant="body"
                className="text-text-secondary text-sm"
              >
                {formatDate(item.createdAt)}
              </Typography>
            );
          }

          if (key === "actions") {
            return (
              <button
                type="button"
                onClick={() => navigate(`/users/${item.guid}`)}
                className="p-2 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-mint transition-colors cursor-pointer"
                title="View user details"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            );
          }

          return null;
        }}
        paginationBar={
          <PaginationBar
            currentPage={pageNumber}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(page) => setPageNumber(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageNumber(1);
            }}
            pageSizeOptions={[5, 10, 15, 20, 25, 50]}
          />
        }
      />
    </div>
  );
}
