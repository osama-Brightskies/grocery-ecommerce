import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FormInput } from "@/components/ui/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import {
  updateUserSchema,
  type UpdateUserFormValues,
} from "../schemas/user.schema";
import { useUpdateUser } from "../hooks/useUpdateUser";
import type { User } from "../types/users.types";

type EditUserSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

export default function EditUserSheet({
  isOpen,
  onClose,
  user,
}: EditUserSheetProps) {
  // 1. Initialize Form
  const methods = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
  });

  const {
    formState: { isDirty },
  } = methods;

  // Re-sync values when sheet opens
  useEffect(() => {
    if (isOpen && user) {
      methods.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phoneNumber: user.phoneNumber ?? "",
      });
    }
  }, [isOpen, user, methods]);

  // 2. Mutation Hook
  const { mutate: updateUser, isPending } = useUpdateUser({
    onSuccess: () => {
      toast.success("User updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const onSubmit = (values: UpdateUserFormValues) => {
    updateUser({
      userId: user.guid,
      payload: {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        isActive: user.isActive,
      },
    });
  };

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col justify-between p-6 bg-card">
        <div className="space-y-6">
          {/* Header */}
          <SheetHeader className="space-y-1 p-0 text-left">
            <SheetTitle className="text-2xl font-bold text-sidebar-bg">
              Edit user
            </SheetTitle>
            <SheetDescription className="text-sm text-text-secondary">
              Update {fullName || "user"}&apos;s profile information.
            </SheetDescription>
          </SheetHeader>

          {/* Form Fields */}
          <FormProvider {...methods}>
            <form
              id="edit-user-form"
              onSubmit={methods.handleSubmit(onSubmit, (errors) => {
                console.error("Validation Errors:", errors);
              })}
              className="space-y-4"
            >
              <FormInput<UpdateUserFormValues>
                label="First name"
                name="firstName"
                placeholder="Enter first name"
              />

              <FormInput<UpdateUserFormValues>
                label="Last name"
                name="lastName"
                placeholder="Enter last name"
              />

              <FormInput<UpdateUserFormValues>
                label="Phone number"
                name="phoneNumber"
                placeholder="Enter phone number"
              />
            </form>
          </FormProvider>
        </div>

        {/* Footer Actions with Custom CVA Button */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-auto">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            disabled={isPending}
            className="bg-surface-mint text-sidebar-bg border-none hover:bg-surface-mint/80 font-semibold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-user-form"
            variant="primary"
            size="default"
            disabled={isPending || !isDirty}
            className="font-semibold cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "Saving..." : "Save changes"}</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}