import fs from "fs";
import path from "path";
import type { Product, Order, OrderStatus } from "../types/index.ts";

export interface DBStore {
  admins: Array<{
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    createdAt: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string; // JSON string or array string
    stock: number;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  orders: Array<{
    id: string;
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    items: string; // JSON string
    total: number;
    status: OrderStatus;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
  }>;
  visits: Array<{
    id: string;
    page: string;
    timestamp: string;
    sessionId: string;
    device?: string;
  }>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDbFile(): DBStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial: DBStore = {
      admins: [],
      products: [],
      orders: [],
      visits: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  try {
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (err) {
    const initial: DBStore = {
      admins: [],
      products: [],
      orders: [],
      visits: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

function saveDb(store: DBStore) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), "utf8");
  fs.renameSync(tempFile, DB_FILE);
}

export const db = {
  admin: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      const store = ensureDbFile();
      return (
        store.admins.find((a) => {
          if (where.email && a.email.toLowerCase() === where.email.toLowerCase()) return true;
          if (where.id && a.id === where.id) return true;
          return false;
        }) || null
      );
    },
    upsert: async ({
      where,
      update,
      create,
    }: {
      where: { email: string };
      update: Partial<DBStore["admins"][0]>;
      create: Omit<DBStore["admins"][0], "id" | "createdAt">;
    }) => {
      const store = ensureDbFile();
      const idx = store.admins.findIndex((a) => a.email.toLowerCase() === where.email.toLowerCase());
      const now = new Date().toISOString();
      if (idx >= 0) {
        store.admins[idx] = { ...store.admins[idx], ...update };
        saveDb(store);
        return store.admins[idx];
      } else {
        const newAdmin = {
          id: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          ...create,
          createdAt: now,
        };
        store.admins.push(newAdmin);
        saveDb(store);
        return newAdmin;
      }
    },
  },

  product: {
    findMany: async (options?: {
      where?: { category?: string; featured?: boolean };
      orderBy?: { [key: string]: "asc" | "desc" };
    }) => {
      const store = ensureDbFile();
      let list = [...store.products];

      if (options?.where?.category) {
        list = list.filter((p) => p.category.toLowerCase() === options.where!.category!.toLowerCase());
      }
      if (options?.where?.featured !== undefined) {
        list = list.filter((p) => p.featured === options.where!.featured);
      }

      if (options?.orderBy) {
        const [field, dir] = Object.entries(options.orderBy)[0];
        list.sort((a: any, b: any) => {
          if (a[field] < b[field]) return dir === "asc" ? -1 : 1;
          if (a[field] > b[field]) return dir === "asc" ? 1 : -1;
          return 0;
        });
      }

      return list;
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      const store = ensureDbFile();
      return store.products.find((p) => p.id === where.id) || null;
    },
    create: async ({ data }: { data: Omit<DBStore["products"][0], "id" | "createdAt" | "updatedAt"> }) => {
      const store = ensureDbFile();
      const now = new Date().toISOString();
      const newProduct = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      store.products.unshift(newProduct);
      saveDb(store);
      return newProduct;
    },
    update: async ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<DBStore["products"][0]>;
    }) => {
      const store = ensureDbFile();
      const idx = store.products.findIndex((p) => p.id === where.id);
      if (idx === -1) throw new Error("Product not found");
      const updated = {
        ...store.products[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      store.products[idx] = updated;
      saveDb(store);
      return updated;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const store = ensureDbFile();
      const idx = store.products.findIndex((p) => p.id === where.id);
      if (idx === -1) throw new Error("Product not found");
      const deleted = store.products.splice(idx, 1)[0];
      saveDb(store);
      return deleted;
    },
  },

  order: {
    findMany: async (options?: {
      where?: { status?: string };
      orderBy?: { [key: string]: "asc" | "desc" };
    }) => {
      const store = ensureDbFile();
      let list = [...store.orders];

      if (options?.where?.status) {
        list = list.filter((o) => o.status.toLowerCase() === options.where!.status!.toLowerCase());
      }

      if (options?.orderBy) {
        const [field, dir] = Object.entries(options.orderBy)[0];
        list.sort((a: any, b: any) => {
          if (a[field] < b[field]) return dir === "asc" ? -1 : 1;
          if (a[field] > b[field]) return dir === "asc" ? 1 : -1;
          return 0;
        });
      } else {
        // default recent first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      return list;
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      const store = ensureDbFile();
      return store.orders.find((o) => o.id === where.id) || null;
    },
    create: async ({ data }: { data: Omit<DBStore["orders"][0], "id" | "createdAt" | "updatedAt"> }) => {
      const store = ensureDbFile();
      const now = new Date().toISOString();
      const newOrder = {
        id: `KC-${Math.floor(100000 + Math.random() * 900000)}`,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      store.orders.unshift(newOrder);
      saveDb(store);
      return newOrder;
    },
    update: async ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<DBStore["orders"][0]>;
    }) => {
      const store = ensureDbFile();
      const idx = store.orders.findIndex((o) => o.id === where.id);
      if (idx === -1) throw new Error("Order not found");
      const updated = {
        ...store.orders[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      store.orders[idx] = updated;
      saveDb(store);
      return updated;
    },
  },

  visit: {
    create: async ({ data }: { data: { page: string; sessionId: string; device?: string } }) => {
      const store = ensureDbFile();
      const visit = {
        id: `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        timestamp: new Date().toISOString(),
      };
      store.visits.unshift(visit);
      // Cap at 10,000 visits for memory efficiency
      if (store.visits.length > 10000) {
        store.visits.length = 10000;
      }
      saveDb(store);
      return visit;
    },
    findMany: async () => {
      const store = ensureDbFile();
      return [...store.visits];
    },
  },
};
