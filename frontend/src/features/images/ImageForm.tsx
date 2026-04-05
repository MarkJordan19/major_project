import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useProjectsList } from "@/features/projects/hooks";
import { useAllRoomsList } from "@/features/rooms/hooks";
import { useCreateImage } from "./hooks";
import type { CreateImagePayload } from "./types";
import toast from "react-hot-toast";

const imageSchema = z.object({
  image_url: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  alt_text: z.string().max(255).optional(),
  project_id: z.string().optional(),
  room_id: z.string().optional(),
});

type ImageFormData = z.infer<typeof imageSchema>;

interface ImageFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ImageForm({ onSuccess, onCancel }: ImageFormProps) {
  const createMutation = useCreateImage();
  const { data: projects, isLoading: fetchingProjects } = useProjectsList();
  const { data: rooms, isLoading: fetchingRooms } = useAllRoomsList();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image_url: "",
      alt_text: "",
      project_id: "",
      room_id: "",
    },
  });

  const selectedProjectId = watch("project_id");
  const filteredRooms = selectedProjectId
    ? (rooms ?? []).filter((room) => room.project_id === Number(selectedProjectId))
    : [];

  const onSubmit = async (data: ImageFormData) => {
    try {
      const payload: CreateImagePayload = {
        image_url: data.image_url,
        alt_text: data.alt_text || undefined,
        project_id: data.project_id ? Number(data.project_id) : undefined,
        room_id: data.room_id ? Number(data.room_id) : undefined,
      };

      await createMutation.mutateAsync(payload);
      toast.success("Image uploaded successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload image");
    }
  };

  const isLoading = createMutation.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
      <Input
        label="Image URL"
        hint="Use a direct image link from your CDN, storage bucket, or asset server."
        {...register("image_url")}
        error={errors.image_url?.message}
        placeholder="https://example.com/image.jpg"
      />

      <Input
        label="Alt Text (Optional)"
        {...register("alt_text")}
        error={errors.alt_text?.message}
        placeholder="Living room angle 1"
      />

      <div className="form-grid form-grid--2">
        <Select
          label="Assign to project"
          {...register("project_id")}
          disabled={fetchingProjects}
          error={errors.project_id?.message}
        >
          <option value="">None / Unassigned</option>
          {projects?.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.title} (ID: {project.project_id})
            </option>
          ))}
        </Select>

        <Select
          label="Assign to room"
          hint={selectedProjectId ? "Optional, but useful when you want gallery entries tied to a specific room." : "Choose a project first to unlock room options."}
          {...register("room_id")}
          disabled={!selectedProjectId || fetchingRooms}
          error={errors.room_id?.message}
        >
          <option value="">None / General project image</option>
          {filteredRooms.map((room) => (
            <option key={room.room_id} value={room.room_id}>
              {room.room_type} (Room ID: {room.room_id})
            </option>
          ))}
        </Select>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Upload Image
        </Button>
      </div>
    </form>
  );
}
