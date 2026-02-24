require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const sequelize = require("./models/index");
const Book = require("./models/Book");
const Reader = require("./models/Reader");
const Transaction = require("./models/Transaction");
const User = require("./models/User");
const Reservation = require("./models/Reservation");
const Fine = require("./models/Fine");
const Notification = require("./models/Notification");

// Associations (Must match index.js)
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

const seedData = async () => {
  try {
    // Disable FK checks to allow dropping tables with constraints
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });
    await sequelize.sync({ force: true }); // Reset database
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });
    console.log("Database synced (force reset).");

    // --- USERS ---
    const users = await User.bulkCreate([
      {
        username: "admin",
        passwordHash: "admin123",
        fullName: "Quản Trị Viên",
        role: "admin",
      },
      {
        username: "lib",
        passwordHash: "123456",
        fullName: "Thủ Thư",
        role: "librarian",
      },
    ]);
    console.log(`Created ${users.length} users.`);

    // --- BOOKS ---
    const booksData = [
      {
        isbn: "978-604-0-12345-1",
        title: "Nhập môn Công nghệ Phần mềm",
        author: "Nguyễn V.",
        category: "Công nghệ thông tin",
        description: "Giáo trình cơ bản về quy trình phát triển phần mềm.",
        publisher: "NXB Giáo Dục",
        publishYear: 2023,
        totalQty: 10,
        borrowedQty: 0,
        coverUrl: "https://placehold.co/400x600?text=CNPM",
      },
      {
        isbn: "978-604-0-12345-2",
        title: "Cấu trúc dữ liệu và Giải thuật",
        author: "Lê M.",
        category: "Công nghệ thông tin",
        description:
          "Các cấu trúc dữ liệu cơ bản và giải thuật sắp xếp, tìm kiếm.",
        publisher: "NXB Đại học Quốc gia",
        publishYear: 2022,
        totalQty: 15,
        borrowedQty: 0,
        coverUrl: "https://placehold.co/400x600?text=DSA",
      },
      {
        isbn: "978-604-0-12345-3",
        title: "Trí tuệ nhân tạo",
        author: "Stuart Russell",
        category: "Công nghệ thông tin",
        description: "Kiến thức nền tảng về AI và Machine Learning.",
        publisher: "NXB Khoa học Kỹ thuật",
        publishYear: 2024,
        totalQty: 5,
        borrowedQty: 0,
        coverUrl: "https://placehold.co/400x600?text=AI",
      },
      {
        isbn: "978-604-0-12345-4",
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        category: "Kỹ năng sống",
        description: "Nghệ thuật thu phục lòng người.",
        publisher: "NXB Trẻ",
        publishYear: 2020,
        totalQty: 20,
        borrowedQty: 0,
        coverUrl: "https://placehold.co/400x600?text=Dac+Nhan+Tam",
      },
      {
        isbn: "978-604-0-12345-5",
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        category: "Văn học",
        description: "Hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.",
        publisher: "NXB Văn học",
        publishYear: 2021,
        totalQty: 12,
        borrowedQty: 0,
        coverUrl: "https://placehold.co/400x600?text=Nha+Gia+Kim",
      },
      {
        isbn: "978-604-0-12345-6",
        title: "Lập trình Web với React",
        author: "Facebook Team",
        category: "Công nghệ thông tin",
        description: "Xây dựng ứng dụng web hiện đại.",
        publisher: "O'Reilly",
        publishYear: 2023,
        totalQty: 8,
        borrowedQty: 0,
        coverUrl: "https://placehold.co/400x600?text=React",
      },
      {
        isbn: "978-604-0-12345-7",
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Công nghệ thông tin",
        description: "Mã sạch và con đường trở thành lập trình viên giỏi.",
        publisher: "Prentice Hall",
        publishYear: 2008,
        totalQty: 7,
        borrowedQty: 0,
        coverUrl: "https://placehold.co/400x600?text=Clean+Code",
      },
      {
        isbn: "978-604-0-12345-8",
        title: "Dế Mèn Phiêu Lưu Ký",
        author: "Tô Hoài",
        category: "Văn học thiếu nhi",
        description: "Câu chuyện về chú dế mèn.",
        publisher: "NXB Kim Đồng",
        publishYear: 2019,
        totalQty: 30,
        borrowedQty: 0,
        coverUrl: "https://placehold.co/400x600?text=De+Men",
      },
    ];

    const books = await Book.bulkCreate(booksData);
    console.log(`Created ${books.length} books.`);

    // --- READERS ---
    const readersData = [
      {
        cardId: "SV001",
        name: "Nguyễn Văn A",
        faculty: "Công nghệ Phần mềm",
        email: "a.nguyen@example.com",
        phone: "0901234567",
        status: "active",
      },
      {
        cardId: "SV002",
        name: "Trần Thị B",
        faculty: "Hệ thống Thông tin",
        email: "b.tran@example.com",
        phone: "0901234568",
        status: "active",
      },
      {
        cardId: "SV003",
        name: "Lê Văn C",
        faculty: "Mạng máy tính",
        email: "c.le@example.com",
        phone: "0901234569",
        status: "suspended",
      },
      {
        cardId: "SV004",
        name: "Phạm Thị D",
        faculty: "Khoa học máy tính",
        email: "d.pham@example.com",
        phone: "0901234570",
        status: "active",
      },
      {
        cardId: "SV005",
        name: "Hoàng Văn E",
        faculty: "Kỹ thuật phần mềm",
        email: "e.hoang@example.com",
        phone: "0901234571",
        status: "expired",
      },
    ];

    const readers = await Reader.bulkCreate(readersData);
    console.log(`Created ${readers.length} readers.`);

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
