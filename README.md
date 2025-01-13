# Backend - K Learn Pro

Phân hệ backend của K Learn Pro được xây dựng bằng ExpressJS, sử dụng MongoDB làm cơ sở dữ liệu và Firebase Storage để quản lý tài liệu. Hướng dẫn này cung cấp các bước cài đặt và khởi động backend.

## Yêu cầu hệ thống
- **Node.js** >= 16.x
- **ExpressJS CLI**: Cài đặt bằng lệnh: `npm install express`
- **MongoDB**: [Hướng dẫn cài đặt MongoDB](https://www.mongodb.com/docs/manual/installation/)
- **Firebase CLI** (nếu sử dụng Firebase Storage): [Hướng dẫn cài đặt Firebase CLI](https://firebase.google.com/docs/cli)

## Cài đặt backend

### Bước 1: Clone dự án từ GitHub

```bash
git clone https://github.com/khanh0411/els-learning-be.git
cd e-learning/backend
```

### Bước 2: Cài đặt các thư viện

Chạy lệnh sau để cài đặt toàn bộ các thư viện cần thiết:

```bash
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo tệp `.env` trong thư mục `backend` và cấu hình các biến môi trường:

```env
PORT = 0411
YOUR_JWT_SECRET = ""

MONGODB_URI = ""
```

### Bước 4: Khởi động backend

Chạy lệnh sau để khởi động backend:

```bash
npm start
```

Backend sẽ hoạt động tại [http://localhost:0411](http://localhost:0411).

## Các API endpoint

API backend có các endpoint như sau:

- **Auth**:
  - `POST /auth/login`: Đăng nhập
  - `POST /auth/register`: Đăng ký
- **Courses**:
  - `GET /courses`: Lấy danh sách khoá học
  - `POST /courses`: Tạo mới khoá học
- **Lessons**:
  - `GET /lessons/:id`: Lấy thông tin bài học
  - `POST /lessons`: Tạo bài học

## Thông tin bổ sung

- **Framework**: ExpressJS
- **Database**: MongoDB
- **Lưu trữ**: Firebase Storage
- **Công cụ**: JWT, Passport.js

Hãy liên hệ nếu bạn có thêm thắc mắc hoặc gặp lỗi trong quá trình cài đặt.