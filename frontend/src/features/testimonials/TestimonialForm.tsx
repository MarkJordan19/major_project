import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useCreateTestimonial } from "./hooks";
import type { CreateTestimonialPayload } from "./types";
import toast from "react-hot-toast";

const testimonialSchema = z.object({
  client_name: z.string().min(1, "Client name is required").max(100),
  content: z.string().min(10, "Testimonial content is required"),
  rating: z.string().optional().nullable(),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

interface TestimonialFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TestimonialForm({ onSuccess, onCancel }: TestimonialFormProps) {
  const createMutation = useCreateTestimonial();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      client_name: "",
      content: "",
      rating: "5",
    },
  });

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      const payload: CreateTestimonialPayload = {
        client_name: data.client_name,
        content: data.content,
        rating: data.rating ? Number(data.rating) : null,
      };

      await createMutation.mutateAsync(payload);
      toast.success("Testimonial created successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error?.response?.data?.message || "Failed to submit testimonial");
    }
  };

  const isLoading = createMutation.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
      <Input
        label="Client name"
        {...register("client_name")}
        error={errors.client_name?.message}
        placeholder="Jane Doe"
      />

      <Textarea
        label="Testimonial"
        hint="A concise quote works best when you plan to feature it across the public website."
          {...register("content")}
        rows={5}
        error={errors.content?.message}
        placeholder="The finished home feels layered, warm, and exactly like us."
      />

      <Select label="Rating" {...register("rating")} error={errors.rating?.message}>
          <option value="">No Rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
      </Select>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Add Testimonial
        </Button>
      </div>
    </form>
  );
}
