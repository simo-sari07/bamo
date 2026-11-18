import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth-admin";
import {
  getStoredProducts,
  createStoredProduct,
  updateStoredProduct,
  deleteStoredProduct,
} from "@/lib/products-store";
import { Product } from "@/types/store";

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME);
  return token ? verifySessionToken(token.value) : false;
}

// GET: Retrieve all products (public or admin)
export async function GET() {
  try {
    const products = getStoredProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: Request) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json({ error: "Accès refusé. Session non autorisée." }, { status: 401 });
    }

    const body = await req.json();
    const { name, priceMAD, category, gender, concentration, description, image, gallery, stock } = body;

    if (!name || !priceMAD) {
      return NextResponse.json({ error: "Nom et Prix sont obligatoires." }, { status: 400 });
    }

    const price = Number(priceMAD);
    const initialStock = Number(stock) || 50;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const newProduct: Product = {
      id: `bamo-prod-${Date.now()}`,
      slug: slug || `bamo-${Date.now()}`,
      categoryTag: `${category === "sets" ? "05 PACK COMPLET" : "EXTRAIT DE PARFUM"} / HAUTE PARFUMERIE`,
      category: category || "parfums",
      gender: gender || (category === "homme" ? "homme" : category === "femme" ? "femme" : "unisexe"),
      concentration: concentration || "Extrait de Parfum (32% de concentration)",
      longevity: "16h+ tenue garantie",
      sillage: "Lumineux, Puissant & Raffiné",
      name: {
        fr: name,
        en: name,
        ar: name,
      },
      description: {
        fr: description || "Création olfactive d'exception signée BAMO Haute Parfumerie.",
        en: description || "Exquisite fragrance creation signed by BAMO Haute Parfumerie.",
        ar: description || "إبداع عطري استثنائي من دار بامو للعطور الراقية.",
      },
      priceMAD: price,
      image: image || "/products/bamo-roselia.jpg",
      gallery: gallery && gallery.length > 0 ? gallery : [image || "/products/bamo-roselia.jpg"],
      variants: [
        {
          id: `var-${Date.now()}-50`,
          label: "50 ml Extrait de Parfum",
          priceMAD: price,
          stock: initialStock,
        },
      ],
      notes: {
        top: ["Agrumes Solaires", "Baies Roses"],
        heart: ["Fleurs Royales", "Bois Précieux"],
        base: ["Ambre Doré", "Musc Blanc"],
      },
      rating: 5.0,
      reviewsCount: 1,
    };

    const saved = createStoredProduct(newProduct);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Erreur lors de la création du produit." }, { status: 500 });
  }
}

// PUT: Update an existing product
export async function PUT(req: Request) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json({ error: "Accès refusé. Session non autorisée." }, { status: 401 });
    }

    const body = await req.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: "ID du produit manquant." }, { status: 400 });
    }

    const updated = updateStoredProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

// DELETE: Delete a product
export async function DELETE(req: Request) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json({ error: "Accès refusé. Session non autorisée." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID du produit manquant." }, { status: 400 });
    }

    const deleted = deleteStoredProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Produit supprimé avec succès." });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
