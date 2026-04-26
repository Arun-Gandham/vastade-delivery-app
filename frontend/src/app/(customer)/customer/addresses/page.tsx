"use client";

import { useForm } from "react-hook-form";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { DataState } from "@/components/shared/data-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAddressMutations, useAddressesQuery } from "@/features/addresses/address.hooks";
import { type AddressInput, addressSchema } from "@/features/addresses/address.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CustomerAddressesPage() {
  const addressesQuery = useAddressesQuery();
  const mutations = useAddressMutations();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddressInput>({
    defaultValues: { addressType: "HOME", isDefault: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = addressSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }

    await mutations.create.mutateAsync(result.data);
    reset();
  });

  return (
    <CustomerAppShell>
      <PageContainer title="Addresses" description="Manage saved delivery addresses for checkout.">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">Add Address</h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
              <Input label="Mobile" error={errors.mobile?.message} {...register("mobile")} />
              <Input label="House No" error={errors.houseNo?.message} {...register("houseNo")} />
              <Input label="Street" error={errors.street?.message} {...register("street")} />
              <Input label="Village" error={errors.village?.message} {...register("village")} />
              <Input label="Pincode" error={errors.pincode?.message} {...register("pincode")} />
              <Select
                label="Address Type"
                error={errors.addressType?.message}
                options={[
                  { label: "Home", value: "HOME" },
                  { label: "Work", value: "WORK" },
                  { label: "Other", value: "OTHER" },
                ]}
                {...register("addressType")}
              />
              <Button className="w-full" loading={mutations.create.isPending} type="submit">
                Save Address
              </Button>
            </form>
          </Card>
          <DataState
            isLoading={addressesQuery.isLoading}
            error={getErrorMessage(addressesQuery.error, "")}
            isEmpty={!addressesQuery.data?.length}
            emptyTitle="No saved addresses"
            emptyDescription="Create your first delivery address to start ordering."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {addressesQuery.data?.map((address) => (
                <Card key={address.id} className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{address.fullName}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {address.houseNo}, {address.street}, {address.village}
                      </p>
                    </div>
                    {address.isDefault ? <span className="text-xs font-semibold text-[var(--color-primary)]">Default</span> : null}
                  </div>
                  <div className="flex gap-3">
                    {!address.isDefault ? (
                      <Button variant="outline" onClick={() => mutations.setDefault.mutate(address.id)}>
                        Make Default
                      </Button>
                    ) : null}
                    <Button variant="danger" onClick={() => mutations.remove.mutate(address.id)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </DataState>
        </div>
      </PageContainer>
    </CustomerAppShell>
  );
}
