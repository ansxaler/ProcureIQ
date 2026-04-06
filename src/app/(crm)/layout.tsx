import Sidebar from "@/components/crm/Sidebar";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-navy-900">
        {children}
      </main>
    </div>
  );
}
