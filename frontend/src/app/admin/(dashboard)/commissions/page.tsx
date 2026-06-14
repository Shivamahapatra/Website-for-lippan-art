import { prisma } from "@/lib/db";
import { advanceCommissionStatus } from "@/actions/commissions";
import { ArrowRightCircle, CheckCircle2, Clock, Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CommissionsPage() {
  const commissions = await prisma.commission.findMany({
    orderBy: { created_at: "desc" },
  });

  const getStatusColor = (status: string) => {
    if (status === "Completed") return "text-green-500 bg-green-500/10 border-green-500/20";
    if (status === "New") return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    return "text-orange-500 bg-orange-500/10 border-orange-500/20";
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Custom Commissions</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {commissions.map((commission) => (
          <div key={commission.id} className="bg-card border border-foreground/5 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
            {/* Commission Details */}
            <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-foreground/5 bg-muted/20">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-foreground/50 font-medium">Request #{commission.id}</p>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(commission.status)}`}>
                  {commission.status}
                </div>
              </div>
              
              <h3 className="font-bold text-lg">{commission.customer_name}</h3>
              <p className="text-sm text-foreground/70">{commission.email}</p>
              
              <div className="mt-6 pt-6 border-t border-foreground/5">
                <p className="text-xs text-foreground/50 uppercase font-bold tracking-widest mb-1">Requested Size</p>
                <p className="font-bold text-foreground/80">{commission.size_requested || "Not specified"}</p>
              </div>
            </div>

            {/* Description & Reference Image */}
            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-2">Details</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{commission.details}</p>
              </div>

              {commission.reference_image_base64 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Reference Image
                  </h4>
                  <img 
                    src={commission.reference_image_base64} 
                    alt="Reference" 
                    className="max-w-xs rounded-xl shadow-sm border border-foreground/10"
                  />
                </div>
              )}

              <div className="pt-6 border-t border-foreground/5 flex justify-end">
                {commission.status !== "Completed" ? (
                  <form action={async () => {
                    "use server";
                    await advanceCommissionStatus(commission.id);
                  }}>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-accent transition-colors shadow-sm">
                      Mark as {
                        commission.status === "New" ? "Contacted" : 
                        commission.status === "Contacted" ? "In Progress" : 
                        "Completed"
                      }
                      <ArrowRightCircle className="w-5 h-5" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 px-5 py-2.5 rounded-xl border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                    Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {commissions.length === 0 && (
          <div className="p-12 text-center bg-card rounded-2xl border border-foreground/5 text-foreground/50 flex flex-col items-center gap-4">
            <Clock className="w-12 h-12 opacity-50" />
            <p>No custom commissions received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
