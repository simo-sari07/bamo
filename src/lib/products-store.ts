import fs from "fs";
import path from "path";
import { Product } from "@/types/store";
import { PRODUCTS } from "@/data/catalog";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

function ensureProductsFile() {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(PRODUCTS, null, 2), "utf-8");
  }
}

export function getStoredProducts(): Product[] {
  try {
    ensureProductsFile();
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // Fallback to default catalog if empty
    return PRODUCTS;
  } catch (err) {
    console.error("Error reading products store:", err);
    return PRODUCTS;
  }
}

export function getStoredProductBySlug(slug: string): Product | undefined {
  const products = getStoredProducts();
  return products.find((p) => p.slug === slug);
}

export function saveStoredProducts(products: Product[]): void {
  try {
    ensureProductsFile();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving products store:", err);
  }
}

export function createStoredProduct(newProd: Product): Product {
  const products = getStoredProducts();
  products.unshift(newProd);
  saveStoredProducts(products);
  return newProd;
}

export function updateStoredProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = products[index];
  const updated: Product = {
    ...current,
    ...updates,
    name: {
      ...current.name,
      ...(updates.name || {}),
    },
    description: {
      ...current.description,
      ...(updates.description || {}),
    },
    variants: updates.variants || current.variants,
    notes: updates.notes || current.notes,
    gallery: updates.gallery || current.gallery,
  };

  products[index] = updated;
  saveStoredProducts(products);
  return updated;
}

export function deleteStoredProduct(id: string): boolean {
  const products = getStoredProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveStoredProducts(filtered);
  return true;
}
