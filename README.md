# AuctionProject

Ứng dụng đấu giá trực tuyến với backend Spring Boot và frontend React.

## Cấu trúc dự án

AuctionProject/
├─ backend-spring/ # Backend Spring Boot
├─ frontend-react/ # Frontend React


## Cấu hình backend

Mở file `backend-spring/src/main/resources/application.properties` và chỉnh sửa thông tin kết nối SQL Server:

```
spring.datasource.username=hoai 
spring.datasource.password=123
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=AuctionDB
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
```

## Chạy backend

Mở terminal, cd vào thư mục backend-spring:
```
cd backend-spring
mvn spring-boot:run
```
Backend sẽ chạy trên: http://localhost:8080
```
cd frontend-react
npm install
npm run dev
```
Frontend sẽ chạy mặc định trên: http://localhost:8081 (hoặc vite tự cài)
