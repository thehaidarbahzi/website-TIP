"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export function FileDropUpload({
  label,
  accept,
  maxSizeMB,
  onUpload,
  teamName,
  stage = "penyisihan",
}: {
  label: string;
  accept: string;
  maxSizeMB: number;
  onUpload: (result: {
    fileName: string;
    fileSize: number;
    fileType: string;
    fileId: string;
    webViewLink: string;
  }) => void;
  teamName: string;
  stage?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ fileName: string } | null>(null);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File terlalu besar (maks ${maxSizeMB}MB)`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("teamName", teamName);
      fd.set("stage", stage);

      const { uploadFile } = await import("@/app/lib/action/upload");
      const res = await uploadFile(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone({ fileName: res.fileName });
      onUpload({
        fileName: res.fileName,
        fileSize: res.fileSize,
        fileType: res.fileType,
        fileId: res.fileId,
        webViewLink: res.url,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-bold text-white mb-2 block drop-shadow-sm">
        {label} <span className="text-red-500">*</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-white/30 bg-white/5 rounded-[1.2rem] p-8 text-center hover:bg-white/10 transition-colors cursor-pointer group shadow-sm backdrop-blur-sm"
      >
        {loading ? (
          <div className="w-14 h-14 bg-white/20 text-white border border-white/30 rounded-[1rem] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <svg className="animate-spin size-7" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : done ? (
          <div className="w-14 h-14 bg-green-500/20 text-green-300 border border-green-400/30 rounded-[1rem] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UploadCloud size={28} />
          </div>
        ) : (
          <div className="w-14 h-14 bg-white/20 text-white border border-white/30 rounded-[1rem] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-inner">
            <UploadCloud size={28} />
          </div>
        )}
        <p className="text-sm font-bold text-white">
          {done ? done.fileName : loading ? "Mengupload..." : label}
        </p>
        <p className="text-xs text-white/70 mt-1">
          Maks. {maxSizeMB}MB ({accept})
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          disabled={loading}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
