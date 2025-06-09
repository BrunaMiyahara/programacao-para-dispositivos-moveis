import app from "./app.js";
import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Servidor rodando em ${process.env.FRONTEND_URL}:${process.env.PORT || 3000}`);
});
