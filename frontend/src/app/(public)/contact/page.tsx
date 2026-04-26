import { PageContainer } from "@/components/shared/page-container";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { apiConfig } from "@/config/api.config";

export default function ContactPage() {
  return (
    <>
      <PublicNavbar />
      <PageContainer title="Contact" description="Reach the operations team for onboarding and merchant support.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-panel p-6">
            <h2 className="text-lg font-semibold">Support Phone</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{apiConfig.supportPhone}</p>
          </div>
          <div className="surface-panel p-6">
            <h2 className="text-lg font-semibold">Support Email</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{apiConfig.supportEmail}</p>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
