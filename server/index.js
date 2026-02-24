try {
  require("dotenv").config({
    path: require("path").resolve(__dirname, ".env"),
  });
} catch (e) {
  console.log("Dotenv config ignored in prod");
}
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Models
const sequelize = require("./models/index");
const Book = require("./models/Book");
const Reader = require("./models/Reader");
const Transaction = require("./models/Transaction");
const User = require("./models/User");
const Reservation = require("./models/Reservation");
const Fine = require("./models/Fine");
const Notification = require("./models/Notification");

// Associations
Transaction.belongsTo(Book);
Transaction.belongsTo(Reader);
Book.hasMany(Transaction);
Reader.hasMany(Transaction);

Reservation.belongsTo(Book);
Reservation.belongsTo(Reader);
Book.hasMany(Reservation);
Reader.hasMany(Reservation);

Fine.belongsTo(Transaction);
Transaction.hasMany(Fine);

Notification.belongsTo(Reader);
Reader.hasMany(Notification);

Reader.belongsTo(User);
User.hasOne(Reader);

app.use(cors());
app.use(express.json());

// ... (existing code)

// ==================== AUTH API ====================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username },
      include: [Reader],
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Simple password check (in production, use bcrypt)
    if (user.passwordHash !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      readerId: user.Reader ? user.Reader.id : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing)
      return res.status(400).json({ error: "Username already exists" });

    const user = await User.create({
      username,
      passwordHash: password, // In production, hash with bcrypt
      fullName,
      role: role || "reader",
    });

    let readerId = null;
    if (user.role === "reader") {
      const cardId = "R" + Date.now().toString().slice(-6); // Simple CardID generation
      const reader = await Reader.create({
        name: fullName,
        cardId: cardId,
        email: username.includes("@") ? username : null,
        UserId: user.id,
      });
      readerId = reader.id;
    }

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      readerId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use(express.json());

// ==================== BOOKS API ====================
app.get("/api/books", async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};
    if (search) {
      const { Op } = require("sequelize");
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { isbn: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category) where.category = category;

    const books = await Book.findAll({ where });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{ model: Transaction, include: [Reader] }],
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      borrowedQty: 0,
    });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    await book.update(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Check if any copy is borrowed
    if (book.borrowedQty > 0) {
      return res.status(400).json({
        error: "Cannot delete book. Some copies are currently borrowed.",
      });
    }

    // Optional: Check active transactions just in case borrowedQty is out of sync
    const activeTrans = await Transaction.findOne({
      where: {
        BookId: req.params.id,
        status: {
          [require("sequelize").Op.in]: ["BORROWED", "EXTENDED", "OVERDUE"],
        },
      },
    });
    if (activeTrans) {
      return res.status(400).json({
        error:
          "Cannot delete book. It is currently involved in an active transaction.",
      });
    }

    await Book.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== READERS API ====================
app.get("/api/readers", async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      const { Op } = require("sequelize");
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { cardId: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    const readers = await Reader.findAll({ where });
    res.json(readers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/readers/:id", async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id, {
      include: [
        { model: Transaction, include: [Book] },
        { model: Reservation, include: [Book] },
      ],
    });
    if (!reader) return res.status(404).json({ error: "Reader not found" });
    res.json(reader);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/readers", async (req, res) => {
  try {
    const reader = await Reader.create(req.body);
    res.json(reader);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/readers/:id", async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ error: "Reader not found" });
    await reader.update(req.body);
    res.json(reader);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/readers/:id", async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ error: "Reader not found" });

    // Check for unreturned books
    const { Op } = require("sequelize");
    const activeTrans = await Transaction.findOne({
      where: {
        ReaderId: req.params.id,
        status: { [Op.in]: ["BORROWED", "EXTENDED", "OVERDUE"] },
      },
    });

    if (activeTrans) {
      return res.status(400).json({
        error: "Cannot delete reader. They still have unreturned books.",
      });
    }

    // Check for unpaid fines (Optional strict rule)
    // const unpaidFines = ...

    await Reader.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== TRANSACTIONS API ====================
app.get("/api/transactions", async (req, res) => {
  try {
    const { status, readerId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (readerId) where.ReaderId = readerId;

    const transactions = await Transaction.findAll({
      where,
      include: [Book, Reader],
      order: [["createdAt", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/borrow", async (req, res) => {
  try {
    const { readerId, bookId, dueDate } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Check availability
    const available =
      (book.quantity || book.totalQty || 0) - (book.borrowedQty || 0);
    if (available < 1)
      return res.status(400).json({ error: "Book not available" });

    // Validate Reader
    const reader = await Reader.findByPk(readerId);
    if (!reader) return res.status(404).json({ error: "Reader not found" });

    // Rule 1: Reader status must be ACTIVE
    if (reader.status !== "active" && reader.status !== "ACTIVE") {
      return res
        .status(400)
        .json({ error: `Reader is ${reader.status}. Cannot borrow books.` });
    }

    // Rule 2: Check for overdue books
    const overdueTransactions = await Transaction.count({
      where: {
        ReaderId: readerId,
        status: { [require("sequelize").Op.or]: ["OVERDUE"] }, // Explicitly check OVERDUE status if tracked, or calculate dynamically
        // Note: If OVERDUE status is updated viacron, this works.
        // Otherwise better to check: status='BORROWED' AND dueDate < now
      },
    });

    // More robust overdue check (dynamic)
    const { Op } = require("sequelize");
    const hasOverdue = await Transaction.findOne({
      where: {
        ReaderId: readerId,
        status: { [Op.in]: ["BORROWED", "EXTENDED"] },
        dueDate: { [Op.lt]: new Date() }, // due date < now
      },
    });

    if (hasOverdue) {
      return res
        .status(400)
        .json({ error: "Reader has overdue books. Please return them first." });
    }

    // Rule 3: Max 5 books
    const borrowedCount = await Transaction.count({
      where: {
        ReaderId: readerId,
        status: { [Op.in]: ["BORROWED", "EXTENDED", "OVERDUE"] },
      },
    });

    if (borrowedCount >= 5) {
      return res
        .status(400)
        .json({ error: "Maximum borrowing limit (5 books) reached." });
    }

    const transaction = await Transaction.create({
      ReaderId: readerId,
      BookId: bookId,
      dueDate,
      status: "BORROWED",
    });

    await book.increment("borrowedQty");

    // Create Notification
    await createNotification(
      "Mượn sách thành công",
      `Độc giả ${reader.name} đã mượn cuốn sách "${
        book.title
      }". Hạn trả: ${new Date(dueDate).toLocaleDateString("vi-VN")}`,
      "success",
      readerId,
    );

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/return", async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });

    const today = new Date();
    const dueDate = new Date(transaction.dueDate);

    transaction.returnDate = today;
    transaction.status = "RETURNED";
    await transaction.save();

    // Check if overdue and create fine
    if (today > dueDate) {
      const daysLate = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      const fineAmount = daysLate * 5000; // 5000 VND per day
      await Fine.create({
        TransactionId: transactionId,
        amount: fineAmount,
        reason: `Trả sách trễ ${daysLate} ngày`,
        paid: false,
      });
    }

    const book = await Book.findByPk(transaction.BookId);
    await book.decrement("borrowedQty");

    // Notification for return
    let msg = `Độc giả đã trả cuốn sách "${book.title}".`;
    let type = "success";
    if (today > dueDate) {
      msg += ` TRẢ MUỘN! Đã tạo phiếu phạt.`;
      type = "warning";
    }
    await createNotification("Trả sách", msg, type, transaction.ReaderId);

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Extend loan
app.post("/api/extend", async (req, res) => {
  try {
    const { transactionId, newDueDate } = req.body;
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    if (transaction.status !== "BORROWED") {
      return res.status(400).json({ error: "Can only extend active loans" });
    }
    if (transaction.extensionCount >= 2) {
      return res.status(400).json({ error: "Maximum extensions reached (2)" });
    }

    transaction.dueDate = newDueDate;
    transaction.extensionCount += 1;
    transaction.status = "EXTENDED";
    await transaction.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== RESERVATIONS API ====================
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [Book, Reader],
      order: [["createdAt", "DESC"]],
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const { readerId, bookId } = req.body;

    // Check if book is available
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Check for existing reservation
    const existing = await Reservation.findOne({
      where: { ReaderId: readerId, BookId: bookId, status: "pending" },
    });
    if (existing) return res.status(400).json({ error: "Already reserved" });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // Reservation expires in 3 days

    const reservation = await Reservation.create({
      ReaderId: readerId,
      BookId: bookId,
      expiresAt,
      status: "pending",
    });

    // Notify
    await createNotification(
      "Đặt sách mới",
      `Đã nhận yêu cầu đặt sách "${book.title}" từ độc giả.`,
      "info",
      readerId,
    );

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/reservations/:id/cancel", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" });

    reservation.status = "cancelled";
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/reservations/:id/approve", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [Book],
    });
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" });

    reservation.status = "fulfilled";
    await reservation.save();

    // Notify
    if (reservation.ReaderId) {
      await createNotification(
        "Đặt sách thành công",
        `Yêu cầu đặt sách "${reservation.Book?.title || "Không rõ"}" của bạn đã được duyệt.`,
        "success",
        reservation.ReaderId,
      );
    }

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== FINES API ====================
app.get("/api/fines", async (req, res) => {
  try {
    const { paid } = req.query;
    const where = {};
    if (paid !== undefined) where.paid = paid === "true";

    const fines = await Fine.findAll({
      where,
      include: [{ model: Transaction, include: [Book, Reader] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/fines/:id/pay", async (req, res) => {
  try {
    const fine = await Fine.findByPk(req.params.id);
    if (!fine) return res.status(404).json({ error: "Fine not found" });

    fine.paid = true;
    fine.paidAt = new Date();
    await fine.save();
    res.json(fine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== STATISTICS API ====================
app.get("/api/stats", async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalReaders = await Reader.count();
    const activeBorrows = await Transaction.count({
      where: { status: "BORROWED" },
    });
    const overdueCount = await Transaction.count({
      where: { status: "OVERDUE" },
    });
    const pendingReservations = await Reservation.count({
      where: { status: "pending" },
    });
    const unpaidFines = await Fine.sum("amount", { where: { paid: false } });

    // Books by category
    const booksByCategory = await Book.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQty"],
      ],
      group: ["category"],
    });

    // Recent transactions
    const recentTransactions = await Transaction.findAll({
      include: [Book, Reader],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // Monthly stats
    const { Op } = require("sequelize");
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const borrowsThisMonth = await Transaction.count({
      where: { createdAt: { [Op.gte]: thisMonth } },
    });
    const returnsThisMonth = await Transaction.count({
      where: { returnDate: { [Op.gte]: thisMonth } },
    });

    res.json({
      totalBooks,
      totalReaders,
      activeBorrows,
      overdueCount,
      pendingReservations,
      unpaidFines: unpaidFines || 0,
      booksByCategory,
      recentTransactions,
      borrowsThisMonth,
      returnsThisMonth,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== NOTIFICATIONS API ====================
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
      limit: 50, // Get last 50 notifications
    });
    // Calculate unread count
    const unreadCount = await Notification.count({ where: { isRead: false } });
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    const notif = await Notification.findByPk(req.params.id);
    if (notif) {
      notif.isRead = true;
      await notif.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/notifications/read-all", async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { isRead: false } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to create notification
const createNotification = async (
  title,
  message,
  type = "info",
  readerId = null,
) => {
  try {
    await Notification.create({ title, message, type, ReaderId: readerId });
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// ==================== AUTH API ====================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Simple password check (in production, use bcrypt)
    if (user.passwordHash !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing)
      return res.status(400).json({ error: "Username already exists" });

    const user = await User.create({
      username,
      passwordHash: password, // In production, hash with bcrypt
      fullName,
      role: role || "reader",
    });

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Library Management System API is running..." });
});

// Global Error Handler for Vercel 500 Debugging
app.use((err, req, res, next) => {
  console.error("Global Express Error:", err);
  res.status(500).json({ error: err.message, stack: err.stack });
});

// Setup/Verification Route to safely test DB connection
app.get("/api/init", async (req, res) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { username: "admin" } });
    if (!adminExists) {
      await User.create({
        username: "admin",
        passwordHash: "admin123",
        fullName: "Administrator",
        role: "admin",
      });
    }
    res.json({
      status: "ok",
      message: "Database connected and synced successfully.",
    });
  } catch (err) {
    console.error("DB Init Error:", err);
    res
      .status(500)
      .json({ status: "error", error: err.message, stack: err.stack });
  }
});

// Sync Database and Start Server
if (require.main === module && !process.env.VERCEL) {
  sequelize
    .sync({ alter: true })
    .then(async () => {
      console.log("Database synced");

      // Create default admin user
      const adminExists = await User.findOne({ where: { username: "admin" } });
      if (!adminExists) {
        await User.create({
          username: "admin",
          passwordHash: "admin123",
          fullName: "Administrator",
          role: "admin",
        });
        console.log("Default admin user created");
      }

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
    });
} else if (process.env.VERCEL) {
  // Proactively sync database when Vercel function wakes up, with catch to prevent crash
  sequelize
    .sync({ alter: true })
    .then(async () => {
      const adminExists = await User.findOne({ where: { username: "admin" } });
      if (!adminExists) {
        await User.create({
          username: "admin",
          passwordHash: "admin123",
          fullName: "Administrator",
          role: "admin",
        });
      }
    })
    .catch((e) => console.error("Vercel background DB sync failed:", e));
}

// Export for Vercel serverless function
module.exports = app;
