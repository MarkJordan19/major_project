import { useState } from "react";
import { useProjectsList, useDeleteProject } from "@/features/projects/hooks";
import type { Project } from "@/features/projects/types";
import ProjectForm from "@/features/projects/ProjectForm";
import Loader from "@/components/ui/Loader";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Projects() {
  const { data: projects, isLoading, isError, refetch } = useProjectsList();
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
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Project deleted successfully");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to delete project");
      }
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorState message="Failed to load projects." onRetry={() => refetch()} />;

  const hasNoProjects = !projects || projects.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Projects" 
        description="Manage your interior design projects here."
      >
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </PageHeader>

      {hasNoProjects ? (
        <EmptyState title="No projects found" description="Get started by creating a new project." />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.project_id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      <div className="text-xs text-gray-500">Created {new Date(project.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 uppercase">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {project.location || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditModal(project)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDelete(project.project_id)}
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
        title={editingProject ? "Edit Project" : "Create New Project"}
        maxWidth="md"
      >
        <ProjectForm 
          initialData={editingProject} 
          onSuccess={closeAndResetModal} 
          onCancel={closeAndResetModal} 
        />
      </Modal>
    </div>
  );
}
