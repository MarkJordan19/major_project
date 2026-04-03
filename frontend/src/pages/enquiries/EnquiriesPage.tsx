import { Calendar, Mail, MessageSquareText, Phone, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/ui/PageHeader";
import { useDeleteEnquiry, useEnquiriesList } from "@/features/enquiries/hooks";
import { useProjectsList } from "@/features/projects/hooks";
import { formatDateTime, pluralize, truncate } from "@/lib/formatters";

const EnquiriesPage = () => {
  const { data: enquiries, isLoading, isError, refetch } = useEnquiriesList();
  const { data: projects } = useProjectsList();
  const deleteMutation = useDeleteEnquiry();

  if (isLoading) return <Loader />;
  if (isError) return <ErrorState message="Failed to load enquiries." onRetry={() => refetch()} />;

  const enquiryList = enquiries ?? [];
  const projectMap = new Map((projects ?? []).map((project) => [project.project_id, project.title]));
  const projectLinked = enquiryList.filter((enquiry) => Boolean(enquiry.project_id)).length;
  const phoneLinked = enquiryList.filter((enquiry) => Boolean(enquiry.phone)).length;
  const hasNoEnquiries = enquiryList.length === 0;

  const handleDelete = async (id: number) => {
    if (!window.confirm("Archive this enquiry from the inbox?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Enquiry archived successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to archive enquiry");
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Client enquiries"
        eyebrow="Lead inbox"
        description="Review new messages, respond quickly, and archive items once they are handled."
        meta={<span className="status-chip status-chip--accent">{pluralize(enquiryList.length, "enquiry", "enquiries")}</span>}
      />

      <div className="summary-grid">
        <Card padding="md" className="summary-card">
          <span>Project linked</span>
          <strong>{projectLinked}</strong>
          <small>messages tied to a specific project</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Phone provided</span>
          <strong>{phoneLinked}</strong>
          <small>clients included a call-back number</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>General enquiries</span>
          <strong>{enquiryList.length - projectLinked}</strong>
          <small>messages about broader studio work</small>
        </Card>
      </div>

      {hasNoEnquiries ? (
        <EmptyState title="Inbox is quiet" description="You do not have any customer messages yet." />
      ) : (
        <div className="stack-grid">
          {enquiryList.map((enquiry) => (
            <Card key={enquiry.enquiry_id} padding="lg" className="enquiry-card">
              <div className="resource-card__header">
                <div>
                  <span className="badge badge--neutral">{enquiry.project_id ? "Project-linked" : "General enquiry"}</span>
                  <h3 className="resource-card__title">{enquiry.name}</h3>
                </div>
                <div className="resource-card__actions">
                  <a className="button button--secondary button--sm" href={`mailto:${enquiry.email}`}>
                    <Mail size={16} />
                    Reply
                  </a>
                  <Button variant="danger" size="sm" className="button--icon" onClick={() => handleDelete(enquiry.enquiry_id)} aria-label={`Archive enquiry from ${enquiry.name}`}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="resource-card__meta">
                <span className="meta-chip">
                  <Mail size={14} />
                  {enquiry.email}
                </span>
                <span className="meta-chip">
                  <Phone size={14} />
                  {enquiry.phone || "No phone number"}
                </span>
                <span className="meta-chip">
                  <MessageSquareText size={14} />
                  {enquiry.project_id ? projectMap.get(enquiry.project_id) || `Project ${enquiry.project_id}` : "General studio enquiry"}
                </span>
              </div>

              <div className="message-card">
                <p>{truncate(enquiry.message, 260)}</p>
              </div>

              <div className="resource-card__footer">
                <span>
                  <Calendar size={14} />
                  Received {formatDateTime(enquiry.submitted_at)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnquiriesPage;
