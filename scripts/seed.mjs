import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function seed() {
  console.log("🌸 Seeding Kansara Creation database...");

  // 1. Admin account
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Admin@123", salt);

  const admins = [
    {
      id: "adm_kansara_master",
      email: "admin@kansara.com",
      passwordHash: passwordHash,
      name: "Kansara Admin",
      createdAt: new Date().toISOString(),
    },
  ];

  // 2. Products (12 handmade items across Wall Hangings, Hair Bows, Dreamcatchers)
  const products = [
    {
      id: "prod_calendar_hoop",
      name: "Personalized Anniversary Calendar Embroidery Hoop",
      description: "Exquisite handcrafted wooden hoop art with custom calendar date circled in red embroidery thread. Decorated with delicate French knot floral garland and customized couple names.",
      price: 1899,
      category: "Wall Hangings",
      images: JSON.stringify(["/images/products/calendar-hoop.jpg", "/images/products/couple-name-hoop.jpg"]),
      stock: 12,
      featured: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_hair_bows_linen",
      name: "Daisy Meadow Hand-Embroidered Linen Hair Bows (Pair)",
      description: "Delicate pair of handmade natural linen hair bows adorned with hand-stitched wild daisies, botanical vines, and soft frayed edges. Ideal for festive and everyday hair styling.",
      price: 699,
      category: "Hair Bows",
      images: JSON.stringify(["/images/products/hair-bows-linen.jpg", "/images/products/velvet-bow-set.jpg"]),
      stock: 18,
      featured: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_boho_dreamcatcher",
      name: "Bohemian Dip-Dyed Rose Quartz Dreamcatcher",
      description: "Intricately woven mandala lace web centered with genuine polished crystal and natural wooden beads. Features cascading ombre dip-dyed rose-gold and cream macrame fringe tassels.",
      price: 2299,
      category: "Dreamcatchers",
      images: JSON.stringify(["/images/products/boho-dreamcatcher.jpg", "/images/products/celestial-moon-dreamcatcher.jpg"]),
      stock: 7,
      featured: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_couple_name_hoop",
      name: "Golden Monogram Couple Floral Hoop Wall Hanging",
      description: "Romantic couple name hoop art embroidered in lustrous metallic gold thread, embraced by an asymmetrical wreath of eucalyptus leaves and blush roses on organic cotton.",
      price: 2499,
      category: "Wall Hangings",
      images: JSON.stringify(["/images/products/couple-name-hoop.jpg", "/images/products/calendar-hoop.jpg"]),
      stock: 5,
      featured: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_velvet_bow_set",
      name: "Artisanal Velvet Honeybee & Wildflower Hair Clips (Trio)",
      description: "Luxury trio of plush velvet hair clips in sage green, dusty rose, and mustard yellow. Each clip is hand-stitched with miniature golden honeybees and vibrant wildflower French knots.",
      price: 899,
      category: "Hair Bows",
      images: JSON.stringify(["/images/products/velvet-bow-set.jpg", "/images/products/hair-bows-linen.jpg"]),
      stock: 14,
      featured: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_celestial_moon_dreamcatcher",
      name: "Celestial Dusk Crescent Moon Macrame Hanging",
      description: "Handcrafted golden wire crescent moon frame with micro-macrame woven web, iridescent crystal beads, and flowing twilight purple-to-pink gradient silk tassels with star charms.",
      price: 2199,
      category: "Dreamcatchers",
      images: JSON.stringify(["/images/products/celestial-moon-dreamcatcher.jpg", "/images/products/boho-dreamcatcher.jpg"]),
      stock: 8,
      featured: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_wedding_vows_hoop",
      name: "Personalized Wedding Vows Keepsake Hoop Art",
      description: "Preserve your sacred promises in timeless hand-embroidery. Custom script lettering framed by romantic botanical laurel on pure Irish linen.",
      price: 2199,
      category: "Wall Hangings",
      images: JSON.stringify(["/images/products/couple-name-hoop.jpg"]),
      stock: 6,
      featured: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_vintage_rose_bow",
      name: "Vintage Heirloom Dusty Rose Embroidered Bow",
      description: "Oversized statement hair bow crafted from premium textured cotton linen with intricate hand-embroidered climbing tea roses and bud clusters.",
      price: 599,
      category: "Hair Bows",
      images: JSON.stringify(["/images/products/hair-bows-linen.jpg"]),
      stock: 20,
      featured: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_feather_dreamcatcher",
      name: "Tribal Sun & Feather Hanging with Wooden Beads",
      description: "Traditional circular dreamcatcher crafted with natural willow hoop, intricate web weave, cruelty-free feathers, and hand-carved sandalwood beads.",
      price: 1799,
      category: "Dreamcatchers",
      images: JSON.stringify(["/images/products/boho-dreamcatcher.jpg"]),
      stock: 9,
      featured: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_baby_stats_hoop",
      name: "Baby Birth Announcement Floral Embroidery Hoop",
      description: "Celebrate the arrival of your little one with a customized birth details hoop: date, time, weight, and baby name framed by sweet pastel nursery flowers.",
      price: 1999,
      category: "Wall Hangings",
      images: JSON.stringify(["/images/products/calendar-hoop.jpg"]),
      stock: 11,
      featured: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_lavender_hair_clip_set",
      name: "Lavender Sprig Hand-Stitched Alligator Clips",
      description: "Set of 2 boutique alligator clips wrapped in soft cream linen, hand-embroidered with fragrant purple lavender sprigs and sage green leaves.",
      price: 499,
      category: "Hair Bows",
      images: JSON.stringify(["/images/products/velvet-bow-set.jpg"]),
      stock: 22,
      featured: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_aurora_dreamcatcher",
      name: "Aurora Borealis Ombre Macrame Dreamcatcher",
      description: "Mesmerizing multi-tiered wall hanging combining intricate macrame knotting with dip-dyed teal, violet, and blush fringe tassels.",
      price: 2599,
      category: "Dreamcatchers",
      images: JSON.stringify(["/images/products/celestial-moon-dreamcatcher.jpg"]),
      stock: 4,
      featured: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // 3. Orders (18 dummy orders spread across 6 months with realistic statuses)
  const orderTemplates = [
    { name: "Pooja Sharma", phone: "9876501234", email: "pooja.sharma@example.com", city: "Mumbai", state: "Maharashtra", pincode: "400001", status: "Delivered", daysAgo: 150, items: [{ productId: "prod_calendar_hoop", name: "Personalized Anniversary Calendar Embroidery Hoop", price: 1899, quantity: 1, image: "/images/products/calendar-hoop.jpg" }] },
    { name: "Rohan Patel", phone: "9825123456", email: "rohan.patel@example.com", city: "Ahmedabad", state: "Gujarat", pincode: "380015", status: "Delivered", daysAgo: 135, items: [{ productId: "prod_couple_name_hoop", name: "Golden Monogram Couple Floral Hoop Wall Hanging", price: 2499, quantity: 1, image: "/images/products/couple-name-hoop.jpg" }] },
    { name: "Ananya Iyer", phone: "9988776655", email: "ananya.iyer@example.com", city: "Bangalore", state: "Karnataka", pincode: "560034", status: "Delivered", daysAgo: 120, items: [{ productId: "prod_hair_bows_linen", name: "Daisy Meadow Hand-Embroidered Linen Hair Bows (Pair)", price: 699, quantity: 2, image: "/images/products/hair-bows-linen.jpg" }] },
    { name: "Sneha Mukherjee", phone: "9712345678", email: "sneha.m@example.com", city: "Kolkata", state: "West Bengal", pincode: "700029", status: "Delivered", daysAgo: 105, items: [{ productId: "prod_boho_dreamcatcher", name: "Bohemian Dip-Dyed Rose Quartz Dreamcatcher", price: 2299, quantity: 1, image: "/images/products/boho-dreamcatcher.jpg" }] },
    { name: "Vikas Verma", phone: "9811223344", email: "vikas.verma@example.com", city: "Delhi", state: "Delhi", pincode: "110001", status: "Delivered", daysAgo: 90, items: [{ productId: "prod_celestial_moon_dreamcatcher", name: "Celestial Dusk Crescent Moon Macrame Hanging", price: 2199, quantity: 1, image: "/images/products/celestial-moon-dreamcatcher.jpg" }] },
    { name: "Meera Nair", phone: "9447112233", email: "meera.nair@example.com", city: "Kochi", state: "Kerala", pincode: "682016", status: "Delivered", daysAgo: 75, items: [{ productId: "prod_velvet_bow_set", name: "Artisanal Velvet Honeybee & Wildflower Hair Clips (Trio)", price: 899, quantity: 2, image: "/images/products/velvet-bow-set.jpg" }] },
    { name: "Kunal Deshmukh", phone: "9822334455", email: "kunal.d@example.com", city: "Pune", state: "Maharashtra", pincode: "411004", status: "Delivered", daysAgo: 60, items: [{ productId: "prod_calendar_hoop", name: "Personalized Anniversary Calendar Embroidery Hoop", price: 1899, quantity: 1, image: "/images/products/calendar-hoop.jpg" }, { productId: "prod_hair_bows_linen", name: "Daisy Meadow Hand-Embroidered Linen Hair Bows (Pair)", price: 699, quantity: 1, image: "/images/products/hair-bows-linen.jpg" }] },
    { name: "Deepika Singh", phone: "9910203040", email: "deepika.s@example.com", city: "Jaipur", state: "Rajasthan", pincode: "302001", status: "Delivered", daysAgo: 50, items: [{ productId: "prod_couple_name_hoop", name: "Golden Monogram Couple Floral Hoop Wall Hanging", price: 2499, quantity: 1, image: "/images/products/couple-name-hoop.jpg" }] },
    { name: "Arjun Reddy", phone: "9849011223", email: "arjun.reddy@example.com", city: "Hyderabad", state: "Telangana", pincode: "500081", status: "Delivered", daysAgo: 40, items: [{ productId: "prod_boho_dreamcatcher", name: "Bohemian Dip-Dyed Rose Quartz Dreamcatcher", price: 2299, quantity: 1, image: "/images/products/boho-dreamcatcher.jpg" }] },
    { name: "Tanvi Shah", phone: "9824055667", email: "tanvi.shah@example.com", city: "Surat", state: "Gujarat", pincode: "395007", status: "Shipped", daysAgo: 25, items: [{ productId: "prod_velvet_bow_set", name: "Artisanal Velvet Honeybee & Wildflower Hair Clips (Trio)", price: 899, quantity: 1, image: "/images/products/velvet-bow-set.jpg" }] },
    { name: "Aditya Joshi", phone: "9820012399", email: "aditya.j@example.com", city: "Thane", state: "Maharashtra", pincode: "400601", status: "Shipped", daysAgo: 18, items: [{ productId: "prod_calendar_hoop", name: "Personalized Anniversary Calendar Embroidery Hoop", price: 1899, quantity: 1, image: "/images/products/calendar-hoop.jpg" }] },
    { name: "Riya Sen", phone: "9830114477", email: "riya.sen@example.com", city: "Kolkata", state: "West Bengal", pincode: "700019", status: "Packed", daysAgo: 12, items: [{ productId: "prod_celestial_moon_dreamcatcher", name: "Celestial Dusk Crescent Moon Macrame Hanging", price: 2199, quantity: 1, image: "/images/products/celestial-moon-dreamcatcher.jpg" }] },
    { name: "Gaurav Mehta", phone: "9879112233", email: "gaurav.m@example.com", city: "Vadodara", state: "Gujarat", pincode: "390001", status: "Packed", daysAgo: 8, items: [{ productId: "prod_couple_name_hoop", name: "Golden Monogram Couple Floral Hoop Wall Hanging", price: 2499, quantity: 1, image: "/images/products/couple-name-hoop.jpg" }] },
    { name: "Shreya Kapoor", phone: "9810998877", email: "shreya.k@example.com", city: "Chandigarh", state: "Punjab", pincode: "160017", status: "Confirmed", daysAgo: 5, items: [{ productId: "prod_hair_bows_linen", name: "Daisy Meadow Hand-Embroidered Linen Hair Bows (Pair)", price: 699, quantity: 2, image: "/images/products/hair-bows-linen.jpg" }] },
    { name: "Nikhil Chawla", phone: "9871029384", email: "nikhil.c@example.com", city: "Gurugram", state: "Haryana", pincode: "122002", status: "Confirmed", daysAgo: 3, items: [{ productId: "prod_boho_dreamcatcher", name: "Bohemian Dip-Dyed Rose Quartz Dreamcatcher", price: 2299, quantity: 1, image: "/images/products/boho-dreamcatcher.jpg" }] },
    { name: "Isha Dave", phone: "9898012345", email: "isha.dave@example.com", city: "Ahmedabad", state: "Gujarat", pincode: "380054", status: "Pending", daysAgo: 1, items: [{ productId: "prod_calendar_hoop", name: "Personalized Anniversary Calendar Embroidery Hoop", price: 1899, quantity: 1, image: "/images/products/calendar-hoop.jpg" }] },
    { name: "Rahul Saxena", phone: "9818776655", email: "rahul.s@example.com", city: "Noida", state: "Uttar Pradesh", pincode: "201301", status: "Pending", daysAgo: 0, items: [{ productId: "prod_velvet_bow_set", name: "Artisanal Velvet Honeybee & Wildflower Hair Clips (Trio)", price: 899, quantity: 2, image: "/images/products/velvet-bow-set.jpg" }] },
    { name: "Kavita Rao", phone: "9845112233", email: "kavita.rao@example.com", city: "Chennai", state: "Tamil Nadu", pincode: "600004", status: "Cancelled", daysAgo: 45, items: [{ productId: "prod_calendar_hoop", name: "Personalized Anniversary Calendar Embroidery Hoop", price: 1899, quantity: 1, image: "/images/products/calendar-hoop.jpg" }] },
  ];

  const orders = orderTemplates.map((t, idx) => {
    const total = t.items.reduce((s, it) => s + it.price * it.quantity, 0);
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * t.daysAgo);
    return {
      id: `KC-${740000 + idx}`,
      customerName: t.name,
      phone: t.phone,
      email: t.email,
      address: `Flat ${idx + 101}, Sunshine Residency, Near Craft Garden`,
      city: t.city,
      state: t.state,
      pincode: t.pincode,
      items: JSON.stringify(t.items),
      total: total,
      status: t.status,
      paymentMethod: idx % 3 === 0 ? "UPI" : "Cash on Delivery",
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };
  });

  // 4. Visitors data across the past 30 days
  const visits = [];
  const devices = ["desktop", "mobile", "tablet"];
  const pages = ["/", "/products", "/gallery", "/about", "/contact", "/products/prod_calendar_hoop", "/products/prod_hair_bows_linen"];

  for (let d = 30; d >= 0; d--) {
    const dailyVisits = Math.floor(18 + Math.random() * 25);
    const dayDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * d);
    for (let i = 0; i < dailyVisits; i++) {
      const timeOffset = Math.floor(Math.random() * 1000 * 60 * 60 * 24);
      const visitTime = new Date(dayDate.getTime() + timeOffset);
      visits.push({
        id: `vis_${d}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        page: pages[Math.floor(Math.random() * pages.length)],
        timestamp: visitTime.toISOString(),
        sessionId: `sess_${Math.random().toString(36).substring(2, 9)}`,
        device: devices[Math.floor(Math.random() * devices.length)],
      });
    }
  }

  const store = {
    admins,
    products,
    orders,
    visits,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf8");
  console.log(`✅ Seeded successfully!`);
  console.log(`- Admin: admin@kansara.com (Password: Admin@123)`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Orders: ${orders.length}`);
  console.log(`- Visits: ${visits.length}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
