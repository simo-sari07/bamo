import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { saveOrderToDisk, StoredOrder } from "@/lib/orders-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      city,
      shippingAddress,
      notes,
      items,
      totalMAD,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs obligatoires (Nom, Téléphone, Adresse)." },
        { status: 400 }
      );
    }

    const orderNumber = `BAMO-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const storedOrder: StoredOrder = {
      id: orderNumber,
      orderNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : `client-${orderNumber}@bamoparfums.ma`,
      city: city || "Casablanca",
      shippingAddress: shippingAddress.trim(),
      status: "PENDING",
      paymentMethod: "COD",
      notes: notes || "",
      totalMAD: Number(totalMAD) || 490,
      createdAt: nowIso,
      items: items.map((i: any) => ({
        productName: i.productName || "Extrait de Parfum BAMO",
        variantLabel: i.variantLabel || "50 ml",
        quantity: i.quantity || 1,
        priceMAD: i.priceMAD || 490,
      })),
    };

    // Always persist to disk store
    saveOrderToDisk(storedOrder);

    // Attempt to persist to Prisma database if connected
    try {
      await db.order.create({
        data: {
          orderNumber,
          customerName: storedOrder.customerName,
          customerPhone: storedOrder.customerPhone,
          customerEmail: storedOrder.customerEmail,
          city: storedOrder.city,
          shippingAddress: storedOrder.shippingAddress,
          notes: storedOrder.notes || "",
          status: "PENDING",
          paymentMethod: "COD",
          totalCents: Math.round(storedOrder.totalMAD * 100),
          currency: "MAD",
          items: {
            create: storedOrder.items.map((item) => ({
              productId: "prod-bamo",
              productNameSaved: item.productName,
              variantId: "var-bamo",
              variantLabel: item.variantLabel,
              unitPriceCents: Math.round(item.priceMAD * 100),
              quantity: item.quantity,
            })),
          },
        },
      });
    } catch {
      // Database offline/unreachable, order is safely recorded in file store
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: orderNumber,
      message: "Commande Cash on Delivery confirmée avec succès.",
    });
  } catch (error: any) {
    console.error("Error processing COD order:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement de votre commande." },
      { status: 500 }
    );
  }
}
