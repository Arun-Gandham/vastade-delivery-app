import { PageContainer } from "@/components/shared/page-container";
import { PublicNavbar } from "@/components/layout/public-navbar";

export default function PrivacyPage() {
  return (
    <>
      <PublicNavbar />
      <PageContainer title="Privacy" description="Operational data is used only for order fulfillment and platform security.">
        <div className="surface-panel space-y-4 p-6 text-sm text-[var(--color-text-muted)]">
          <p>Customer, shop, captain, and admin data is processed strictly for authentication, order handling, delivery coordination, and platform reporting.</p>
          <p>Location is requested only for captain delivery flows and customer address selection where the user explicitly provides or allows it.</p>
        </div>
      </PageContainer>
    </>
  );
}
