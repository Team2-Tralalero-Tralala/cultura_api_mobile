import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/libs/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // ==================== Tags ====================
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "วัฒนธรรม" } }),
    prisma.tag.create({ data: { name: "ธรรมชาติ" } }),
    prisma.tag.create({ data: { name: "อาหาร" } }),
    prisma.tag.create({ data: { name: "ผจญภัย" } }),
    prisma.tag.create({ data: { name: "ประวัติศาสตร์" } }),
    prisma.tag.create({ data: { name: "ศิลปะ" } }),
    prisma.tag.create({ data: { name: "โฮมสเตย์" } }),
    prisma.tag.create({ data: { name: "ชุมชน" } }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // ==================== Users ====================
  // password: "password123" hashed with bcrypt
  const hashedPassword = bcrypt.hashSync("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "somchai",
        email: "somchai@example.com",
        password: hashedPassword,
        firstname: "สมชาย",
        lastname: "ใจดี",
      },
    }),
    prisma.user.create({
      data: {
        username: "suda",
        email: "suda@example.com",
        password: hashedPassword,
        firstname: "สุดา",
        lastname: "สวยงาม",
      },
    }),
    prisma.user.create({
      data: {
        username: "john_doe",
        email: "john@example.com",
        password: hashedPassword,
        firstname: "John",
        lastname: "Doe",
      },
    }),
    prisma.user.create({
      data: {
        username: "tanaka",
        email: "tanaka@example.com",
        password: hashedPassword,
        firstname: "Yuki",
        lastname: "Tanaka",
      },
    }),
    prisma.user.create({
      data: {
        username: "nattapong",
        email: "nattapong@example.com",
        password: hashedPassword,
        firstname: "ณัฐพงศ์",
        lastname: "พิทักษ์",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // ==================== Packages ====================
  const packages = await Promise.all([
    prisma.package.create({
      data: {
        name: "เส้นทางวัฒนธรรมล้านนา 3 วัน 2 คืน",
        description:
          "สัมผัสวิถีชีวิตล้านนาแท้ๆ เยี่ยมชมวัดเก่าแก่ เรียนทำอาหารพื้นเมือง และชมการแสดงศิลปะพื้นบ้าน",
        price: 4500,
        capacity: 20,
        suggestion: "ควรสวมรองเท้าที่สะดวกสบาย นำหมวกและครีมกันแดดมาด้วย",
        bookingStartDate: new Date("2026-03-01"),
        bookingEndDate: new Date("2026-03-03"),
      },
    }),
    prisma.package.create({
      data: {
        name: "ดอยสุเทพ & วัดพระธาตุ 1 วัน",
        description:
          "ขึ้นดอยสุเทพไหว้พระธาตุ ชมวิวเมืองเชียงใหม่ แวะตลาดม้ง และสวนดอกไม้",
        price: 1800,
        capacity: 30,
        address: "ดอยสุเทพ เชียงใหม่",
        suggestion: "อากาศเย็นบนดอย ควรนำเสื้อกันหนาวมาด้วย",
        bookingStartDate: new Date("2026-03-15"),
        bookingEndDate: new Date("2026-03-15"),
      },
    }),
    prisma.package.create({
      data: {
        name: "เดินเท้าสำรวจย่านเมืองเก่าเชียงใหม่",
        description:
          "เดินเท้าสำรวจวัดสำคัญในเขตเมืองเก่า ชมสถาปัตยกรรมล้านนา แวะชิมอาหารท้องถิ่น",
        price: 1200,
        capacity: 15,
        suggestion: "สวมรองเท้าเดินสบาย พกน้ำดื่มมาด้วย",
        bookingStartDate: new Date("2026-04-01"),
        bookingEndDate: new Date("2026-04-01"),
      },
    }),
    prisma.package.create({
      data: {
        name: "ลำพูน เมืองหริภุญชัย 2 วัน 1 คืน",
        description:
          "เยือนเมืองโบราณหริภุญชัย ชมวัดพระธาตุหริภุญชัย สักการะพระนางจามเทวี ชมสวนลำไย",
        price: 3200,
        capacity: 25,
        suggestion: "แนะนำให้ซื้อลำไยสดจากสวนกลับบ้าน",
        bookingStartDate: new Date("2026-04-10"),
        bookingEndDate: new Date("2026-04-11"),
      },
    }),
    prisma.package.create({
      data: {
        name: "ปาย สวรรค์ของนักเดินทาง 3 วัน 2 คืน",
        description:
          "สัมผัสบรรยากาศปาย สะพานประวัติศาสตร์ ถนนคนเดิน น้ำพุร้อน และทะเลหมอก",
        price: 5500,
        capacity: 15,
        suggestion: "ช่วงหน้าหนาวอากาศเย็นมาก ควรเตรียมเสื้อกันหนาว",
        bookingStartDate: new Date("2026-05-01"),
        bookingEndDate: new Date("2026-05-03"),
      },
    }),
  ]);

  console.log(`✅ Created ${packages.length} packages`);

  // ==================== Package Images ====================
  const packageImages = await Promise.all(
    packages.flatMap((pkg: any) => [
      prisma.packageImage.create({
        data: {
          type: "COVER",
          filepath: `/uploads/packages/${pkg.id}/cover.jpg`,
          packageId: pkg.id,
        },
      }),
      prisma.packageImage.create({
        data: {
          type: "GALLERY",
          filepath: `/uploads/packages/${pkg.id}/gallery_1.jpg`,
          packageId: pkg.id,
        },
      }),
      prisma.packageImage.create({
        data: {
          type: "GALLERY",
          filepath: `/uploads/packages/${pkg.id}/gallery_2.jpg`,
          packageId: pkg.id,
        },
      }),
    ]),
  );

  console.log(`✅ Created ${packageImages.length} package images`);

  // ==================== Package Tags ====================
  const packageTagMapping: [number, number[]][] = [
    [packages[0].id, [tags[0].id, tags[4].id, tags[7].id]], // วัฒนธรรม, ประวัติศาสตร์, ชุมชน
    [packages[1].id, [tags[1].id, tags[0].id]], // ธรรมชาติ, วัฒนธรรม
    [packages[2].id, [tags[0].id, tags[2].id, tags[5].id]], // วัฒนธรรม, อาหาร, ศิลปะ
    [packages[3].id, [tags[4].id, tags[0].id, tags[1].id]], // ประวัติศาสตร์, วัฒนธรรม, ธรรมชาติ
    [packages[4].id, [tags[3].id, tags[1].id, tags[6].id]], // ผจญภัย, ธรรมชาติ, โฮมสเตย์
  ];

  const packageTags = await Promise.all(
    packageTagMapping.flatMap(([packageId, tagIds]) =>
      tagIds.map((tagId) =>
        prisma.packageTag.create({
          data: { packageId, tagId },
        }),
      ),
    ),
  );

  console.log(`✅ Created ${packageTags.length} package tags`);

  // ==================== Package Facilities ====================
  const packageFacilities = await Promise.all([
    // Package 1 facilities
    prisma.packageFacility.create({
      data: { name: "รถรับ-ส่ง", packageId: packages[0].id },
    }),
    prisma.packageFacility.create({
      data: { name: "อาหาร 3 มื้อ", packageId: packages[0].id },
    }),
    prisma.packageFacility.create({
      data: { name: "ไกด์ท้องถิ่น", packageId: packages[0].id },
    }),
    // Package 2 facilities
    prisma.packageFacility.create({
      data: { name: "รถรับ-ส่ง", packageId: packages[1].id },
    }),
    prisma.packageFacility.create({
      data: { name: "อาหารกลางวัน", packageId: packages[1].id },
    }),
    // Package 3 facilities
    prisma.packageFacility.create({
      data: { name: "ไกด์ท้องถิ่น", packageId: packages[2].id },
    }),
    prisma.packageFacility.create({
      data: { name: "น้ำดื่ม", packageId: packages[2].id },
    }),
    // Package 4 facilities
    prisma.packageFacility.create({
      data: { name: "รถรับ-ส่ง", packageId: packages[3].id },
    }),
    prisma.packageFacility.create({
      data: { name: "ที่พัก 1 คืน", packageId: packages[3].id },
    }),
    prisma.packageFacility.create({
      data: { name: "อาหาร 4 มื้อ", packageId: packages[3].id },
    }),
    // Package 5 facilities
    prisma.packageFacility.create({
      data: { name: "รถรับ-ส่ง", packageId: packages[4].id },
    }),
    prisma.packageFacility.create({
      data: { name: "ที่พัก 2 คืน", packageId: packages[4].id },
    }),
    prisma.packageFacility.create({
      data: { name: "อาหาร 6 มื้อ", packageId: packages[4].id },
    }),
    prisma.packageFacility.create({
      data: { name: "จักรยานให้ยืม", packageId: packages[4].id },
    }),
  ]);

  console.log(`✅ Created ${packageFacilities.length} package facilities`);

  // ==================== Homestays ====================
  const homestays = await Promise.all([
    prisma.homestay.create({
      data: {
        name: "บ้านล้านนา โฮมสเตย์",
        description:
          "บ้านไม้สักทองสไตล์ล้านนาแท้ๆ บรรยากาศร่มรื่น ใกล้ธรรมชาติ",
        type: "บ้านไม้",
        address: "123 หมู่ 4 ต.เวียง อ.เชียงแสน จ.เชียงราย",
        capacity: 6,
      },
    }),
    prisma.homestay.create({
      data: {
        name: "เรือนนอนดอย",
        description: "ที่พักบนดอยบรรยากาศเย็นสบาย วิวทะเลหมอก",
        type: "เรือนไม้",
        address: "45 หมู่ 2 ต.ศรีภูมิ อ.เมือง จ.เชียงใหม่",
        capacity: 4,
      },
    }),
    prisma.homestay.create({
      data: {
        name: "กระท่อมริมน้ำ",
        description: "กระท่อมน่ารักริมแม่น้ำปาย เสียงน้ำไหลช่วยผ่อนคลาย",
        type: "กระท่อม",
        address: "89 หมู่ 7 ต.เวียงเหนือ อ.ปาย จ.แม่ฮ่องสอน",
        capacity: 2,
      },
    }),
    prisma.homestay.create({
      data: {
        name: "บ้านสวนลำไย",
        description: "ที่พักกลางสวนลำไย อากาศดี เงียบสงบ",
        type: "บ้านปูน",
        address: "56 หมู่ 3 ต.ในเมือง อ.เมือง จ.ลำพูน",
        capacity: 8,
      },
    }),
  ]);

  console.log(`✅ Created ${homestays.length} homestays`);

  // ==================== Homestay Images ====================
  const homestayImages = await Promise.all(
    homestays.flatMap((hs: any) => [
      prisma.homestayImage.create({
        data: {
          type: "COVER",
          filepath: `/uploads/homestays/${hs.id}/cover.jpg`,
          homestayId: hs.id,
        },
      }),
      prisma.homestayImage.create({
        data: {
          type: "GALLERY",
          filepath: `/uploads/homestays/${hs.id}/gallery_1.jpg`,
          homestayId: hs.id,
        },
      }),
    ]),
  );

  console.log(`✅ Created ${homestayImages.length} homestay images`);

  // ==================== Homestay Facilities ====================
  const homestayFacilities = await Promise.all([
    prisma.homestayFacility.create({
      data: { name: "Wi-Fi", homestayId: homestays[0].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "ที่จอดรถ", homestayId: homestays[0].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "อาหารเช้า", homestayId: homestays[0].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "Wi-Fi", homestayId: homestays[1].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "น้ำอุ่น", homestayId: homestays[1].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "Wi-Fi", homestayId: homestays[2].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "จักรยานให้ยืม", homestayId: homestays[2].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "Wi-Fi", homestayId: homestays[3].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "ที่จอดรถ", homestayId: homestays[3].id },
    }),
    prisma.homestayFacility.create({
      data: { name: "สวนผลไม้", homestayId: homestays[3].id },
    }),
  ]);

  console.log(`✅ Created ${homestayFacilities.length} homestay facilities`);

  // ==================== Homestay Packages ====================
  const homestayPackages = await Promise.all([
    prisma.homestayPackage.create({
      data: {
        participant: 4,
        checkIn: new Date("2026-03-01T14:00:00"),
        checkOut: new Date("2026-03-03T11:00:00"),
        homestayId: homestays[0].id,
        packageId: packages[0].id,
      },
    }),
    prisma.homestayPackage.create({
      data: {
        participant: 2,
        checkIn: new Date("2026-04-10T14:00:00"),
        checkOut: new Date("2026-04-11T11:00:00"),
        homestayId: homestays[3].id,
        packageId: packages[3].id,
      },
    }),
    prisma.homestayPackage.create({
      data: {
        participant: 2,
        checkIn: new Date("2026-05-01T14:00:00"),
        checkOut: new Date("2026-05-03T11:00:00"),
        homestayId: homestays[2].id,
        packageId: packages[4].id,
      },
    }),
  ]);

  console.log(`✅ Created ${homestayPackages.length} homestay-package links`);

  // ==================== Booking History ====================
  const bookings = await Promise.all([
    prisma.bookingHistory.create({
      data: {
        participant: 2,
        userId: users[0].id,
        packageId: packages[0].id,
      },
    }),
    prisma.bookingHistory.create({
      data: {
        participant: 3,
        userId: users[1].id,
        packageId: packages[0].id,
      },
    }),
    prisma.bookingHistory.create({
      data: {
        participant: 1,
        userId: users[2].id,
        packageId: packages[1].id,
      },
    }),
    prisma.bookingHistory.create({
      data: {
        participant: 2,
        userId: users[3].id,
        packageId: packages[2].id,
      },
    }),
    prisma.bookingHistory.create({
      data: {
        participant: 4,
        userId: users[4].id,
        packageId: packages[3].id,
      },
    }),
    prisma.bookingHistory.create({
      data: {
        participant: 2,
        userId: users[0].id,
        packageId: packages[4].id,
      },
    }),
    prisma.bookingHistory.create({
      data: {
        participant: 1,
        userId: users[2].id,
        packageId: packages[4].id,
      },
    }),
    prisma.bookingHistory.create({
      data: {
        participant: 5,
        userId: users[1].id,
        packageId: packages[3].id,
      },
    }),
  ]);

  console.log(`✅ Created ${bookings.length} bookings`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
