import { getTender, getDocuments } from "@/lib/crm-data";
import DocumentCards from "@/components/crm/DocumentCards";

export default async function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tender = getTender(id);
  if (!tender) return null;

  const docs = getDocuments(id);

  if (docs.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p className="text-lg font-medium">No documents generated yet</p>
        <p className="text-sm mt-1">Documents are created when an option is selected and the tender moves to review</p>
      </div>
    );
  }

  return (
    <DocumentCards
      docs={docs}
      tender={tender}
    />
  );
}
