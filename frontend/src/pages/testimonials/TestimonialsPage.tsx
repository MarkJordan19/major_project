import { useState } from "react";
import { Calendar, Plus, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loader from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import TestimonialForm from "@/features/testimonials/TestimonialForm";
import { useDeleteTestimonial, useTestimonialsList } from "@/features/testimonials/hooks";
import { formatDate, pluralize, truncate } from "@/lib/formatters";

const renderStars = (rating: number | null) =>
  Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={16}
      className={["rating-star", rating && index < rating ? "is-filled" : ""].filter(Boolean).join(" ")}
    />
  ));

const TestimonialsPage = () => {
  const { data: testimonials, isLoading, isError, refetch } = useTestimonialsList();
  const deleteMutation = useDeleteTestimonial();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Testimonial deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete testimonial");
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorState message="Failed to load testimonials." onRetry={() => refetch()} />;

  const testimonialList = testimonials ?? [];
  const averageRating = testimonialList.length
    ? testimonialList.reduce((sum, testimonial) => sum + (testimonial.rating ?? 0), 0) / testimonialList.length
    : 0;
  const hasNoTestimonials = testimonialList.length === 0;

  return (
    <div className="page">
      <PageHeader
        title="Testimonials"
        eyebrow="Social proof"
        description="Feature polished client feedback and keep your strongest reviews close at hand."
        meta={<span className="status-chip status-chip--accent">{pluralize(testimonialList.length, "testimonial")}</span>}
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Add Testimonial
        </Button>
      </PageHeader>

      <div className="summary-grid">
        <Card padding="md" className="summary-card">
          <span>Average rating</span>
          <strong>{testimonialList.length ? averageRating.toFixed(1) : "N/A"}</strong>
          <small>overall client sentiment</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Five-star reviews</span>
          <strong>{testimonialList.filter((testimonial) => testimonial.rating === 5).length}</strong>
          <small>top-tier endorsements for the studio</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Anonymous</span>
          <strong>{testimonialList.filter((testimonial) => !testimonial.client_name).length}</strong>
          <small>reviews missing a client attribution</small>
        </Card>
      </div>

      {hasNoTestimonials ? (
        <EmptyState title="No testimonials yet" description="Add your first client review to strengthen the studio's proof story.">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Add Testimonial
          </Button>
        </EmptyState>
      ) : (
        <div className="resource-grid">
          {testimonialList.map((testimonial) => (
            <Card key={testimonial.testimonial_id} padding="lg" className="testimonial-card">
              <div className="resource-card__header">
                <div>
                  <span className="badge badge--neutral">Client feedback</span>
                  <h3 className="resource-card__title">{testimonial.client_name || "Anonymous client"}</h3>
                </div>
                <Button variant="danger" size="sm" className="button--icon" onClick={() => handleDelete(testimonial.testimonial_id)} aria-label={`Delete testimonial ${testimonial.testimonial_id}`}>
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
                <span>{testimonial.rating ? `${testimonial.rating}/5` : "No rating"}</span>
              </div>

              <blockquote className="testimonial-quote">"{truncate(testimonial.content, 180)}"</blockquote>

              <div className="resource-card__footer">
                <span>
                  <Calendar size={14} />
                  Added {formatDate(testimonial.created_at)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Testimonial">
        <TestimonialForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default TestimonialsPage;
