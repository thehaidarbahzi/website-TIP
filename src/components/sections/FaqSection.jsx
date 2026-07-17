import Link from "next/link";
import "./FaqSection.css";

const questions = [
  "Bagaimana cara pembayaran dan bagaimana proses konfirmasinya?",
  "Adakah grup WhatsApp resmi untuk peserta?",
  "Apakah technical meeting wajib diikuti oleh seluruh peserta?",
  "Technical meeting dilaksanakan kapan dan melalui platform apa (online/offline)?",
  "Melalui media apa pengumuman finalis/pemenang akan disampaikan?",
  "Apakah seluruh peserta (tidak hanya pemenang) akan mendapatkan e-sertifikat?",
  "Bagaimana jika belum mendapat balasan/konfirmasi dari panitia setelah menghubungi CP?",
  "Apakah ada kemungkinan perpanjangan batas waktu pengumpulan karya?",
  "Apakah pendaftaran dilakukan per individu atau per tim?",
  "Apakah biaya pendaftaran sudah termasuk konsumsi?",
  "Apakah keputusan juri bisa diganggu gugat atau banding?",
  "Apakah wajib menggunakan referensi atau sumber tertentu?",
  "Apakah boleh menggunakan bantuan AI dalam pembuatan karya?",
  "Apakah nilai atau skor dari juri akan diberitahukan ke peserta?",
  "Jika nilai peserta seri, bagaimana penentuan pemenangnya?",
  "Bagaimana jika nama pada sertifikat salah ketik atau typo?",
  "Apakah pemenang akan dipublikasikan secara resmi?",
  "Siapa yang bisa dihubungi jika ada kendala administrasi?",
  "Bagaimana jika peserta salah mengunggah dokumen pendaftaran?",
  "Bagaimana teknis pelaksanaan hari final secara offline?",
  "Apakah ada biaya tambahan untuk mengikuti acara final offline?",
  "Apakah biaya tambahan offline termasuk penginapan dan transportasi?",
  "Jika finalis tidak sanggup membayar biaya offline, apakah bisa ikut online?",
  "Bagaimana cara mengetahui update terbaru jika jadwal berubah mendadak?",
];

const previewQuestions = questions.slice(0, 4);

function ArrowIcon() {
  return (
    <svg
      className="faq-button__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuestionCard({ question }) {
  return (
    <article className="faq-card">
      <div className="faq-card__dashed-border">
        <p>{question}</p>
      </div>
    </article>
  );
}

export default function FaqSection() {
  function openWhatsApp() {
    const phoneNumber = "6281234567890";
    const message =
      "Halo Kak, saya ingin bertanya mengenai pelaksanaan lomba.";

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <header className="faq-header">
          <div className="faq-badge">
            <div className="faq-badge__dashed">
              Tanya Jawab
            </div>
          </div>

          <h2 className="faq-title">
            Cari Tahu Semua Pertanyaanmu!
          </h2>
        </header>

        {previewQuestions.length > 0 ? (
          <div className="faq-showcase">
            <div className="faq-showcase__column">
              <QuestionCard question={previewQuestions[0]} />
              <QuestionCard question={previewQuestions[1]} />
            </div>

            <div
              className="faq-showcase__center"
              aria-hidden="true"
            >
              {/* Ruang untuk maskot */}
            </div>

            <div className="faq-showcase__column">
              <QuestionCard question={previewQuestions[2]} />
              <QuestionCard question={previewQuestions[3]} />
            </div>
          </div>
        ) : null}

        <div className="faq-actions">
          <Link
            href="/faq"
            className="faq-button"
          >
            Lihat Semua
            <ArrowIcon />
          </Link>

          <button
            type="button"
            className="faq-button"
            onClick={openWhatsApp}
          >
            Kontak Kami
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
