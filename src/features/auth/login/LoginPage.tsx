import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"; // Imported Link
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { FormInput } from "../../../components/ui/form-fields/FormInput";
import { useLogin } from "./hooks/useLogin";
import { loginSchema, type LoginFormTypes } from "./schemas/login.schema";
import { Typography } from "@/components/ui/shared/Typography";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending,
    error: apiError,
  } = useLogin({
    onSuccess: () => {
      toast.success("Welcome back!");
      navigate("/dashboard");
    },
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: LoginFormTypes) => {
    login(data);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <Typography
          variant="h1"
          className="text-3xl lg:text-4xl font-bold text-sidebar-bg"
        >
          Welcome back
        </Typography>
        <Typography variant="muted" className="text-text-secondary text-sm">
          Sign in to continue to your dashboard
        </Typography>
      </div>

      {/* Red Error Banner */}
      {apiError && (
        <div className="p-4 bg-status-danger-bg border border-status-danger-text/30 rounded-[7px] animate-in fade-in slide-in-from-top-1">
          <Typography
            variant="caption"
            className="text-status-danger-text font-medium text-xs"
          >
            {apiError.message ||
              "Failed to sign in. Please check your credentials."}
          </Typography>
        </div>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <FormInput<LoginFormTypes>
            name="email"
            label="Email address"
            type="email"
            placeholder="email@example.com"
          />

          <div className="space-y-2">
            <FormInput<LoginFormTypes>
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••••••"
            />

            {/* Forgot Password Link with React Router Navigation */}
            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-brand-primary text-xs font-medium hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full h-11 rounded-[7px]"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
