require("dotenv").config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const errorMiddleware = require("./middlewares/error.middleware.js");
const tenantMiddleware = require("./middlewares/db/tenant.middleware.js");

const app = express();
const server = http.createServer(app);

// ------------------ MUHITNI ANIQLASH ------------------
const joriyMuhit = (process.env.NODE_ENV || "development").trim();
const isProd = joriyMuhit === "production";

// ------------------ SOCKET.IO SOZLAMALARI ------------------
const io = new Server(server, {
    cors: {
        // Mobil ilovalarda socket ulanishi uchun "*" yoki aniq originlar kerak
        origin: "*", 
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// ------------------ MIDDLEWARES ------------------

// 1. JSON va URL-encoded (limit bilan)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 2. CORS sozlamalari (MOBILE UCHUN OPTIMALLASHTIRILGAN)
const allowedOrigins = [
    "https://restouz-core.company-erp.uz",
    "http://localhost:5173",
    "http://localhost:3000",
    "capacitor://localhost", // iOS Capacitor ilovasi uchun
    "http://localhost",       // Android Capacitor ilovasi uchun
    "http://127.0.0.1"
];

app.use(cors({
    origin: function (origin, callback) {
        // Origin bo'lmasa (mobile ba'zan yubormaydi) yoki ruxsat berilgan bo'lsa
        if (!origin || allowedOrigins.includes(origin) || !isProd) {
            callback(null, true);
        } else {
            console.log("🔴 CORS Bloklandi:", origin);
            callback(new Error("CORS: Ruxsat etilmagan domen"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin', 
        'Content-Type', 
        'Accept', 
        'Authorization', 
        'x-tenant-id' // Custom headeringiz ruxsat etilgan bo'lishi shart
    ]
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 3. Hajm oshib ketganda xatoni ushlash
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            status: "413",
            msg: "Yuborilgan ma'lumot hajmi juda katta! Maksimal limit: 10MB"
        });
    }
    next(err);
});

// ------------------ ROUTES ------------------
const tenantRouter = express.Router();
tenantRouter.use(tenantMiddleware); // Har bir so'rovda x-tenant-id ni tekshiradi

tenantRouter.use("/admin/permission", require("./routes/admin/permission.route.js"));
tenantRouter.use("/admin/role", require("./routes/admin/role.route.js"));
tenantRouter.use("/admin/user", require("./routes/admin/users.route.js"));
tenantRouter.use("/auth", require("./routes/auth.route.js"));
tenantRouter.use("/tabel", require("./routes/tabel/tabel.route.js"));

// Asosiy API yo'li
app.use("/api/v1", tenantRouter);

// Global xatoliklar (Hamma routelardan keyin bo'lishi shart)
app.use(errorMiddleware);

// ------------------ SOCKET.IO LOGIKASI ------------------
io.on("connection", (socket) => {
    console.log("⚡ Yangi ulanish:", socket.id);

    socket.on("AGENT:JOIN", (storeId) => {
        if (storeId) {
            socket.join(String(storeId));
            console.log(`🏠 ROOM-GA KIRILDI: "${storeId}"`);
        }
    });

    socket.on("AGENT:PRINTER_LIST", (data) => {
        const roomName = String(data.storeId);
        io.to(roomName).emit("FRONTEND:UPDATE_PRINTERS", data.printers);
    });

    socket.on("SERVER:GET_PRINTERS", (data) => {
        io.to(String(data.storeId)).emit("SERVER:GET_PRINTERS");
    });

    socket.on("FRONTEND:SEND_PRINT", (data) => {
        io.to(String(data.storeId)).emit("SERVER:PRINT_LABEL", data);
    });

    socket.on("AGENT:PRINT_STATUS", (data) => {
        io.to(String(data.storeId)).emit("FRONTEND:PRINT_RESULT", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket uzildi:", socket.id);
    });
});

// ------------------ DATABASE VA SERVER START ------------------
const PORT = process.env.PORT || 8000;

const START = async () => {
    try {
        // Mongoose qat'iy rejim (optional)
        mongoose.set('strictQuery', false);
        
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ MongoDB muvaffaqiyatli ulandi");

        server.listen(PORT, () => {
            console.log(`\n--- TIZIM HOLATI ---`);
            console.log(`🌍 Rejim: ${isProd ? "PRODUCTION 🔥" : "DEVELOPMENT 🛠️"}`);
            console.log(`🚀 Port: ${PORT}`);
            console.log(`🔗 URL: http://localhost:${PORT}`);
            console.log(`--------------------\n`);
        });
    } catch (err) {
        console.error(`❌ Serverni ishga tushirishda xatolik: ${err.message}`);
        process.exit(1);
    }
};

if (require.main === module) {
    START();
}

module.exports = app;