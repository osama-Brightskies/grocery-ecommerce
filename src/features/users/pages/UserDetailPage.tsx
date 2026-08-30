import { useParams } from "react-router-dom";
import { Typography } from "@/components/ui/shared/Typography";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="space-y-6">
      <Typography variant="h1">User Detail</Typography>
      <Typography variant="muted">User ID: {userId}</Typography>
    </div>
  );
}