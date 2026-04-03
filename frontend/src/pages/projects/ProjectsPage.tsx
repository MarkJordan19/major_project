import { useState } from "react";
import { Calendar, Component, Edit2, Image as ImageIcon, MapPin, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loader from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import { useAuthContext } from "@/context/AuthContext";
import { useImagesList } from "@/features/images/hooks";
import ProjectForm from "@/features/projects/ProjectForm";
import { useDeleteProject, useProjectsList } from "@/features/projects/hooks";
import type { Project } from "@/features/projects/types";
import { useAllRoomsList } from "@/features/rooms/hooks";
import { formatDate, humanize, pluralize, truncate } from "@/lib/formatters";

const ProjectsPage = () => {
  const { isAdmin } = useAuthContext();
  const { data: projects, isLoading, isError, refetch } = useProjectsList();
  const { data: rooms } = useAllRoomsList();
  const { data: images } = useImagesList();
  const deleteMutation = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const openCreateModal = () => {
    setEditingProject(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingProject(undefined), 200);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Project deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete project");
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorState message="Failed to load projects." onRetry={() => refetch()} />;

  const projectList = projects ?? [];
  const roomCounts = (rooms ?? []).reduce<Record<number, number>>((accumulator, room) => {
    accumulator[room.project_id] = (accumulator[room.project_id] ?? 0) + 1;
    return accumulator;
  }, {});

  const imageCounts = (images ?? []).reduce<Record<number, number>>((accumulator, image) => {
    if (!image.project_id) return accumulator;
    accumulator[image.project_id] = (accumulator[image.project_id] ?? 0) + 1;
    return accumulator;
  }, {});

  const categoryCounts = projectList.reduce<Record<string, number>>((accumulator, project) => {
    accumulator[project.category] = (accumulator[project.category] ?? 0) + 1;
    return accumulator;
  }, {});

  const hasNoProjects = projectList.length === 0;

  return (
    <div className="page">
      <PageHeader
        title="Project library"
        eyebrow="Portfolio"
        description={
          isAdmin
            ? "Browse the public portfolio and manage the project records visible across the site."
            : "Browse the studio portfolio. Sign in as admin if you want to add or edit project entries."
        }
        meta={<span className="status-chip status-chip--accent">{pluralize(projectList.length, "project")}</span>}
      >
        {isAdmin ? (
          <Button onClick={openCreateModal}>
            <Plus size={16} />
            Add Project
          </Button>
        ) : null}
      </PageHeader>

      <div className="summary-grid">
        <Card padding="md" className="summary-card">
          <span>Residential</span>
          <strong>{categoryCounts.residential ?? 0}</strong>
          <small>homes and lifestyle-led spaces</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Commercial</span>
          <strong>{categoryCounts.commercial ?? 0}</strong>
          <small>hospitality, retail, and brand environments</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Office</span>
          <strong>{categoryCounts.office ?? 0}</strong>
          <small>workplace projects with structured planning</small>
        </Card>
      </div>

      {hasNoProjects ? (
        <EmptyState title="No projects yet" description={isAdmin ? "Start building the portfolio by adding your first project." : "Projects added by the studio will appear here."}>
          {isAdmin ? (
            <Button onClick={openCreateModal}>
              <Plus size={16} />
              Add Project
            </Button>
          ) : null}
        </EmptyState>
      ) : (
        <div className="resource-grid">
          {projectList.map((project) => (
            <Card key={project.project_id} padding="lg" className="resource-card">
              <div className="resource-card__header">
                <div>
                  <span className={`badge badge--${project.category}`}>{humanize(project.category)}</span>
                  <h3 className="resource-card__title">{project.title}</h3>
                </div>
                {isAdmin ? (
                  <div className="resource-card__actions">
                    <Button variant="ghost" size="sm" className="button--icon" onClick={() => openEditModal(project)} aria-label={`Edit ${project.title}`}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="danger" size="sm" className="button--icon" onClick={() => handleDelete(project.project_id)} aria-label={`Delete ${project.title}`}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : null}
              </div>

              <p className="resource-card__description">{truncate(project.description, 150)}</p>

              <div className="resource-card__meta">
                <span className="meta-chip">
                  <MapPin size={14} />
                  {project.location || "Location pending"}
                </span>
                <span className="meta-chip">
                  <Component size={14} />
                  {pluralize(roomCounts[project.project_id] ?? 0, "room")}
                </span>
                <span className="meta-chip">
                  <ImageIcon size={14} />
                  {pluralize(imageCounts[project.project_id] ?? 0, "image")}
                </span>
              </div>

              <div className="resource-card__footer">
                <span>
                  <Calendar size={14} />
                  Created {formatDate(project.created_at)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isAdmin ? (
        <Modal
          isOpen={isModalOpen}
          onClose={closeAndResetModal}
          title={editingProject ? "Edit Project" : "Create New Project"}
          maxWidth="md"
        >
          <ProjectForm initialData={editingProject} onSuccess={closeAndResetModal} onCancel={closeAndResetModal} />
        </Modal>
      ) : null}
    </div>
  );
};

export default ProjectsPage;
