import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, ChevronRight } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { PaginationBar } from "@/components/ui/pagination";
import { Typography } from "@/components/ui/shared/Typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetUsers } from "../hooks/useGetUsers";
import { UserRole } from "@/store/types/authStore.types";
import { formatDate, getInitials, cn } from "@/lib/utils";
import type { User } from "../types/users.types";
import { AppTable, type DefaultTableFeatures } from "@/components/ui/AppTable";

const AVATAR_COLORS = [
  "bg-avatar-emerald text-white",
  "bg-avatar-green text-white",
  "bg-avatar-purple text-white",
  "bg-avatar-blue text-white",
  "bg-avatar-orange text-white",
  "bg-avatar-pink text-white",
];

// Initialize Column Helper using the shared table features type
const columnHelper = createColumnHelper<DefaultTableFeatures, User>();

export default function UsersListPage() {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // TanStack Query Hook
  const { data: response, isLoading } = useGetUsers({
    pageNumber,
    pageSize,
  });

  const rawUsers = response?.data?.data ?? [];
  const pagination = response?.data?.pagination;
  const totalCount = pagination?.totalCount ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  // TanStack Table Column Definitions
  const columns = useMemo(
    () =>
      columnHelper.columns([
        // 1. User Avatar + Name + Email
        columnHelper.accessor("firstName", {
          id: "user",
          header: "USER",
          cell: ({ row }) => {
            const user = row.original;
            const initials = getInitials(
              user.firstName,
              user.lastName,
              user.email,
            );
            const colorIdx =
              Math.abs(user.guid.charCodeAt(0) || 0) % AVATAR_COLORS.length;
            const fullName =
              [user.firstName, user.lastName]
                .filter(Boolean)
                .join(" ")
                .trim() || "No name provided";

            return (
              <div className="flex items-center gap-3 text-left pl-2">
                <Avatar
                  size="default"
                  className={cn("shrink-0 shadow-xs", AVATAR_COLORS[colorIdx])}
                >
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <Typography
                    variant="body"
                    className="font-bold text-sidebar-bg truncate"
                  >
                    {fullName}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="text-xs text-text-secondary truncate"
                  >
                    {user.email}
                  </Typography>
                </div>
              </div>
            );
          },
        }),

        // 2. Phone Number
        columnHelper.accessor("phoneNumber", {
          header: "PHONE NUMBER",
          cell: (info) => (
            <Typography variant="body" className="text-sidebar-bg font-medium">
              {info.getValue() || "—"}
            </Typography>
          ),
        }),

        // 3. Role Badge
        columnHelper.accessor("role", {
          header: "ROLE",
          cell: (info) => {
            const role = info.getValue();
            return role === UserRole.Admin ? (
              <Badge className="bg-role-admin-bg text-role-admin-text border-role-admin-text/15">
                Admin
              </Badge>
            ) : (
              <Badge className="bg-role-user-bg text-role-user-text border-role-user-text/15">
                User
              </Badge>
            );
          },
        }),

        // 4. Status Badge
        columnHelper.accessor("isActive", {
          header: "STATUS",
          cell: (info) => {
            const isActive = info.getValue();
            return (
              <Badge variant={isActive ? "primary" : "danger"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            );
          },
        }),

        // 5. Joined Date
        columnHelper.accessor("createdAt", {
          header: "JOINED",
          cell: (info) => (
            <Typography variant="body" className="text-text-secondary text-sm">
              {formatDate(info.getValue())}
            </Typography>
          ),
        }),

        // 6. Action Button (Chevron Link)
        columnHelper.display({
          id: "actions",
          header: "ACTIONS",
          cell: ({ row }) => (
            <button
              type="button"
              onClick={() => navigate(`/users/${row.original.guid}`)}
              className="p-2 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-mint transition-colors cursor-pointer"
              title="View user details"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          ),
        }),
      ]),
    [navigate],
  );

  return (
    <div className="space-y-6">
      {/* Header & Counter Badge */}
      <div className="space-y-3">
        <Typography variant="h1">Users</Typography>
        <Typography variant="muted">
          View and manage registered users
        </Typography>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-mint border border-primary/20 text-brand-primary text-xs font-semibold">
          <UsersIcon className="w-4 h-4 text-brand-primary" />
          <Typography
            variant="body"
            className="text-xs font-semibold text-brand-primary"
          >
            {totalCount} users
          </Typography>
        </div>
      </div>

      {/* AppTable */}
      <AppTable
        data={rawUsers}
        columns={columns}
        isLoading={isLoading}
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