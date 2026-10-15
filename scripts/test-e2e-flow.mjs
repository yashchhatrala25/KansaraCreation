import assert from "assert";

const BASE_URL = "http://localhost:3000";

async function runE2E() {
  console.log("\n🚀 Starting End-to-End API and Flow Verification for Kansara Creation...\n");

  // 1. Fetch Products
  console.log("Step 1: Browsing Catalog...");
  const prodsRes = await fetch(`${BASE_URL}/api/products`);
  assert.strictEqual(prodsRes.status, 200, "Catalog should return 200");
  const products = await prodsRes.json();
  console.log(`  ✓ Loaded ${products.length} products from store catalog.`);
  assert.ok(products.length >= 8, "Expected at least 8 products in catalog");

  // 2. Fetch Single Product Detail
  console.log("Step 2: Viewing Product Detail...");
  const targetProduct = products[0];
  const prodDetailRes = await fetch(`${BASE_URL}/api/products/${targetProduct.id}`);
  assert.strictEqual(prodDetailRes.status, 200);
  const detail = await prodDetailRes.json();
  console.log(`  ✓ Product Detail retrieved: "${detail.name}" (Price: ₹${detail.price})`);
  assert.strictEqual(detail.id, targetProduct.id);

  // 3. Customer Checkout & Place Order
  console.log("Step 3: Customer Checkout & Order Placement...");
  const orderPayload = {
    customerName: "Priya Kansara",
    phone: "9876543210",
    email: "priya@example.com",
    address: "Flat 502, Shivalik Craft Heights, Bodakdev",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380054",
    paymentMethod: "COD",
    items: [
      {
        productId: detail.id,
        name: detail.name,
        price: detail.price,
        quantity: 2,
        image: detail.images[0],
        customNote: "Anniversary Date: 21 September 2024, Sarah & David",
      },
    ],
  };

  const createOrderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload),
  });

  assert.strictEqual(createOrderRes.status, 201, "Order placement should return 201");
  const orderResult = await createOrderRes.json();
  const orderId = orderResult.orderId;
  console.log(`  ✓ Order successfully placed! Generated Order ID: ${orderId}`);
  assert.ok(orderId.startsWith("KC-"));
  assert.strictEqual(orderResult.order.status, "Pending");
  assert.strictEqual(orderResult.order.total, detail.price * 2);

  // 4. Admin Login
  console.log("Step 4: Admin Authentication...");
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@kansara.com",
      password: "Admin@123",
    }),
  });

  assert.strictEqual(loginRes.status, 200, "Admin login should return 200");
  const cookieHeader = loginRes.headers.get("set-cookie") || "";
  const tokenMatch = cookieHeader.match(/kc_admin_token=([^;]+)/);
  assert.ok(tokenMatch, "Admin auth cookie must be set");
  const cookie = `kc_admin_token=${tokenMatch[1]}`;
  console.log("  ✓ Admin signed in successfully with JWT session cookie.");

  // 5. Admin Dashboard Analytics
  console.log("Step 5: Inspecting Admin Dashboard Analytics & Charts...");
  const analyticsRes = await fetch(`${BASE_URL}/api/analytics`, {
    headers: { Cookie: cookie },
  });
  assert.strictEqual(analyticsRes.status, 200);
  const analytics = await analyticsRes.json();
  console.log(`  ✓ Total Orders: ${analytics.kpis.totalOrders}`);
  console.log(`  ✓ Pending Orders: ${analytics.kpis.pendingOrders}`);
  console.log(`  ✓ Total Revenue: ₹${analytics.kpis.totalRevenue}`);
  console.log(`  ✓ Monthly Income: ₹${analytics.kpis.monthlyIncome}`);
  assert.ok(analytics.charts.monthlyRevenue.length > 0, "Monthly revenue chart data present");
  assert.ok(analytics.charts.ordersByStatus.length > 0, "Orders by status chart data present");

  // 6. Admin Orders Management & Status Update
  console.log("Step 6: Updating Order Status in Admin...");
  const updateRes = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({ status: "Confirmed" }),
  });

  assert.strictEqual(updateRes.status, 200);
  const updatedOrder = await updateRes.json();
  assert.strictEqual(updatedOrder.order.status, "Confirmed");
  console.log(`  ✓ Order ${orderId} status successfully transitioned: Pending → Confirmed`);

  // 7. Verify Dashboard Analytics Reflected Status Change
  console.log("Step 7: Verifying Analytics Chart Updates...");
  const updatedAnalyticsRes = await fetch(`${BASE_URL}/api/analytics`, {
    headers: { Cookie: cookie },
  });
  const updatedAnalytics = await updatedAnalyticsRes.json();
  const confirmedCount = updatedAnalytics.charts.ordersByStatus.find((s) => s.status === "Confirmed")?.count;
  console.log(`  ✓ Confirmed Orders now in Chart: ${confirmedCount}`);
  assert.ok(confirmedCount >= 1);

  // 8. Admin Product Management (Create & Delete)
  console.log("Step 8: Admin Catalog Management...");
  const newProdRes = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({
      name: "Vintage Heirloom Daisy Ribbon Bow",
      description: "Embroidered with antique silk floss",
      price: 749,
      category: "Hair Bows",
      stock: 12,
      images: ["/images/products/hair-bows-linen.jpg"],
      featured: true,
    }),
  });

  assert.strictEqual(newProdRes.status, 201);
  const createdProd = await newProdRes.json();
  console.log(`  ✓ Added new product via Admin: "${createdProd.name}" (${createdProd.id})`);

  const deleteProdRes = await fetch(`${BASE_URL}/api/products/${createdProd.id}`, {
    method: "DELETE",
    headers: { Cookie: cookie },
  });
  assert.strictEqual(deleteProdRes.status, 200);
  console.log(`  ✓ Cleaned up test product (${createdProd.id}) successfully.`);

  // 9. Client Visit Tracking
  console.log("Step 9: Testing Client Analytics Tracking...");
  const trackRes = await fetch(`${BASE_URL}/api/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page: "/products",
      sessionId: "sess_test_verification_123",
      device: "mobile",
    }),
  });
  assert.strictEqual(trackRes.status, 200);
  console.log("  ✓ Client page visit tracked successfully.");

  console.log("\n🎉 FULL END-TO-END FLOW VERIFIED SUCCESSFULLY! ALL CHECKS PASSED!\n");
}

runE2E().catch((err) => {
  console.error("E2E Test Failed:", err);
  process.exit(1);
});
