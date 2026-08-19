import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Typography } from "../../../../components/Typography";
import { FormDatePicker } from "../../../../components/ui/form-fields/FormDatePicker";
import { FormInput } from "../../../../components/ui/form-fields/FormInput";
import { createAdminSchema, type CreateAdminFormTypes } from "./admin.schema";

export default function AddAdminForm() {
  const form = useForm({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      fullName: "",
      email: "",
      birthDate: undefined,
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: CreateAdminFormTypes) => {
    console.log("🚀 ~ Create Admin Payload ~ data:", data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="w-full bg-white p-8 rounded-xl border border-border-input shadow-sm space-y-6"
      >
        <div className="space-y-1 text-center sm:text-left">
          <Typography variant="h1" className="text-sidebar-bg font-bold">
            Create your account
          </Typography>
          <Typography variant="muted" className="text-text-secondary">
            Set up your administrator account to get started.
          </Typography>
        </div>

        <div className="space-y-4">
          <FormInput<CreateAdminFormTypes>
            name="fullName"
            label="Full name"
            placeholder="John Smith"
          />

          <FormInput<CreateAdminFormTypes>
            name="email"
            label="Email address"
            type="email"
            placeholder="email@example.com"
          />

          {/* Birth Date Picker */}
          <FormDatePicker<CreateAdminFormTypes>
            name="birthDate"
            label="Birth date"
            placeholder="Select birth date"
          />

          <FormInput<CreateAdminFormTypes>
            name="password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
          />

          <FormInput<CreateAdminFormTypes>
            name="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-brand-primary text-white rounded-[7px] font-medium text-sm hover:bg-brand-primary/90 transition-colors cursor-pointer"
        >
          Create account
        </button>

        <div className="text-center pt-2">
          <Typography variant="caption" className="text-text-secondary">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-brand-primary font-semibold hover:underline text-xs"
            >
              Sign in
            </a>
          </Typography>
        </div>
      </form>
    </FormProvider>
  );
}
