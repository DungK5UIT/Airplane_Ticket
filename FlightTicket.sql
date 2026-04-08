CREATE DATABASE FlightTicket;
USE FlightTicket;

/*
CREATE TABLE NGUOIDUNG (
    MaNguoiDung INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(255),
    CCCD VARCHAR(20),
    Sdt VARCHAR(20),
    Email VARCHAR(255) UNIQUE,
    MatKhau VARCHAR(255),
    Ngsinh DATE,
    DiaChi VARCHAR(255),
    VaiTro VARCHAR(50) COMMENT '''KHACH_HANG'', ''ADMIN'', ''NHAN_VIEN'''
);

CREATE TABLE SANBAY (
    MaSanBay INT AUTO_INCREMENT PRIMARY KEY,
    MaIATA VARCHAR(3) UNIQUE,
    TenSanBay VARCHAR(255),
    ThanhPho VARCHAR(255),
    QuocGia VARCHAR(255)
);

CREATE TABLE HANGHANGKHONG (
    MaHangHK INT AUTO_INCREMENT PRIMARY KEY,
    TenHang VARCHAR(255),
    LogoURL VARCHAR(255),
    MaIATA VARCHAR(2)
);

CREATE TABLE HANGVE (
    MaHangVe INT PRIMARY KEY,
    TenHangVe VARCHAR(100),
    HeSoGia DECIMAL(5,2)
);

CREATE TABLE KHUYENMAI (
    MaKhuyenMai INT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(50) UNIQUE,
    TenChuongTrinh VARCHAR(255),
    PhanTramGiam DECIMAL(5,2),
    SoTienGiamToiDa DECIMAL(15,2),
    NgayBatDau DATE,
    NgayKetThuc DATE,
    SoLuongConLai INT
);


CREATE TABLE PHUONGTHUCTHANHTOAN (
    MaPTTT INT PRIMARY KEY,
    TenPTTT VARCHAR(255)
);

CREATE TABLE MAYBAY (
    MaMayBay INT AUTO_INCREMENT PRIMARY KEY,
    MaHangHK INT,
    TenMayBay VARCHAR(255),
    SoDoGhe VARCHAR(255),
    TongSoGhe INT,
    FOREIGN KEY (MaHangHK) REFERENCES HANGHANGKHONG(MaHangHK) ON DELETE SET NULL
);



CREATE TABLE DATVE (
    MaDatVe INT AUTO_INCREMENT PRIMARY KEY,
    MaDatCho VARCHAR(10) UNIQUE,
    MaNguoiDung INT NULL,
    MaKhuyenMai INT NULL,
    NgayDatVe TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TongTien DECIMAL(15,2),
    TrangThai VARCHAR(50),
    FOREIGN KEY (MaNguoiDung) REFERENCES NGUOIDUNG(MaNguoiDung) ON DELETE SET NULL,
    FOREIGN KEY (MaKhuyenMai) REFERENCES KHUYENMAI(MaKhuyenMai) ON DELETE SET NULL
);

CREATE TABLE CHUYENBAY (
    MaChuyenBay INT AUTO_INCREMENT PRIMARY KEY,
    MaHangHK INT,
    MaMayBay INT,
    MaSanBayDi INT NOT NULL,
    MaSanBayDen INT NOT NULL,
    NgayGioKhoiHanh TIMESTAMP NULL,
    NgayGioHaCanh TIMESTAMP NULL,
    ThoiGianBay INT,
    TrangThai VARCHAR(50),
    FOREIGN KEY (MaHangHK) REFERENCES HANGHANGKHONG(MaHangHK) ON DELETE SET NULL,
    FOREIGN KEY (MaMayBay) REFERENCES MAYBAY(MaMayBay) ON DELETE SET NULL,
    FOREIGN KEY (MaSanBayDi) REFERENCES SANBAY(MaSanBay) ON DELETE CASCADE,
    FOREIGN KEY (MaSanBayDen) REFERENCES SANBAY(MaSanBay) ON DELETE CASCADE
);

CREATE TABLE THANHTOAN (
    MaThanhToan INT AUTO_INCREMENT PRIMARY KEY,
    MaDatVe INT,
    MaPTTT INT,
    SoTien DECIMAL(15,2),
    ThoiGianThanhToan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TrangThai VARCHAR(50),
    FOREIGN KEY (MaDatVe) REFERENCES DATVE(MaDatVe) ON DELETE CASCADE,
    FOREIGN KEY (MaPTTT) REFERENCES PHUONGTHUCTHANHTOAN(MaPTTT) ON DELETE SET NULL
);

CREATE TABLE CT_CHUYENBAY (
    MaChuyenBay INT,
    MaHangVe INT,
    SoLuongCho INT,
    SoLuongConLai INT,
    GiaCoBan DECIMAL(15,2),
    PRIMARY KEY (MaChuyenBay, MaHangVe),
    FOREIGN KEY (MaChuyenBay) REFERENCES CHUYENBAY(MaChuyenBay) ON DELETE CASCADE,
    FOREIGN KEY (MaHangVe) REFERENCES HANGVE(MaHangVe) ON DELETE CASCADE
);

CREATE TABLE TRUNGGIAN (
    MaChuyenBay INT,
    MaSanBayTG INT,
    ThoiGianDung INT,
    ThuTuDung INT,
    GhiChu VARCHAR(255),
    PRIMARY KEY (MaChuyenBay, MaSanBayTG),
    FOREIGN KEY (MaChuyenBay) REFERENCES CHUYENBAY(MaChuyenBay) ON DELETE CASCADE,
    FOREIGN KEY (MaSanBayTG) REFERENCES SANBAY(MaSanBay) ON DELETE CASCADE
);

CREATE TABLE CT_DATVE (
    MaVe INT AUTO_INCREMENT PRIMARY KEY,
    MaDatVe INT,
    MaChuyenBay INT,
    MaHangVe INT,
    HoTenHK VARCHAR(255),
    CCCD VARCHAR(20),
    NgaySinh DATE,
    GioiTinh VARCHAR(10),
    DoiTuong VARCHAR(50),
    SoGhe VARCHAR(20),
    GiaVe DECIMAL(15,2),
    GiaHanhLy DECIMAL(15,2) DEFAULT 0,
    CanNangHanhLy INT DEFAULT 0,
    FOREIGN KEY (MaDatVe) REFERENCES DATVE(MaDatVe) ON DELETE CASCADE,
    FOREIGN KEY (MaChuyenBay) REFERENCES CHUYENBAY(MaChuyenBay) ON DELETE SET NULL,
    FOREIGN KEY (MaHangVe) REFERENCES HANGVE(MaHangVe) ON DELETE SET NULL
);

-- Thực hiện TRUNCATE tất cả các bảng
TRUNCATE TABLE CT_DATVE;
TRUNCATE TABLE TRUNGGIAN;
TRUNCATE TABLE CT_CHUYENBAY;
TRUNCATE TABLE THANHTOAN;
TRUNCATE TABLE DATVE;
TRUNCATE TABLE CHUYENBAY;
TRUNCATE TABLE MAYBAY;
TRUNCATE TABLE PHUONGTHUCTHANHTOAN;
TRUNCATE TABLE KHUYENMAI;
TRUNCATE TABLE HANGVE;
TRUNCATE TABLE HANGHANGKHONG;
TRUNCATE TABLE SANBAY;
TRUNCATE TABLE NGUOIDUNG;
*/

-- 1. Thêm dữ liệu SANBAY (Airports)
INSERT INTO SANBAY (MaIATA, TenSanBay, ThanhPho, QuocGia) VALUES
('SGN', 'Sân bay quốc tế Tân Sơn Nhất', 'Hồ Chí Minh', 'Việt Nam'),
('HAN', 'Sân bay quốc tế Nội Bài', 'Hà Nội', 'Việt Nam'),
('DAD', 'Sân bay quốc tế Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
('CXR', 'Sân bay quốc tế Cam Ranh', 'Nha Trang', 'Việt Nam'),
('PQC', 'Sân bay quốc tế Phú Quốc', 'Phú Quốc', 'Việt Nam'),
('VCA', 'Sân bay quốc tế Cần Thơ', 'Cần Thơ', 'Việt Nam'),
('HPH', 'Sân bay quốc tế Cát Bi', 'Hải Phòng', 'Việt Nam'),
('VII', 'Sân bay quốc tế Vinh', 'Vinh', 'Việt Nam'),
('DLI', 'Sân bay Liên Khương', 'Đà Lạt', 'Việt Nam'),
('UIH', 'Sân bay Phù Cát', 'Quy Nhơn', 'Việt Nam'),
('SIN', 'Sân bay quốc tế Changi', 'Singapore', 'Singapore'),
('BKK', 'Sân bay quốc tế Suvarnabhumi', 'Bangkok', 'Thái Lan'),
('ICN', 'Sân bay quốc tế Incheon', 'Seoul', 'Hàn Quốc'),
('NRT', 'Sân bay quốc tế Narita', 'Tokyo', 'Nhật Bản'),
('LHR', 'Sân bay London Heathrow', 'London', 'Vương quốc Anh');

-- 2. Thêm dữ liệu HANGHANGKHONG (Airlines)
INSERT INTO HANGHANGKHONG (TenHang, LogoURL , MaIATA) VALUES
('Vietnam Airlines', 'https://example.com/logos/vn.png', 'VN'),
('VietJet Air', 'https://example.com/logos/vj.png', 'VJ'),
('Bamboo Airways', 'https://example.com/logos/qh.png', 'QH'),
('Vietravel Airlines', 'https://example.com/logos/vu.png', 'VU'),
('Singapore Airlines', 'https://example.com/logos/sq.png', 'SQ'),
('Korean Air', 'https://example.com/logos/ke.png', 'KE'),
('Japan Airlines', 'https://example.com/logos/jl.png', 'JL');

-- 3. Thêm dữ liệu HANGVE (Ticket Classes)
INSERT INTO HANGVE (MaHangVe, TenHangVe, HeSoGia) VALUES
(1, 'Phổ thông (Economy)', 1.00),
(2, 'Phổ thông đặc biệt (Premium Economy)', 1.50),
(3, 'Thương gia (Business)', 3.00),
(4, 'Hạng nhất (First Class)', 5.00);

-- 4. Thêm dữ liệu KHUYENMAI (Promotions)
INSERT INTO KHUYENMAI (code, TenChuongTrinh, MoTaTenChuongTrinh ,PhanTramGiam, SoTienGiamToiDa, NgayBatDau, NgayKetThuc, SoLuongConLai, UrlImage) VALUES
('SUMMER2026', 'Chào Hè Rực Rỡ', 'Giảm giá cực sốc cho các chuyến bay mùa hè. Tận hưởng kỳ nghỉ tuyệt vời bên bãi biển xanh mát.', 10.00, 500000.00, '2026-06-01', '2026-08-31', 1000, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'),
('TET2027', 'Đón Tết Quê Hương', 'Ưu đãi đặt vé bay sớm dịp Tết Nguyên Đán 2027. Sum vầy bên gia đình với chi phí tiết kiệm nhất.', 15.00, 1000000.00, '2026-11-01', '2027-01-20', 500, 'https://images.pexels.com/photos/35647276/pexels-photo-35647276.jpeg'),
('FLASH50', 'Flash Sale Cuối Tuần', 'Khuyến mãi chớp nhoáng 50% vào cuối tuần. Săn vé ngay kẻo lỡ - số lượng cực kỳ có hạn!', 50.00, 200000.00, '2026-04-10', '2026-04-12', 200, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'),
('WELCOME', 'Chào Bạn Mới', 'Ưu đãi dành riêng cho khách hàng lần đầu đặt vé tại FlyViet. Trải nghiệm dịch vụ đẳng cấp 5 sao.', 5.00, 150000.00, '2026-01-01', '2026-12-31', 5000, 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80'),
('AUTUMN26', 'Thu Quyến Rũ', 'Tận hưởng mùa thu vàng lãng mạn với ưu đãi vé máy bay siêu rẻ cho các hành trình quốc tế.', 20.00, 800000.00, '2026-09-01', '2026-11-30', 300, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'),
('WINTER2026', 'Đông Ấm Áp', 'Khuyến mãi mùa đông cho các chuyến bay cuối năm. Cùng gia đình tận hưởng kỳ nghỉ ấm áp giữa tiết trời se lạnh.', 12.00, 600000.00, '2026-12-01', '2027-02-15', 400, 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80');

-- 5. Thêm dữ liệu PHUONGTHUCTHANHTOAN (Payment Methods)
INSERT INTO PHUONGTHUCTHANHTOAN (MaPTTT, TenPTTT) VALUES
(1, 'Thẻ tín dụng / Ghi nợ (Visa/Mastercard)'),
(2, 'Ví MoMo'),
(3, 'ZaloPay'),
(4, 'VNPay'),
(5, 'Chuyển khoản ngân hàng'),
(6, 'Thanh toán tiền mặt tại phòng vé');

-- 6. Thêm dữ liệu MAYBAY (Airplanes)
INSERT INTO MAYBAY (MaHangHK, TenMayBay, TongSoGhe) VALUES
(1, 'Boeing 787-9 Dreamliner', 274),
(1, 'Airbus A350-900', 305),
(1, 'Airbus A321neo', 203),
(2, 'Airbus A320', 180),
(2, 'Airbus A321', 230),
(3, 'Boeing 787-9 Dreamliner', 294),
(3, 'Airbus A321neo', 198),
(5, 'Airbus A380', 471),
(6, 'Boeing 777-300ER', 291),
(7, 'Boeing 787-8', 186);

-- 7. Thêm dữ liệu CHUYENBAY (Flights)
INSERT INTO CHUYENBAY (MaHangHK, MaMayBay, MaSanBayDi, MaSanBayDen, NgayGioKhoiHanh, NgayGioHaCanh, ThoiGianBay, TrangThai) VALUES
-- SGN (1) đi HAN (2)
(1, 1, 1, 2, '2026-04-10 08:00:00', '2026-04-10 10:15:00', 135, 'Đã lên lịch'),
(2, 4, 1, 2, '2026-04-10 09:30:00', '2026-04-10 11:40:00', 130, 'Đã lên lịch'),
(3, 7, 1, 2, '2026-04-10 15:00:00', '2026-04-10 17:10:00', 130, 'Đã lên lịch'),
-- HAN (2) đi DAD (3)
(1, 3, 2, 3, '2026-04-11 07:30:00', '2026-04-11 08:50:00', 80, 'Đã lên lịch'),
(2, 5, 2, 3, '2026-04-11 14:00:00', '2026-04-11 15:20:00', 80, 'Đã lên lịch'),
-- SGN (1) đi PQC (5)
(1, 3, 1, 5, '2026-04-12 10:00:00', '2026-04-12 11:00:00', 60, 'Đã lên lịch'),
(2, 4, 1, 5, '2026-04-12 16:30:00', '2026-04-12 17:35:00', 65, 'Đã lên lịch'),
-- Quốc tế: SGN (1) đi NRT (14)
(1, 1, 1, 14, '2026-04-15 23:30:00', '2026-04-16 07:30:00', 360, 'Đã lên lịch'),
(7, 10, 1, 14, '2026-04-16 00:05:00', '2026-04-16 08:00:00', 355, 'Đã lên lịch'),
-- Quốc tế: HAN (2) đi ICN (13)
(1, 2, 2, 13, '2026-04-20 23:45:00', '2026-04-21 06:00:00', 255, 'Đã lên lịch'),
(6, 9, 2, 13, '2026-04-20 22:50:00', '2026-04-21 05:10:00', 260, 'Đã lên lịch'),
-- Quốc tế: SGN (1) đi SIN (11)
(5, 8, 1, 11, '2026-04-25 15:30:00', '2026-04-25 18:30:00', 120, 'Đã lên lịch'),
(1, 3, 1, 11, '2026-04-25 09:00:00', '2026-04-25 12:05:00', 125, 'Đã lên lịch');

-- 8. Thêm dữ liệu CT_CHUYENBAY (Flight Details - Ticket Classes Availability & Price)
-- Mặc định thêm các hạng vé cho từng chuyến bay
INSERT INTO CT_CHUYENBAY (MaChuyenBay, MaHangVe, SoLuongCho, SoLuongConLai, GiaCoBan) VALUES
-- Chuyến 1 (SGN-HAN, Boeing 787)
(1, 1, 200, 150, 1500000.00),
(1, 2, 46, 40, 1500000.00),
(1, 3, 28, 15, 1500000.00),
-- Chuyến 2 (SGN-HAN, A320)
(2, 1, 180, 120, 1200000.00),
-- Chuyến 3 (SGN-HAN, Bamboo)
(3, 1, 150, 100, 1400000.00),
(3, 3, 48, 20, 1400000.00),
-- Chuyến 4 (HAN-DAD)
(4, 1, 180, 150, 1000000.00),
(4, 3, 23, 23, 1000000.00),
-- Chuyến 8 (SGN-NRT)
(8, 1, 200, 180, 8500000.00),
(8, 2, 46, 40, 8500000.00),
(8, 3, 28, 10, 8500000.00),
-- Chuyến 10 (HAN-ICN)
(10, 1, 250, 200, 6000000.00),
(10, 3, 55, 30, 6000000.00);