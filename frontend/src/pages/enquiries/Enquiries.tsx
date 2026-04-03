import { useEnquiriesList } from "@/features/enquiries/hooks";
import Loader from "@/components/ui/Loader";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export default function Enquiries() {
  const { data: enquiries, isLoading, isError, refetch } = useEnquiriesList();

  if (isLoading) return <Loader />;
  if (isError) return <ErrorState message="Failed to load enquiries." onRetry={() => refetch()} />;

  const hasNoEnquiries = !enquiries || enquiries.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Customer Enquiries" 
        description="View and respond to messages from potential clients."
      />

      {hasNoEnquiries ? (
        <EmptyState
          title="No enquiries"
          description="You don't have any customer messages yet."
        />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.enquiry_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                      {enquiry.project_id && (
                        <div className="text-xs text-blue-600 font-medium">Project ID: {enquiry.project_id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <a href={`mailto:${enquiry.email}`} className="text-blue-600 hover:underline">{enquiry.email}</a>
                      </div>
                      {enquiry.phone && <div className="text-sm text-gray-500">{enquiry.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-sm whitespace-pre-wrap">{enquiry.message}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enquiry.submitted_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
