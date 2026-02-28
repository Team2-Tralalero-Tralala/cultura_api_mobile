import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { prisma } from "./libs/prisma.js";
import { authenticateToken, AuthRequest } from "./libs/auth-middleware.js";
import cors from "cors";

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET as string;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return res.json({ message: "ไม่พบบัญชี" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ message: "รหัสผ่านไม่ถูกต้อง" });

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  return res.json({ message: "Login successful" });
});

app.get("/users", authenticateToken, async (req: AuthRequest, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get(
  "/package/:packageId",
  authenticateToken,
  async (req: AuthRequest, res) => {
    const packages = await prisma.package.findUnique({
      where: { id: Number(req.params.packageId) },
    });
    if (!packages) return res.json({ message: "ไม่พบแพ็กเกจ" });
    res.json(packages);
  },
);

app.get(
  "/booking-history/:userId",
  authenticateToken,
  async (req: AuthRequest, res) => {
    const bookingPackages = await prisma.bookingHistory.findMany({
      where: { userId: Number(req.params.userId) },
      select: {
        package: {
          select: {
            name: true,
            address: true,
            bookingStartDate: true,
            bookingEndDate: true,
            tags: {
              select: {
                tag: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            price: true,
            images: {
              select: {
                type: true,
                filepath: true,
              },
            },
          },
        },
      },
    });
    if (!bookingPackages) return res.json({ message: "ไม่พบประวัติการจอง" });
    res.json(bookingPackages);
  },
);

app.get("/packages", authenticateToken, async (req: AuthRequest, res) => {
  const { filter } = req.query;
  if (filter === "popular") {
    const packages = await prisma.package.findMany({
      orderBy: {
        bookings: {
          _count: "desc",
        },
      },
      select: {
        name: true,
        address: true,
        bookingStartDate: true,
        bookingEndDate: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        price: true,
        images: {
          select: {
            type: true,
            filepath: true,
          },
        },
      },
    });
    if (!packages) return res.json({ message: "ไม่พบแพ็กเกจ" });
    res.json(packages);
  } else if (filter === "newest") {
    const packages = await prisma.package.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!packages) return res.json({ message: "ไม่พบแพ็กเกจ" });
    res.json(packages);
  }
});
app.get("/search", authenticateToken, async (req: AuthRequest, res) => {
  const { keyword } = req.query;
  const packages = await prisma.package.findMany({
    where: {
      name: {
        contains: keyword as string,
      },
    },
  });
  if (!packages) return res.json({ message: "ไม่พบแพ็กเกจ" });
  res.json(packages);
});
app.get("/me", authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});
app.get("/", async (req, res) => {
  res.json({ message: "Hello World" });
});
app.listen(process.env.PORT || 8000, () => {
  console.log("Server running on http://localhost:" + process.env.PORT);
});
