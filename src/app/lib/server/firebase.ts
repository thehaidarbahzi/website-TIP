import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const g = global as unknown as {
  __firebaseAdminInitialized?: boolean;
};

function initFirebaseAdmin() {
  if (g.__firebaseAdminInitialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;

  console.log(
    "[FIREBASE ADMIN] projectId present:",
    !!projectId,
    "clientEmail present:",
    !!clientEmail,
    "privateKey present:",
    !!privateKey,
    "databaseURL present:",
    !!databaseURL,
  );

  if (!projectId) throw new Error("Missing FIREBASE_PROJECT_ID");
  if (!clientEmail) throw new Error("Missing FIREBASE_CLIENT_EMAIL");
  if (!privateKey) throw new Error("Missing FIREBASE_PRIVATE_KEY");
  if (!databaseURL) throw new Error("Missing FIREBASE_DATABASE_URL");

  const pk = privateKey.replace(/\\n/g, "\n");

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: pk,
      }),
      databaseURL,
    });
  }

  g.__firebaseAdminInitialized = true;
}

export function getFirebaseAdminApp() {
  initFirebaseAdmin();
  return getApps()[0];
}

export function getFirebaseAdminDb() {
  initFirebaseAdmin();
  return getDatabase();
}
