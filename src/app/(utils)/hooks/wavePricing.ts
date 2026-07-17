export function getCurrentWaveInfo(category: string) {
  const now = Date.now();
  // Placeholder dates, change these accordingly!
  const earlyBirdEnd = new Date("2026-08-01T23:59:59Z").getTime();
  const gel1End = new Date("2026-08-15T23:59:59Z").getTime();

  let waveName = "";
  if (now <= earlyBirdEnd) waveName = "Early Bird";
  else if (now <= gel1End) waveName = "Gelombang 1";
  else waveName = "Gelombang 2";

  let price = 0;
  if (category === "lkti") {
    if (waveName === "Early Bird") price = 65000;
    else if (waveName === "Gelombang 1") price = 80000;
    else price = 90000;
  } else if (category === "essay") {
    if (waveName === "Early Bird") price = 55000;
    else if (waveName === "Gelombang 1") price = 70000;
    else price = 80000;
  } else if (category === "poster") {
    // Placeholder prices for poster
    if (waveName === "Early Bird") price = 45000;
    else if (waveName === "Gelombang 1") price = 55000;
    else price = 65000;
  }

  return {
    waveName,
    price,
    formattedPrice: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price),
    bankAccount: "BCA 1234567890 a.n. Panitia TxC", // Placeholder
  };
}
