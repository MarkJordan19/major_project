import Card from "@/components/ui/Card";
import EnquiryForm from "@/features/enquiries/EnquiryForm";

const PublicEnquiryPage = () => {
  return (
    <div className="public-page">
      <section className="public-page__hero">
        <p className="landing-section__eyebrow">Enquiry</p>
        <h1 className="public-page__title">Tell us about your project.</h1>
        <p className="public-page__description">
          This page is for public enquiry submissions only. Add your final instructions and contact copy here whenever you are ready.
        </p>
      </section>

      <Card padding="lg" className="public-page__card">
        <EnquiryForm />
      </Card>
    </div>
  );
};

export default PublicEnquiryPage;
