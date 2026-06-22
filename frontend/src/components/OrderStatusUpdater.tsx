"use client";

import { useState } from "react";
import { setOrderStatus, STAGES } from "@/actions/orders";
import { Loader2, Save } from "lucide-react";

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (status === currentStatus) return;
    setLoading(true);
    await setOrderStatus(orderId, status);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <select 
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-background border border-foreground/10 text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none font-medium"
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button 
        onClick={handleSave}
        disabled={loading || status === currentStatus}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-bold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save
      </button>
    </div>
  );
}
