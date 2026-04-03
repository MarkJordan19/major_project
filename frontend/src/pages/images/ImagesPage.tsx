import { Calendar, ExternalLink, FolderKanban, Image as ImageIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { stockGallery } from "@/lib/stockGallery";
import { pluralize } from "@/lib/formatters";

const ImagesPage = () => {
  const residentialCount = stockGallery.filter((image) => image.spaceType === "Residential").length;
  const commercialCount = stockGallery.filter((image) => image.spaceType === "Commercial").length;
  const officeCount = stockGallery.filter((image) => image.spaceType === "Office").length;

  return (
    <div className="page">
      <PageHeader
        title="Designova gallery"
        eyebrow="Stock lookbook"
        description="Browse a curated set of stock interiors used to present the Designova visual style across residential, commercial, and office spaces."
        meta={<span className="status-chip status-chip--accent">{pluralize(stockGallery.length, "image")}</span>}
      />

      <div className="summary-grid">
        <Card padding="md" className="summary-card">
          <span>Residential</span>
          <strong>{residentialCount}</strong>
          <small>home-focused inspiration visuals</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Commercial</span>
          <strong>{commercialCount}</strong>
          <small>retail and hospitality references</small>
        </Card>
        <Card padding="md" className="summary-card">
          <span>Office</span>
          <strong>{officeCount}</strong>
          <small>workspace and executive concepts</small>
        </Card>
      </div>

      <div className="gallery-grid">
        {stockGallery.map((image, index) => (
          <Card key={image.id} padding="none" className="gallery-card">
            <div className="gallery-card__media">
              <img src={image.imageUrl} alt={image.alt} className="gallery-card__image" />
            </div>
            <div className="gallery-card__body">
              <div className="resource-card__header">
                <div>
                  <span className="badge badge--neutral">{image.spaceType}</span>
                  <h3 className="resource-card__title">{image.title}</h3>
                </div>
                <div className="resource-card__actions">
                  <a href={image.imageUrl} target="_blank" rel="noreferrer" className="button button--ghost button--sm button--icon" aria-label={`Open ${image.title}`}>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <div className="resource-card__meta">
                <span className="meta-chip">
                  <FolderKanban size={14} />
                  {image.location}
                </span>
                <span className="meta-chip">
                  <ImageIcon size={14} />
                  {image.roomType}
                </span>
              </div>

              <div className="resource-card__footer">
                <span>
                  <Calendar size={14} />
                  Stock reference #{index + 1}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImagesPage;
