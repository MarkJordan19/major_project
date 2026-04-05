import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useProjectsList } from "@/features/projects/hooks";
import { useCreateEnquiry } from "./hooks";
import type { CreateEnquiryPayload } from "./types";

const enquirySchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  email: z.email("Enter a valid email address"),
  phone: z.string().max(30, "Phone number is too long").optional(),
  project_id: z.string().optional(),
  message: z.string().min(10, "Please add a short message").max(2000, "Message is too long"),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface EnquiryFormProps {
  onSuccess?: () => void;
}

const EnquiryForm = ({ onSuccess }: EnquiryFormProps) => {
  const createMutation = useCreateEnquiry();
  const { data: projects } = useProjectsList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      project_id: "",
      message: "",
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    const payload: CreateEnquiryPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone?.trim() ? data.phone.trim() : null,
      project_id: data.project_id ? Number(data.project_id) : null,
      message: data.message,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success("Enquiry submitted successfully");
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to submit enquiry", error);
      toast.error(error?.response?.data?.message || "Unable to submit your enquiry");
    }
  };

  const isLoading = createMutation.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
      <div className="form-grid form-grid--2">
        <Input
          label="Full name"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Your name"
        />
        <Input
          label="Email address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="you@example.com"
        />
      </div>

      <div className="form-grid form-grid--2">
        <Input
          label="Phone number"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="+00 0000 000 000"
        />
        <Select
          label="Project of interest"
          {...register("project_id")}
          error={errors.project_id?.message}
        >
          <option value="">General enquiry</option>
          {(projects ?? []).map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.title}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Tell us about your project"
        hint="Use placeholder copy here now and replace it later if you want different instructions."
        rows={6}
        {...register("message")}
        error={errors.message?.message}
        placeholder="Share the type of space, scope, timeline, and anything else you want the studio to know."
      />

      <div className="form-actions">
        <Button type="submit" isLoading={isLoading}>
          Submit enquiry
        </Button>
      </div>
    </form>
  );
};

export default EnquiryForm;
