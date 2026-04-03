import { useProjectsList } from "@/features/projects/hooks";
import { useAllRoomsList } from "@/features/rooms/hooks";
import { useEnquiriesList } from "@/features/enquiries/hooks";
import { useTestimonialsList } from "@/features/testimonials/hooks";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import { FolderKanban, Component, MessageSquareText, Users } from "lucide-react";

export default function Dashboard() {
  const { data: projects, isLoading: projectsLoading } = useProjectsList();
  const { data: rooms, isLoading: roomsLoading } = useAllRoomsList();
  const { data: enquiries, isLoading: enquiriesLoading } = useEnquiriesList();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonialsList();

  const Skeleton = () => <div className="w-12 h-6 bg-gray-100 animate-pulse rounded" />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Overview" 
        description="Welcome back. Here is a quick summary of your interior design platform."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={projectsLoading ? <Skeleton /> : projects?.length || 0}
          icon={<FolderKanban className="w-6 h-6" />}
        />
        <StatCard
          title="Total Rooms"
          value={roomsLoading ? <Skeleton /> : rooms?.length || 0}
          icon={<Component className="w-6 h-6" />}
        />
        <StatCard
          title="New Enquiries"
          value={enquiriesLoading ? <Skeleton /> : enquiries?.length || 0}
          icon={<MessageSquareText className="w-6 h-6" />}
        />
        <StatCard
          title="Testimonials"
          value={testimonialsLoading ? <Skeleton /> : testimonials?.length || 0}
          icon={<Users className="w-6 h-6" />}
        />
      </div>
    </div>
  );
}