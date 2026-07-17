"use server";

import { google, drive_v3 } from "googleapis";

type UploadResult =
  | {
      ok: true;
      fileId: string;
      url: string;
      fileName: string;
      fileSize: number;
      fileType: string;
    }
  | { ok: false; error: string };

const SHARED_DRIVE_ID =
  process.env.GOOGLE_SHARED_DRIVE_ID || "0AEaFBbi13uiRUk9PVA";

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL dan GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY belum diset.",
    );
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_");
}

async function getOrCreateFolder(
  drive: drive_v3.Drive,
  parentId: string,
  folderName: string,
): Promise<string> {
  const safeName = sanitizeName(folderName);

  const searchRes = await drive.files.list({
    q: `name='${safeName.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
    fields: "files(id, name)",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    corpora: "drive",
    driveId: SHARED_DRIVE_ID,
  });

  const existing = searchRes.data.files?.find((f) => f.name === safeName);
  if (existing?.id) return existing.id;

  const folderRes = await drive.files.create({
    requestBody: {
      name: safeName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
    supportsAllDrives: true,
  });

  return (folderRes as { data: { id?: string } }).data.id || parentId;
}

export async function uploadFile(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file");
    const teamName =
      (formData.get("teamName") as string | null)?.trim() || "unknown";
    const stage =
      (formData.get("stage") as string | null)?.trim() || "administrasi";

    if (!file || !(file instanceof File)) {
      return { ok: false, error: "File tidak ditemukan." };
    }

    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      console.warn("⚠️ Mocking file upload because Google Drive credentials are not set.");
      // Return a dummy successful upload result for local frontend testing
      return {
        ok: true,
        fileId: `mock-file-${Date.now()}`,
        url: `https://mock-url.com/${Date.now()}_${sanitizeName(file.name)}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || "application/octet-stream",
      };
    }

    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });

    const fileName = `${Date.now()}_${file.name}`;

    // Build nested folder path: Peserta -> {teamName} -> {stage}
    let folderId = SHARED_DRIVE_ID;
    try {
      const pesertaFolderId = await getOrCreateFolder(
        drive,
        SHARED_DRIVE_ID,
        "Peserta",
      );
      const teamFolderId = await getOrCreateFolder(
        drive,
        pesertaFolderId,
        teamName,
      );
      folderId = await getOrCreateFolder(drive, teamFolderId, stage);
    } catch (err) {
      console.error("Gagal membuat/mencari folder:", err);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const boundary = `-------${Date.now()}-${Math.random().toString(36).slice(2)}-------`;

    const metadata = { name: fileName, parents: [folderId] };

    const preamble = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
    const closing = `\r\n--${boundary}--`;

    const metadataBytes = Buffer.from(preamble, "utf-8");
    const closingBytes = Buffer.from(closing, "utf-8");
    const contentTypeBytes = Buffer.from(
      `\r\n--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`,
      "utf-8",
    );

    const multipartBody = Buffer.concat([
      metadataBytes,
      contentTypeBytes,
      fileBuffer,
      closingBytes,
    ]);

    const authClient = await auth.getClient();
    const token = await authClient.getAccessToken();
    const accessToken = typeof token === "string" ? token : token?.token || "";

    const uploadRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
      },
    );

    const uploadText = await uploadRes.text();

    if (!uploadRes.ok) {
      return {
        ok: false,
        error: `Drive upload failed: ${uploadRes.status} ${uploadText}`,
      };
    }

    let uploadJson: Record<string, unknown> = {};
    try {
      uploadJson = JSON.parse(uploadText);
    } catch {
      /* ignore */
    }

    const fileId: string = uploadJson?.id ? String(uploadJson.id) : "";

    let publicUrl = "";
    if (fileId) {
      try {
        const metaRes = await drive.files.get({
          fileId,
          fields: "webViewLink, webContentLink",
          supportsAllDrives: true,
        });
        publicUrl =
          metaRes.data.webViewLink || metaRes.data.webContentLink || "";
      } catch (metaErr) {
        console.error("Gagal mengambil metadata file:", metaErr);
      }
    }

    return {
      ok: true,
      fileId,
      url: publicUrl,
      fileName: uploadJson?.name ? String(uploadJson.name) : file.name,
      fileSize: Number(uploadJson?.size ?? file.size),
      fileType: uploadJson?.mimeType ? String(uploadJson.mimeType) : file.type,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal upload ke Google Drive.";
    console.error("[UPLOAD ERROR]", err);
    return { ok: false, error: message };
  }
}
