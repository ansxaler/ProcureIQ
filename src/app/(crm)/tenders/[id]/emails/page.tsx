import { getEmailThreads } from "@/lib/crm-data";
import EmailView from "@/components/crm/EmailView";

export default async function EmailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const threads = getEmailThreads(id);

  if (threads.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p className="text-lg font-medium">No emails yet</p>
        <p className="text-sm mt-1">Email threads appear once RFQs are sent to suppliers</p>
      </div>
    );
  }

  return <EmailView threads={threads} />;
}
