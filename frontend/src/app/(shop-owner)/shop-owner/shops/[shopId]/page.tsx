import { redirect } from "next/navigation";

export default async function ShopOwnerShopPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  redirect(`/shop-owner/shops/${shopId}/dashboard`);
}
