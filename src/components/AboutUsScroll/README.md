# AboutUsScroll — Usage & Configuration

## Files created

- `public/about-us/frame-1.svg`
- `public/about-us/frame-2.svg`
- `public/about-us/frame-3.svg`
- `public/about-us/shared.svg`
- `src/components/AboutUsScroll/AboutUsScroll.jsx`
- `src/components/AboutUsScroll/AboutUsScroll.css`

Also renamed:
- `public/logo CT fIX DAN rESMI 1.png` → `public/logo-ct.png`

---

## Usage example

```tsx
// src/app/(pages)/tentang-kami/page.tsx
"use client";

import AboutUsScroll from "@/components/AboutUsScroll/AboutUsScroll";

export default function TentangKami() {
  return (
    <main>
      {/* previous sections */}

      <AboutUsScroll />

      {/* next sections */}
    </main>
  );
}
```

---

## Konfigurasi durasi scroll

Durasi scroll diatur oleh dua nilai di `AboutUsScroll.jsx`:

```js
end: "+=400%",
scrub: 0.8,
```

- `end: "+=400%"` menentukan total jarak scroll selama section dipin.
  - 400% = 4x tinggi viewport.
  - 100% untuk fase kosong, 100% untuk setiap frame.
- `scrub: 0.8` menentukan seberapa halus animasi mengikuti scroll.
  - 0.8 detik delay.
  - Nilai lebih rendah = lebih responsif, nilai lebih tinggi = lebih halus.

Jika ingin mempercepat atau memperlama:

```js
// Lebih cepat (total scroll 300%)
end: "+=300%",
scrub: 0.5,

// Lebih lambat (total scroll 500%)
end: "+=500%",
scrub: 1.2,
```

Posisi label dalam timeline (progress 0–1):

```js
tl.addLabel("empty", 0);     // 0.00 – 0.12
tl.addLabel("frame1", 0.12); // 0.12 – 0.20 (masuk), 0.20 – 0.38 (tetap)
tl.addLabel("frame2", 0.38); // 0.38 – 0.46 (keluar/masuk), 0.46 – 0.64 (tetap)
tl.addLabel("frame3", 0.64); // 0.64 – 0.72 (keluar/masuk), 0.72 – 0.94 (tetap)
```

Ubah angka label untuk menyesuaikan fase scroll.

---

## Konfigurasi breakpoint / responsive

Artboard diatur di `AboutUsScroll.css`:

```css
.about-us__artboard {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(100vw, calc(100svh * 1440 / 778));
  aspect-ratio: 1440 / 778;
  transform: translate(-50%, -50%);
}
```

- `width: min(100vw, calc(100svh * 1440 / 778))` memastikan artboard tidak melebihi viewport.
- `aspect-ratio: 1440 / 778` menjaga proporsi referensi.
- Background oranye (`#FD5102`) mengisi sisa viewport secara otomatis.

Jika ingin memaksa full-bleed pada desktop tertentu, tambahkan media query:

```css
@media (min-width: 1440px) and (min-height: 778px) {
  .about-us__artboard {
    width: 100vw;
    height: 100vh;
    aspect-ratio: auto;
    top: 0;
    left: 0;
    transform: none;
  }
}
```

---

## Catatan penting

- GSAP sudah terinstall (`gsap: ^3.15.0` di `package.json`).
- Jangan ubah path SVG di dalam `public/about-us/`. Komponen mengacu ke path tersebut.
- Shared shape (`shared.svg`) berisi background orange, stroke hitam, dan dashed border yang identik di semua frame. Jangan di-animate.
- Animasi hanya pada `.about-us__frame` (opacity, translateY, scale, blur).
- Untuk menambah/mengurangi frame, sesuaikan ref, timeline, dan jumlah `<div className="about-us__frame">`.
- Logo sudah diganti ke `/cropped-LOGO-LPKTA-1.png` (frame 2) dan `/logo-ct.png` (frame 3).

---

## Validasi visual

Setelah implementasi, buka halaman pada viewport **1440 x 778** dan bandingkan dengan referensi:

1. Background harus `#FD5102` penuh.
2. Shared shape (background path, stroke, dashed rect) harus statis.
3. Frame 1 muncul setelah scroll masuk section.
4. Transisi frame 1 → 2 → 3 harus halus.
5. Tidak ada horizontal overflow.
6. Tidak ada flash putih.
