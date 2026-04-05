import { useState } from "react";
import { useAllRoomsList, useDeleteRoom } from "@/features/rooms/hooks";
import type { Room } from "@/features/rooms/types";
import RoomForm from "@/features/rooms/RoomForm";
import Loader from "@/components/ui/Loader";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Rooms() {
  const { data: rooms, isLoading, isError, refetch } = useAllRoomsList();
  const deleteMutation = useDeleteRoom();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>();

  const openCreateModal = () => {
    setEditingRoom(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingRoom(undefined), 200);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Room deleted successfully");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to delete room");
      }
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorState message="Failed to load rooms." onRetry={() => refetch()} />;

  const hasNoRooms = !rooms || rooms.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Rooms" 
        description="View all categorized rooms across your projects."
      >
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Room
        </Button>
      </PageHeader>

      {hasNoRooms ? (
        <EmptyState title="No rooms found" description="Rooms will appear here once you add them to a project." />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room Type</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project ID</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room.room_id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 capitalize">{room.room_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {room.project_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {room.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditModal(room)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDelete(room.room_id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeAndResetModal}
        title={editingRoom ? "Edit Room" : "Add Room to Project"}
      >
        <RoomForm
          initialData={editingRoom}
          onSuccess={closeAndResetModal}
          onCancel={closeAndResetModal}
        />
      </Modal>
    </div>
  );
}
