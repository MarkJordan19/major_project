import { useState } from "react";
import { useTestimonialsList, useDeleteTestimonial } from "@/features/testimonials/hooks";
import TestimonialForm from "@/features/testimonials/TestimonialForm";
import Loader from "@/components/ui/Loader";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function Testimonials() {
  const { data: testimonials, isLoading, isError, refetch } = useTestimonialsList();
  const deleteMutation = useDeleteTestimonial();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Testimonial deleted successfully");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to delete testimonial");
      }
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorState message="Failed to load testimonials." onRetry={() => refetch()} />;

  const hasNoTestimonials = !testimonials || testimonials.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Testimonials" 
        description="Manage client reviews and feedback to feature on your site."
      >
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </PageHeader>

      {hasNoTestimonials ? (
        <EmptyState title="No testimonials found" description="Add your first client review to showcase your work." />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.testimonial_id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{testimonial.client_name || "Anonymous"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{testimonial.rating || 0}/5</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-sm truncate italic">
                        "{testimonial.content}"
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(testimonial.testimonial_id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
        onClose={() => setIsModalOpen(false)}
        title="Add Testimonial"
      >
        <TestimonialForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
