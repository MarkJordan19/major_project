import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useProjectsList } from "@/features/projects/hooks";
import { useCreateRoom, useUpdateRoom } from "./hooks";
import type { CreateRoomPayload, Room } from "./types";
import toast from "react-hot-toast";

const roomSchema = z.object({
  project_id: z.string().min(1, "Project is required"),
  room_type: z.enum(["living", "bedroom", "kitchen", "bathroom", "office", "other"]),
  description: z.string().max(1000).nullable().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  initialData?: Room;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RoomForm({ initialData, onSuccess, onCancel }: RoomFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom();
  const { data: projects, isLoading: fetchingProjects } = useProjectsList();
  const defaultValues: RoomFormData = {
    project_id: "",
    room_type: "living",
    description: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        project_id: initialData.project_id.toString(),
        room_type: initialData.room_type,
        description: initialData.description || "",
      });
      return;
    }

    reset(defaultValues);
  }, [defaultValues, initialData, reset]);

  const onSubmit = async (data: RoomFormData) => {
    try {
      const payload = {
        room_type: data.room_type,
        description: data.description,
      };
      
      const projectId = Number(data.project_id);

      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.room_id, data: payload });
        toast.success("Room updated successfully");
      } else {
        await createMutation.mutateAsync({ projectId, data: payload as CreateRoomPayload });
        toast.success("Room created successfully");
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
        <Select
          label="Project"
          hint={isEditing ? "Project assignment is locked while editing an existing room." : "Choose the project this room belongs to."}
          {...register("project_id")}
          disabled={isEditing || fetchingProjects}
          error={errors.project_id?.message}
        >
          <option value="">Select a project...</option>
          {projects?.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.title} (ID: {project.project_id})
            </option>
          ))}
        </Select>

        <Select label="Room type" {...register("room_type")} error={errors.room_type?.message}>
          <option value="living">Living Room</option>
          <option value="bedroom">Bedroom</option>
          <option value="kitchen">Kitchen</option>
          <option value="bathroom">Bathroom</option>
          <option value="office">Office</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <Textarea
        label="Room notes"
        hint="Capture dimensions, material ideas, or anything helpful for the execution team."
          {...register("description")}
        rows={4}
        error={errors.description?.message}
        placeholder="Dimensions, style notes, or furniture ideas."
      />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? "Save Changes" : "Create Room"}
        </Button>
      </div>
    </form>
  );
}
