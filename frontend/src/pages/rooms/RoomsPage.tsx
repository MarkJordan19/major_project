import { useState } from "react";
import { Component, Edit2, FolderKanban, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loader from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import { useAuthContext } from "@/context/AuthContext";
import { useProjectsList } from "@/features/projects/hooks";
import RoomForm from "@/features/rooms/RoomForm";
import { useAllRoomsList, useDeleteRoom } from "@/features/rooms/hooks";
import type { Room } from "@/features/rooms/types";
import { humanize, pluralize, truncate } from "@/lib/formatters";

const RoomsPage = () => {
  const { isAdmin } = useAuthContext();
  const { data: rooms, isLoading, isError, refetch } = useAllRoomsList();
  const { data: projects } = useProjectsList();
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
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Room deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete room");
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorState message="Failed to load rooms." onRetry={() => refetch()} />;

  const roomList = rooms ?? [];
  const projectMap = new Map((projects ?? []).map((project) => [project.project_id, project.title]));
  const roomTypeCounts = roomList.reduce<Record<string, number>>((accumulator, room) => {
    accumulator[room.room_type] = (accumulator[room.room_type] ?? 0) + 1;
    return accumulator;
  }, {});

  const mostPopularType = Object.entries(roomTypeCounts).sort((left, right) => right[1] - left[1])[0];
  const hasNoRooms = roomList.length === 0;

  return (
    <div className="page">
      <PageHeader
        title="Room catalogue"
        eyebrow="Spatial planning"
        description={
          isAdmin
            ? "Review the room catalogue and manage the room records associated with each project."
            : "Browse the room catalogue across the public portfolio. Admins can sign in to manage entries."
        }
        meta={<span className="status-chip status-chip--accent">{pluralize(roomList.length, "room")}</span>}
      >
        {isAdmin ? (
          <Button onClick={openCreateModal}>
            <Plus size={16} />
            Add Room
          </Button>
        ) : null}
      </PageHeader>

      <div className="summary-grid">
        <Card padding="md" className="summary-card">
          <span>Most common</span>
          <strong>{mostPopularType ? humanize(mostPopularType[0]) : "None yet"}</strong>
          <small>{mostPopularType ? pluralize(mostPopularType[1], "room") : "Add a room to start"}</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Projects covered</span>
          <strong>{new Set(roomList.map((room) => room.project_id)).size}</strong>
          <small>projects currently have room records</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Descriptions added</span>
          <strong>{roomList.filter((room) => Boolean(room.description)).length}</strong>
          <small>rooms include extra planning notes</small>
        </Card>
      </div>

      {hasNoRooms ? (
        <EmptyState title="No rooms yet" description={isAdmin ? "Rooms will appear here once you attach them to a project." : "Rooms added by the studio will appear here."}>
          {isAdmin ? (
            <Button onClick={openCreateModal}>
              <Plus size={16} />
              Add Room
            </Button>
          ) : null}
        </EmptyState>
      ) : (
        <div className="resource-grid">
          {roomList.map((room) => (
            <Card key={room.room_id} padding="lg" className="resource-card">
              <div className="resource-card__header">
                <div>
                  <span className="badge badge--neutral">{humanize(room.room_type)}</span>
                  <h3 className="resource-card__title">{humanize(room.room_type)} #{room.room_id}</h3>
                </div>
                {isAdmin ? (
                  <div className="resource-card__actions">
                    <Button variant="ghost" size="sm" className="button--icon" onClick={() => openEditModal(room)} aria-label={`Edit room ${room.room_id}`}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="danger" size="sm" className="button--icon" onClick={() => handleDelete(room.room_id)} aria-label={`Delete room ${room.room_id}`}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : null}
              </div>

              <p className="resource-card__description">{truncate(room.description, 140)}</p>

              <div className="resource-card__meta">
                <span className="meta-chip">
                  <FolderKanban size={14} />
                  {projectMap.get(room.project_id) || `Project ${room.project_id}`}
                </span>
                <span className="meta-chip">
                  <Component size={14} />
                  Project ID {room.project_id}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isAdmin ? (
        <Modal isOpen={isModalOpen} onClose={closeAndResetModal} title={editingRoom ? "Edit Room" : "Add Room to Project"}>
          <RoomForm initialData={editingRoom} onSuccess={closeAndResetModal} onCancel={closeAndResetModal} />
        </Modal>
      ) : null}
    </div>
  );
};

export default RoomsPage;
