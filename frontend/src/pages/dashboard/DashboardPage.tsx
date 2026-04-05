import { Link } from "react-router-dom";
import { ArrowRight, Component, FolderKanban, Image as ImageIcon, MessageSquareText, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { useEnquiriesList } from "@/features/enquiries/hooks";
import { useImagesList } from "@/features/images/hooks";
import { useProjectsList } from "@/features/projects/hooks";
import { useAllRoomsList } from "@/features/rooms/hooks";
import { useTestimonialsList } from "@/features/testimonials/hooks";
import { formatDate, pluralize, truncate } from "@/lib/formatters";

const DashboardPage = () => {
  const { data: projects, isLoading: projectsLoading } = useProjectsList();
  const { data: rooms, isLoading: roomsLoading } = useAllRoomsList();
  const { data: images, isLoading: imagesLoading } = useImagesList();
  const { data: enquiries, isLoading: enquiriesLoading } = useEnquiriesList();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonialsList();

  const totalProjects = projects?.length ?? 0;
  const totalRooms = rooms?.length ?? 0;
  const totalImages = images?.length ?? 0;
  const totalEnquiries = enquiries?.length ?? 0;
  const totalTestimonials = testimonials?.length ?? 0;
  const averageRating = totalTestimonials
    ? (testimonials?.reduce((sum, testimonial) => sum + (testimonial.rating ?? 0), 0) ?? 0) / totalTestimonials
    : 0;

  const latestProjects = [...(projects ?? [])]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .slice(0, 3);

  const latestEnquiries = [...(enquiries ?? [])]
    .sort((left, right) => new Date(right.submitted_at).getTime() - new Date(left.submitted_at).getTime())
    .slice(0, 3);

  const latestTestimonials = [...(testimonials ?? [])]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .slice(0, 3);

  const projectCategories = new Set((projects ?? []).map((project) => project.category));
  const roomCoverage = totalProjects ? Math.round(totalRooms / totalProjects) : 0;
  const galleryCoverage = totalProjects ? Math.round(totalImages / totalProjects) : 0;

  return (
    <div className="page">
      <PageHeader
        title="Studio overview"
        eyebrow="Dashboard"
        description="A quick pulse-check on your portfolio, gallery, and incoming client activity."
        meta={<span className="status-chip status-chip--accent">{pluralize(totalProjects, "project")}</span>}
      >
        <Link className="button button--primary button--md" to="/projects">
          Manage projects
          <ArrowRight size={16} />
        </Link>
        <Link className="button button--secondary button--md" to="/enquiries">
          Review enquiries
        </Link>
      </PageHeader>

      <Card padding="lg" className="hero-panel">
        <div className="hero-panel__content">
          <p className="hero-panel__eyebrow">Studio command view</p>
          <h3 className="hero-panel__title">Everything important is visible in one calm, polished control room.</h3>
          <p className="hero-panel__description">
            Track new business, keep the portfolio structured, and make sure every image and testimonial is ready for the public site.
          </p>
          <div className="hero-panel__actions">
            <Link className="button button--primary button--md" to="/images">
              Curate image library
            </Link>
            <Link className="button button--ghost button--md" to="/testimonials">
              Refresh social proof
            </Link>
          </div>
        </div>

        <div className="hero-panel__stats">
          <div className="hero-metric">
            <span>Portfolio breadth</span>
            <strong>{projectCategories.size || 0}</strong>
            <small>{pluralize(projectCategories.size || 0, "category")}</small>
          </div>
          <div className="hero-metric">
            <span>Room coverage</span>
            <strong>{roomCoverage}</strong>
            <small>{pluralize(roomCoverage, "room")} per project</small>
          </div>
          <div className="hero-metric">
            <span>Gallery depth</span>
            <strong>{galleryCoverage}</strong>
            <small>{pluralize(galleryCoverage, "image")} per project</small>
          </div>
        </div>
      </Card>

      <div className="stat-grid">
        <StatCard
          title="Projects"
          value={totalProjects}
          description="Active portfolio entries available to the team."
          icon={<FolderKanban size={22} />}
          loading={projectsLoading}
          tone="accent"
        />
        <StatCard
          title="Rooms"
          value={totalRooms}
          description="Detailed spaces recorded across your projects."
          icon={<Component size={22} />}
          loading={roomsLoading}
          tone="forest"
        />
        <StatCard
          title="Gallery images"
          value={totalImages}
          description="Visual assets ready to support project storytelling."
          icon={<ImageIcon size={22} />}
          loading={imagesLoading}
          tone="gold"
        />
        <StatCard
          title="Enquiries"
          value={totalEnquiries}
          description="Fresh leads and client conversations awaiting attention."
          icon={<MessageSquareText size={22} />}
          loading={enquiriesLoading}
          tone="slate"
        />
        <StatCard
          title="Average rating"
          value={totalTestimonials ? averageRating.toFixed(1) : "N/A"}
          description="Overall sentiment based on collected testimonials."
          icon={<Star size={22} />}
          loading={testimonialsLoading}
          tone="accent"
        />
      </div>

      <div className="dashboard-grid">
        <Card padding="lg" className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Recent additions</p>
              <h3 className="dashboard-panel__title">Latest projects</h3>
            </div>
            <Link to="/projects" className="dashboard-panel__link">
              Open library
            </Link>
          </div>

          {latestProjects.length ? (
            <div className="dashboard-list">
              {latestProjects.map((project) => (
                <div key={project.project_id} className="dashboard-list__item">
                  <div>
                    <strong>{project.title}</strong>
                    <p>{truncate(project.description, 100)}</p>
                  </div>
                  <div className="dashboard-list__meta">
                    <span className={`badge badge--${project.category}`}>{project.category}</span>
                    <small>{formatDate(project.created_at)}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-panel__empty">No projects yet. Add your first one to start building the studio portfolio.</p>
          )}
        </Card>

        <Card padding="lg" className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Lead flow</p>
              <h3 className="dashboard-panel__title">Fresh enquiries</h3>
            </div>
            <Link to="/enquiries" className="dashboard-panel__link">
              Open inbox
            </Link>
          </div>

          {latestEnquiries.length ? (
            <div className="dashboard-list">
              {latestEnquiries.map((enquiry) => (
                <div key={enquiry.enquiry_id} className="dashboard-list__item">
                  <div>
                    <strong>{enquiry.name}</strong>
                    <p>{truncate(enquiry.message, 100)}</p>
                  </div>
                  <div className="dashboard-list__meta">
                    <span className="status-chip status-chip--neutral">{enquiry.project_id ? "Project-linked" : "General"}</span>
                    <small>{formatDate(enquiry.submitted_at)}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-panel__empty">No enquiries yet. New client messages will appear here when they arrive.</p>
          )}
        </Card>

        <Card padding="lg" className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Client voice</p>
              <h3 className="dashboard-panel__title">Latest testimonials</h3>
            </div>
            <Link to="/testimonials" className="dashboard-panel__link">
              Open reviews
            </Link>
          </div>

          {latestTestimonials.length ? (
            <div className="dashboard-quote-list">
              {latestTestimonials.map((testimonial) => (
                <article key={testimonial.testimonial_id} className="dashboard-quote">
                  <div className="dashboard-quote__rating">
                    <Star size={16} />
                    <span>{testimonial.rating ?? "No rating"}</span>
                  </div>
                  <p>{truncate(testimonial.content, 120)}</p>
                  <footer>
                    <strong>{testimonial.client_name || "Anonymous client"}</strong>
                    <small>{formatDate(testimonial.created_at)}</small>
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <p className="dashboard-panel__empty">No testimonials yet. Once feedback comes in, this area becomes your proof wall.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
