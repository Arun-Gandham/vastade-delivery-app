"use client";

import { CaptainAppShell } from "@/components/layout/captain-app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { Card } from "@/components/ui/card";
import { useCaptainProfileQuery } from "@/features/captain/captain.hooks";

export default function CaptainProfilePage() {
  const profileQuery = useCaptainProfileQuery();

  return (
    <CaptainAppShell>
      <PageContainer title="Captain Profile" description="Vehicle and availability details from the captain backend module.">
        <Card className="space-y-3">
          <p>Name: {profileQuery.data?.user?.name || "-"}</p>
          <p>Mobile: {profileQuery.data?.user?.mobile || "-"}</p>
          <p>Vehicle Type: {profileQuery.data?.vehicleType || "-"}</p>
          <p>Vehicle Number: {profileQuery.data?.vehicleNumber || "-"}</p>
          <p>License Number: {profileQuery.data?.licenseNumber || "-"}</p>
        </Card>
      </PageContainer>
    </CaptainAppShell>
  );
}
