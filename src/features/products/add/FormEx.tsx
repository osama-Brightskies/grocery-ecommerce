import { FormInput } from "@/components/ui/form-fields/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { schema, type FormTypes } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/api";

const FormEx = () => {
  const form = useForm<FormTypes>({
    defaultValues: {
      car: "",
    },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FormTypes) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
  };

  const { data } = useQuery({
    queryKey: ["comments"],
    queryFn: () => http.get("/comments/51"),
  });
  console.log("🚀 ~ FormEx ~ data:", data);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput<FormTypes> label="name" name="car" placeholder="enter car" />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

export default FormEx;
