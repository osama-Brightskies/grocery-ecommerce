import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserX } from "lucide-react";
import { Typography } from "@/components/ui/shared/Typography";
import { Button } from "@/components/ui/button";

export function UserNotFoundState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-12">
      <button
        type="button"
        onClick={() => navigate("/users")}
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-sidebar-bg transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <Typography variant="body" className="font-medium text-inherit">
          Back to Users
        </Typography>
      </button>

      <div className="bg-card rounded-2xl border border-border p-10 text-center shadow-xs space-y-4">
        <div className="w-14 h-14 rounded-full bg-status-danger-bg text-status-danger-text flex items-center justify-center mx-auto mb-2">
          <UserX className="w-7 h-7" />
        </div>

        <Typography variant="h2" className="text-xl font-bold text-sidebar-bg">
          User not found
        </Typography>

        <Typography
          variant="muted"
          className="text-sm text-text-secondary max-w-md mx-auto"
        >
          The user you are looking for does not exist or may have been deleted.
        </Typography>

        <div className="pt-4 flex justify-center">
          <Button
            variant="primary"
            size="default"
            onClick={() => navigate("/users")}
            className="cursor-pointer font-semibold shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <Typography variant="body" className="font-semibold text-white">
              Return to User List
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserNotFoundState;
