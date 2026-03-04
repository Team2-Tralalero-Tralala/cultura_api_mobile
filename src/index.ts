import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { prisma } from "./libs/prisma.js";
import { authenticateToken, AuthRequest } from "./libs/auth-middleware.js";
import { apiResponse } from "./libs/response.js";
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

  if (!user) return apiResponse(res, 404, {}, "ไม่พบบัญชี");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return apiResponse(res, 401, {}, "รหัสผ่านไม่ถูกต้อง");

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  return apiResponse(res, 200, { token }, "Login successful");
});
app.get(
  "/package/:packageId",
  authenticateToken,
  async (req: AuthRequest, res) => {
    const packages = await prisma.package.findUnique({
      where: { id: Number(req.params.packageId) },
    });
    if (!packages) return apiResponse(res, 404, {}, "ไม่พบแพ็กเกจ");
    return apiResponse(res, 200, packages);
  },
);

app.get(
  "/booking-history/own",
  authenticateToken,
  async (req: AuthRequest, res) => {
    const bookingPackages = await prisma.bookingHistory.findMany({
      where: { userId: Number(req.user?.userId) },
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
    if (!bookingPackages)
      return apiResponse(res, 404, {}, "ไม่พบประวัติการจอง");
    return apiResponse(res, 200, bookingPackages);
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
    if (!packages) return apiResponse(res, 404, {}, "ไม่พบแพ็กเกจ");
    return apiResponse(res, 200, packages);
  } else if (filter === "newest") {
    const packages = await prisma.package.findMany({
      orderBy: {
        createdAt: "desc",
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
    if (!packages) return apiResponse(res, 404, {}, "ไม่พบแพ็กเกจ");
    return apiResponse(res, 200, packages);
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
  if (!packages) return apiResponse(res, 404, {}, "ไม่พบแพ็กเกจ");
  return apiResponse(res, 200, packages);
});
app.get("/me", authenticateToken, (req: AuthRequest, res) => {
  return apiResponse(res, 200, { user: req.user });
});
app.get("/", async (req, res) => {
  return apiResponse(res, 200, {}, "Hello World");
});
app.listen(process.env.PORT || 8000, () => {
  console.log("Server running on http://localhost:" + process.env.PORT);
});
