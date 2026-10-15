import assert from "assert";
import { validatePhone, validatePincode, validateEmail, validateRequired } from "../src/lib/validations.ts";
import { formatINR, calculateOrderTotal, getStatusBadgeConfig } from "../src/lib/utils.ts";
import { db } from "../src/lib/db.ts";
import { hashPassword, comparePassword, signAdminToken, verifyAdminToken } from "../src/lib/auth.ts";

let passed = 0;
let failed = 0;

async function it(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n🧪 Running Unit & API Tests for Kansara Creation...\n");

  console.log("--- 1. Validation Utilities Tests ---");
  await it("validatePhone accepts valid 10-digit Indian phone", () => {
    assert.strictEqual(validatePhone("9876543210").isValid, true);
    assert.strictEqual(validatePhone("+91 9876543210").isValid, true);
    assert.strictEqual(validatePhone("919876543210").isValid, true);
  });

  await it("validatePhone rejects invalid phone numbers", () => {
    assert.strictEqual(validatePhone("12345").isValid, false);
    assert.strictEqual(validatePhone("abcdefghij").isValid, false);
    assert.strictEqual(validatePhone("").isValid, false);
  });

  await it("validatePincode accepts valid 6-digit Indian postal code", () => {
    assert.strictEqual(validatePincode("380001").isValid, true);
    assert.strictEqual(validatePincode("400001").isValid, true);
  });

  await it("validatePincode rejects invalid postal codes", () => {
    assert.strictEqual(validatePincode("38001").isValid, false);
    assert.strictEqual(validatePincode("3800010").isValid, false);
    assert.strictEqual(validatePincode("ABCDEF").isValid, false);
  });

  await it("validateEmail validates standard emails properly", () => {
    assert.strictEqual(validateEmail("hello@kansaracreation.com").isValid, true);
    assert.strictEqual(validateEmail("invalid-email").isValid, false);
    assert.strictEqual(validateEmail("user@").isValid, false);
  });

  console.log("\n--- 2. Utility & Formatters Tests ---");
  await it("formatINR correctly formats currency in Indian Rupees", () => {
    const formatted = formatINR(1899);
    assert.ok(formatted.includes("1,899") || formatted.includes("1899"));
  });

  await it("calculateOrderTotal sums items with quantity accurately", () => {
    const items = [
      { price: 1899, quantity: 1 },
      { price: 699, quantity: 2 },
    ];
    const total = calculateOrderTotal(items);
    assert.strictEqual(total, 1899 + 699 * 2);
  });

  await it("getStatusBadgeConfig returns valid styling config for all 6 statuses", () => {
    const statuses = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
    statuses.forEach((st) => {
      const cfg = getStatusBadgeConfig(st);
      assert.strictEqual(cfg.label, st);
      assert.ok(cfg.bg.length > 0);
      assert.ok(cfg.text.length > 0);
    });
  });

  console.log("\n--- 3. Authentication & Security Tests ---");
  await it("hashPassword and comparePassword work reliably", async () => {
    const plain = "Admin@123";
    const hashed = await hashPassword(plain);
    const isMatch = await comparePassword(plain, hashed);
    const isWrong = await comparePassword("WrongPassword", hashed);
    assert.strictEqual(isMatch, true);
    assert.strictEqual(isWrong, false);
  });

  await it("signAdminToken and verifyAdminToken issue and verify valid JWT", () => {
    const admin = { id: "test_1", email: "admin@kansara.com", name: "Admin" };
    const token = signAdminToken(admin);
    const verified = verifyAdminToken(token);
    assert.ok(verified !== null);
    assert.strictEqual(verified.email, "admin@kansara.com");
  });

  console.log("\n--- 4. Database CRUD & Order Lifecycle Tests ---");
  await it("db.product findMany returns seeded products", async () => {
    const products = await db.product.findMany();
    assert.ok(products.length >= 8);
  });

  let createdProdId = "";
  await it("db.product.create inserts new product into catalog", async () => {
    const newProd = await db.product.create({
      data: {
        name: "Test Handmade Silk Brocade Bow",
        description: "Test description for silk bow",
        price: 999,
        category: "Hair Bows",
        images: JSON.stringify(["/images/products/hair-bows-linen.jpg"]),
        stock: 15,
        featured: false,
      },
    });
    assert.ok(newProd.id.startsWith("prod_"));
    createdProdId = newProd.id;
  });

  await it("db.product.update modifies product details", async () => {
    const updated = await db.product.update({
      where: { id: createdProdId },
      data: { price: 1099, stock: 14 },
    });
    assert.strictEqual(updated.price, 1099);
    assert.strictEqual(updated.stock, 14);
  });

  await it("db.product.delete removes product from database", async () => {
    const deleted = await db.product.delete({ where: { id: createdProdId } });
    assert.strictEqual(deleted.id, createdProdId);
    const check = await db.product.findUnique({ where: { id: createdProdId } });
    assert.strictEqual(check, null);
  });

  let testOrderId = "";
  await it("db.order.create saves order with Pending status", async () => {
    const order = await db.order.create({
      data: {
        customerName: "Radha Dave",
        phone: "9876543210",
        email: "radha@example.com",
        address: "702, Lotus Apts",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        items: JSON.stringify([{ productId: "prod_calendar_hoop", name: "Calendar Hoop", price: 1899, quantity: 1 }]),
        total: 1899,
        status: "Pending",
        paymentMethod: "Cash on Delivery",
      },
    });
    assert.ok(order.id.startsWith("KC-"));
    assert.strictEqual(order.status, "Pending");
    testOrderId = order.id;
  });

  await it("db.order.update advances status through fulfillment lifecycle", async () => {
    const statuses = ["Confirmed", "Packed", "Shipped", "Delivered"];
    for (const st of statuses) {
      const updated = await db.order.update({
        where: { id: testOrderId },
        data: { status: st },
      });
      assert.strictEqual(updated.status, st);
    }
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
