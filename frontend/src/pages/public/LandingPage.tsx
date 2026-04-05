import { ArrowRight, BadgeCheck, Image as ImageIcon, MessageSquareText, Sofa } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import { useTestimonialsList } from "@/features/testimonials/hooks";
import { useProjectsList } from "@/features/projects/hooks";
import { useAllRoomsList } from "@/features/rooms/hooks";
import { stockGallery } from "@/lib/stockGallery";
import { pluralize, truncate } from "@/lib/formatters";

const showcaseImages = stockGallery.slice(0, 3).map((image) => image.imageUrl);

const placeholderTestimonials = [
  {
    id: "placeholder-1",
    name: "Designova Client One",
    content: "Designova delivered a calm, polished space that felt practical from day one.",
    rating: 5,
  },
  {
    id: "placeholder-2",
    name: "Designova Client Two",
    content: "The team translated our ideas into a cleaner layout, warmer palette, and stronger overall mood.",
    rating: 5,
  },
];

const LandingPage = () => {
  const { data: projects } = useProjectsList();
  const { data: rooms } = useAllRoomsList();
  const { data: testimonials } = useTestimonialsList();

  const testimonialItems = testimonials?.length
    ? testimonials.slice(0, 3).map((testimonial) => ({
        id: testimonial.testimonial_id,
        name: testimonial.client_name || "Anonymous client",
        content: testimonial.content,
        rating: testimonial.rating ?? 5,
      }))
    : placeholderTestimonials;

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__copy">
          <p className="landing-hero__eyebrow">Designova Interiors</p>
          <h1 className="landing-hero__title">Design interiors that feel composed, warm, and unmistakably yours.</h1>
          <p className="landing-hero__description">
            Designova creates polished interiors for homes, workspaces, and commercial environments with a balance of elegance, clarity, and comfort.
          </p>
          <div className="landing-hero__actions">
            <Link to="/projects" className="button button--primary button--lg">
              Explore projects
              <ArrowRight size={16} />
            </Link>
            <Link to="/enquiry" className="button button--secondary button--lg">
              Start an enquiry
            </Link>
          </div>

          <div className="landing-stats">
            <div className="landing-stat">
              <span>Projects</span>
              <strong>{projects?.length ?? 0}</strong>
            </div>
            <div className="landing-stat">
              <span>Rooms</span>
              <strong>{rooms?.length ?? 0}</strong>
            </div>
            <div className="landing-stat">
              <span>Gallery images</span>
              <strong>{stockGallery.length}</strong>
            </div>
          </div>
        </div>

        <div className="landing-hero__gallery">
          {showcaseImages.map((image, index) => (
            <div key={image} className={["landing-image-tile", index === 0 ? "is-large" : ""].join(" ")}>
              <img src={image} alt={`Designova showcase ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section__intro">
          <p className="landing-section__eyebrow">About Designova</p>
          <h2 className="landing-section__title">Designova shapes thoughtful spaces through clean planning, layered detail, and client-focused execution.</h2>
          <p className="landing-section__description">
            From early concept development to final styling, Designova focuses on interiors that feel refined, practical, and aligned with each client's lifestyle or business goals.
          </p>
        </div>

        <div className="landing-feature-grid">
          <Card padding="lg" className="landing-feature-card">
            <BadgeCheck size={20} />
            <h3>Tailored design direction</h3>
            <p>Every concept is shaped around the spatial needs, visual taste, and daily function of the client.</p>
          </Card>
          <Card padding="lg" className="landing-feature-card">
            <Sofa size={20} />
            <h3>End-to-end planning</h3>
            <p>Designova moves from concept and layout into a coherent, execution-ready interior story.</p>
          </Card>
          <Card padding="lg" className="landing-feature-card">
            <ImageIcon size={20} />
            <h3>Portfolio-led confidence</h3>
            <p>Clients can browse curated references, room studies, and finished projects before getting in touch.</p>
          </Card>
        </div>
      </section>

      <section className="landing-section landing-section--alt">
        <div className="landing-section__intro">
          <p className="landing-section__eyebrow">What you can explore</p>
          <h2 className="landing-section__title">Browse the Designova catalogue before reaching out.</h2>
        </div>

        <div className="landing-card-grid">
          <Card padding="lg" className="landing-link-card">
            <h3>Projects</h3>
            <p>See curated interior projects across residential, commercial, and office spaces.</p>
            <Link to="/projects" className="landing-link-card__action">
              View projects
              <ArrowRight size={16} />
            </Link>
          </Card>
          <Card padding="lg" className="landing-link-card">
            <h3>Rooms</h3>
            <p>Browse categorized rooms and the types of spaces Designova shapes most often.</p>
            <Link to="/rooms" className="landing-link-card__action">
              View rooms
              <ArrowRight size={16} />
            </Link>
          </Card>
          <Card padding="lg" className="landing-link-card">
            <h3>Images</h3>
            <p>Explore a curated stock gallery that reflects the Designova visual direction.</p>
            <Link to="/images" className="landing-link-card__action">
              View images
              <ArrowRight size={16} />
            </Link>
          </Card>
          <Card padding="lg" className="landing-link-card">
            <h3>Enquiries</h3>
            <p>Send a project brief, timeline, and requirements directly to the Designova team.</p>
            <Link to="/enquiry" className="landing-link-card__action">
              Submit enquiry
              <ArrowRight size={16} />
            </Link>
          </Card>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section__intro">
          <p className="landing-section__eyebrow">Testimonials</p>
          <h2 className="landing-section__title">Client feedback and social proof for Designova.</h2>
          <p className="landing-section__description">
            Testimonials stored in the dashboard will appear here automatically and help reinforce Designova's credibility with new clients.
          </p>
        </div>

        <div className="landing-testimonial-grid">
          {testimonialItems.map((testimonial) => (
            <Card key={testimonial.id} padding="lg" className="landing-testimonial-card">
              <div className="landing-testimonial-card__rating">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <blockquote>{truncate(testimonial.content, 180)}</blockquote>
              <footer>{testimonial.name}</footer>
            </Card>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <Card padding="lg" className="landing-cta__card">
          <div>
            <p className="landing-section__eyebrow">Ready to begin?</p>
            <h2 className="landing-section__title">Share your project details and we’ll follow up.</h2>
            <p className="landing-section__description">
              Placeholder call-to-action text. Replace this with your preferred final invitation to contact the company.
            </p>
          </div>
          <div className="landing-cta__actions">
            <Link to="/enquiry" className="button button--primary button--lg">
              Submit enquiry
              <MessageSquareText size={16} />
            </Link>
            <span>{pluralize(projects?.length ?? 0, "project")} currently visible</span>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
