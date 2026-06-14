import { CommissionForm } from "@/components/CommissionForm";

export default function CommissionPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 md:px-8 py-24 bg-background">
      <div className="max-w-4xl w-full">
        <CommissionForm />
      </div>
    </main>
  );
}
