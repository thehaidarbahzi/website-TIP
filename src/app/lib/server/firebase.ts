import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const g = global as unknown as {
  __firebaseAdminInitialized?: boolean;
  __mockDb?: any;
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

  if (!projectId || !clientEmail || !privateKey || !databaseURL) {
    console.warn("⚠️ Missing Firebase Environment Variables. Mock mode might be used if implemented.");
    return;
  }

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

if (!g.__mockDb) {
  g.__mockDb = {
    users: {},
    peserta: {},
    event: {}
  };
  try {
    const fs = require('fs');
    const path = require('path');
    const eJsonPath = path.join(process.cwd(), 'e.json');
    if (fs.existsSync(eJsonPath)) {
      const content = fs.readFileSync(eJsonPath, 'utf-8');
      Object.assign(g.__mockDb, JSON.parse(content));
    }
  } catch (e) {
    // ignore
  }
}

function createMockRef(path: string): any {
  return {
    key: `mock-key-${Date.now()}`,
    once: async () => {
      const parts = path.split('/').filter(Boolean);
      let curr = g.__mockDb;
      for (const p of parts) {
         if (curr) curr = curr[p];
      }
      return { val: () => curr || null };
    },
    get: async () => {
      const parts = path.split('/').filter(Boolean);
      let curr = g.__mockDb;
      for (const p of parts) {
         if (curr) curr = curr[p];
      }
      return { val: () => curr || null };
    },
    push: () => {
       const newId = `mock-id-${Date.now()}`;
       return createMockRef(path + '/' + newId);
    },
    set: async (value: any) => {
      const parts = path.split('/').filter(Boolean);
      let curr = g.__mockDb;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!curr[parts[i]]) curr[parts[i]] = {};
        curr = curr[parts[i]];
      }
      if (parts.length > 0) {
        curr[parts[parts.length - 1]] = value;
      }
    },
    update: async (value: any) => {
      const parts = path.split('/').filter(Boolean);
      let curr = g.__mockDb;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!curr[parts[i]]) curr[parts[i]] = {};
        curr = curr[parts[i]];
      }
      if (parts.length > 0) {
        if (!curr[parts[parts.length - 1]]) curr[parts[parts.length - 1]] = {};
        Object.assign(curr[parts[parts.length - 1]], value);
      }
    },
    remove: async () => {
      const parts = path.split('/').filter(Boolean);
      let curr = g.__mockDb;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!curr[parts[i]]) curr[parts[i]] = {};
        curr = curr[parts[i]];
      }
      if (parts.length > 0) {
        delete curr[parts[parts.length - 1]];
      }
    },
    child: (childPath: string) => {
      return createMockRef(path + '/' + childPath);
    }
  };
}

export function getFirebaseAdminApp() {
  initFirebaseAdmin();
  if (!g.__firebaseAdminInitialized) return null as any;
  return getApps()[0];
}

export function getFirebaseAdminDb() {
  initFirebaseAdmin();
  if (!g.__firebaseAdminInitialized) {
    return {
      ref: (path: string) => createMockRef(path)
    } as any;
  }
  return getDatabase();
}
