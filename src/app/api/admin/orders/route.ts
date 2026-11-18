import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth-admin";
import { getStoredOrders, updateStoredOrderStatus } from "@/lib/orders-store";

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME);
  return token ? verifySessionToken(token.value) : false;
}

export async function GET(req: Request) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json(
        { error: "Accès refusé. Veuillez vous connecter au backoffice BAMO." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Fetch from fallback disk store and database
    let orders = getStoredOrders();

    try {
      const whereClause: any = {};
      if (status && status !== "ALL") {
        whereClause.status = status;
      }
      const dbOrders = await db.order.findMany({
        where: whereClause,
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      if (dbOrders && dbOrders.length > 0) {
        // Merge without duplicates
        const existingIds = new Set(orders.map((o) => o.orderNumber));
        for (const dbo of dbOrders) {
          if (!existingIds.has(dbo.orderNumber)) {
            orders.unshift({
              id: dbo.id,
              orderNumber: dbo.orderNumber,
              customerName: dbo.customerName,
              customerPhone: dbo.customerPhone,
              customerEmail: dbo.customerEmail || "",
              city: dbo.city,
              shippingAddress: dbo.shippingAddress,
              status: dbo.status as any,
              paymentMethod: (dbo.paymentMethod || "COD") as any,
              notes: dbo.notes || "",
              totalMAD: Math.round(dbo.totalCents / 100),
              createdAt: dbo.createdAt.toISOString(),
              items: dbo.items.map((i) => ({
                productName: i.productNameSaved,
                variantLabel: i.variantLabel,
                quantity: i.quantity,
                priceMAD: Math.round(i.unitPriceCents / 100),
              })),
            });
          }
        }
      }
    } catch {
      // Prisma offline or unconfigured, fallback store handles everything seamlessly
    }

    if (status && status !== "ALL") {
      orders = orders.filter((o) => o.status === status);
    }

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json(
        { error: "Accès refusé. Veuillez vous connecter au backoffice." },
        { status: 401 }
      );
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    // Update in local persistent file store
    updateStoredOrderStatus(orderId, status);

    // Attempt to update in DB if available
    try {
      await db.order.update({
        where: { id: orderId },
        data: { status },
      });
    } catch {
      // DB offline, disk store updated
    }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
