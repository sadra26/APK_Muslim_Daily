1. for running : npx react-native run-android.

2. for cleaning the build system : 
   PS -> ./gradlew.bat clean 
   CMD -> gradlew clean

## Backend + XAMPP

1. Jalankan Apache dan MySQL dari XAMPP.
2. Buka phpMyAdmin, lalu import file `backend/schema.sql`.
3. Copy `backend/.env.example` menjadi `backend/.env`.
4. Jalankan backend:

   ```bash
   npm run backend
   ```

5. Jalankan Metro dan app Android:

   ```bash
   npm start
   npx react-native run-android
   ```

Default API mobile memakai `http://10.0.2.2:3000`, yaitu alamat localhost komputer host dari Android emulator. Untuk HP fisik, ubah `API_BASE_URL` di `src/services/api.js` ke IP laptop.

Akun demo setelah import schema:

- Email: `admin@mail.com`
- Password: `123456`
