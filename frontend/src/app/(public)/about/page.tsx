import { PageContainer } from "@/components/shared/page-container";
import { PublicNavbar } from "@/components/layout/public-navbar";

export default function AboutPage() {
  return (
    <>
      <PublicNavbar />
      <PageContainer
        title="About the MVP"
        description="A single operational surface for customers, captains, shops, and admins."
      >
        <div className="surface-panel space-y-4 p-6 text-sm leading-7 text-[var(--color-text-muted)]">
          <p>
            This MVP focuses on the core operational loop: browse products, place orders, confirm at the shop, assign a captain, deliver, and reconcile COD. It is intentionally narrow so the backend contract stays reliable and auditable.
          </p>
          <p>
            Future features like auto-assignment, live tracking, wallets, and advanced offers are intentionally excluded from this build because they are not part of the current documents.
          </p>
        </div>
      </PageContainer>
    </>
  );
}
