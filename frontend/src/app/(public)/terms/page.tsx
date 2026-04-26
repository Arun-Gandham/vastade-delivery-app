import { PageContainer } from "@/components/shared/page-container";
import { PublicNavbar } from "@/components/layout/public-navbar";

export default function TermsPage() {
  return (
    <>
      <PublicNavbar />
      <PageContainer title="Terms" description="This MVP is limited to the documented grocery ordering and delivery flows.">
        <div className="surface-panel space-y-4 p-6 text-sm text-[var(--color-text-muted)]">
          <p>Accounts are role-restricted. Actions such as assigning captains, updating stock, and marking deliveries are audited and should only be used by authorized users.</p>
          <p>Delivery and payment states must reflect real-world completion. Duplicate submissions are prevented in the UI, but users are expected to review actions before confirming.</p>
        </div>
      </PageContainer>
    </>
  );
}
