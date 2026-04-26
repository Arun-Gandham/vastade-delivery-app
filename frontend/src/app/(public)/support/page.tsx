import { PageContainer } from "@/components/shared/page-container";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { apiConfig } from "@/config/api.config";

export default function SupportPage() {
  return (
    <>
      <PublicNavbar />
      <PageContainer title="Support" description="Operational help for login, onboarding, and delivery issues.">
        <div className="surface-panel space-y-4 p-6 text-sm text-[var(--color-text-muted)]">
          <p>For password recovery, shop access corrections, or captain onboarding issues, contact support directly. The current backend does not expose self-service password reset endpoints.</p>
          <p>Phone: {apiConfig.supportPhone}</p>
          <p>Email: {apiConfig.supportEmail}</p>
        </div>
      </PageContainer>
    </>
  );
}
