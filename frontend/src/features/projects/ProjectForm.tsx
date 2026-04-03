import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useCreateProject, useUpdateProject } from "./hooks";
import type { CreateProjectPayload, Project } from "./types";
import toast from "react-hot-toast";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).nullable().optional(),
  category: z.enum(["residential", "commercial", "office"]),
  location: z.string().max(255).nullable().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const defaultValues: ProjectFormData = {
    title: "",
    description: "",
    category: "residential",
    location: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        category: initialData.category,
        location: initialData.location || "",
      });
      return;
    }

    reset(defaultValues);
  }, [defaultValues, initialData, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.project_id, data });
        toast.success("Project updated successfully");
      } else {
        await createMutation.mutateAsync(data as CreateProjectPayload);
        toast.success("Project created successfully");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
      <div className="form-grid form-grid--2">
        <Input
          label="Project title"
          {...register("title")}
          error={errors.title?.message}
          placeholder="Modern Downtown Loft"
        />

        <Select label="Category" {...register("category")} error={errors.category?.message}>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="office">Office</option>
        </Select>
      </div>

      <Input
        label="Location"
        {...register("location")}
        error={errors.location?.message}
        placeholder="New York, NY"
      />

      <Textarea
        label="Project story"
        hint="Add the concept, materials, or design direction the team should remember."
        rows={5}
        {...register("description")}
        error={errors.description?.message}
        placeholder="Describe the mood, scope, and standout details of this project."
      />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
