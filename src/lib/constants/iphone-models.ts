/**
 * Kamus Part Number (MPN) iPhone
 * Menggunakan sistem Prefix (5 karakter pertama) agar kompatibel dengan semua region (ID/A, LL/A, ZP/A, dll)
 */

export interface iPhoneSpec {
  model: string;
  color: string;
  storage: string;
}

export const IPHONE_DICTIONARY: Record<string, iPhoneSpec> = {
  // iPhone 15 Pro Max
  "MU773": { model: "iPhone 15 Pro Max", color: "Black Titanium", storage: "256GB" },
  "MU783": { model: "iPhone 15 Pro Max", color: "White Titanium", storage: "256GB" },
  "MU793": { model: "iPhone 15 Pro Max", color: "Blue Titanium", storage: "256GB" },
  "MU7A3": { model: "iPhone 15 Pro Max", color: "Natural Titanium", storage: "256GB" },
  "MU7C3": { model: "iPhone 15 Pro Max", color: "Black Titanium", storage: "512GB" },
  "MU7D3": { model: "iPhone 15 Pro Max", color: "White Titanium", storage: "512GB" },
  "MU7E3": { model: "iPhone 15 Pro Max", color: "Blue Titanium", storage: "512GB" },
  "MU7F3": { model: "iPhone 15 Pro Max", color: "Natural Titanium", storage: "512GB" },
  "MU7G3": { model: "iPhone 15 Pro Max", color: "Black Titanium", storage: "1TB" },
  "MU7H3": { model: "iPhone 15 Pro Max", color: "White Titanium", storage: "1TB" },
  "MU7J3": { model: "iPhone 15 Pro Max", color: "Blue Titanium", storage: "1TB" },
  "MU7K3": { model: "iPhone 15 Pro Max", color: "Natural Titanium", storage: "1TB" },

  // iPhone 15 Pro
  "MTUV3": { model: "iPhone 15 Pro", color: "Black Titanium", storage: "128GB" },
  "MTUW3": { model: "iPhone 15 Pro", color: "White Titanium", storage: "128GB" },
  "MTUX3": { model: "iPhone 15 Pro", color: "Blue Titanium", storage: "128GB" },
  "MTUY3": { model: "iPhone 15 Pro", color: "Natural Titanium", storage: "128GB" },
  "MTV03": { model: "iPhone 15 Pro", color: "Black Titanium", storage: "256GB" },
  "MTV13": { model: "iPhone 15 Pro", color: "White Titanium", storage: "256GB" },
  "MTV23": { model: "iPhone 15 Pro", color: "Blue Titanium", storage: "256GB" },
  "MTV43": { model: "iPhone 15 Pro", color: "Natural Titanium", storage: "256GB" },

  // iPhone 15
  "MTP03": { model: "iPhone 15", color: "Black", storage: "128GB" },
  "MTP13": { model: "iPhone 15", color: "Blue", storage: "128GB" },
  "MTP23": { model: "iPhone 15", color: "Green", storage: "128GB" },
  "MTP33": { model: "iPhone 15", color: "Yellow", storage: "128GB" },
  "MTP43": { model: "iPhone 15", color: "Pink", storage: "128GB" },
  "MTP53": { model: "iPhone 15", color: "Black", storage: "256GB" },
  "MTP63": { model: "iPhone 15", color: "Blue", storage: "256GB" },
  "MTP73": { model: "iPhone 15", color: "Green", storage: "256GB" },
  "MTP83": { model: "iPhone 15", color: "Yellow", storage: "256GB" },
  "MTP93": { model: "iPhone 15", color: "Pink", storage: "256GB" },

  // iPhone 14 Pro Max
  "MQ9P3": { model: "iPhone 14 Pro Max", color: "Space Black", storage: "128GB" },
  "MQ9Q3": { model: "iPhone 14 Pro Max", color: "Silver", storage: "128GB" },
  "MQ9R3": { model: "iPhone 14 Pro Max", color: "Gold", storage: "128GB" },
  "MQ9T3": { model: "iPhone 14 Pro Max", color: "Deep Purple", storage: "128GB" },
  "MQ9U3": { model: "iPhone 14 Pro Max", color: "Space Black", storage: "256GB" },
  "MQ9V3": { model: "iPhone 14 Pro Max", color: "Silver", storage: "256GB" },
  "MQ9W3": { model: "iPhone 14 Pro Max", color: "Gold", storage: "256GB" },
  "MQ9X3": { model: "iPhone 14 Pro Max", color: "Deep Purple", storage: "256GB" },

  // iPhone 14 Pro
  "MPXT3": { model: "iPhone 14 Pro", color: "Space Black", storage: "128GB" },
  "MQ003": { model: "iPhone 14 Pro", color: "Silver", storage: "128GB" },
  "MQ063": { model: "iPhone 14 Pro", color: "Gold", storage: "128GB" },
  "MQ0E3": { model: "iPhone 14 Pro", color: "Deep Purple", storage: "128GB" },

  // iPhone 14
  "MPUF3": { model: "iPhone 14", color: "Midnight", storage: "128GB" },
  "MPUR3": { model: "iPhone 14", color: "Starlight", storage: "128GB" },
  "MPV03": { model: "iPhone 14", color: "Purple", storage: "128GB" },
  "MPV63": { model: "iPhone 14", color: "Red", storage: "128GB" },
  "MPVG3": { model: "iPhone 14", color: "Blue", storage: "128GB" },
  "MR3X3": { model: "iPhone 14", color: "Yellow", storage: "128GB" },

  // iPhone 13 Pro Max
  "MLL63": { model: "iPhone 13 Pro Max", color: "Graphite", storage: "128GB" },
  "MLL73": { model: "iPhone 13 Pro Max", color: "Silver", storage: "128GB" },
  "MLL83": { model: "iPhone 13 Pro Max", color: "Gold", storage: "128GB" },
  "MLL93": { model: "iPhone 13 Pro Max", color: "Sierra Blue", storage: "128GB" },
  "MNCP3": { model: "iPhone 13 Pro Max", color: "Alpine Green", storage: "128GB" },

  // iPhone 13 Pro
  "MLV93": { model: "iPhone 13 Pro", color: "Graphite", storage: "128GB" },
  "MLVA3": { model: "iPhone 13 Pro", color: "Silver", storage: "128GB" },
  "MLVC3": { model: "iPhone 13 Pro", color: "Gold", storage: "128GB" },
  "MLVD3": { model: "iPhone 13 Pro", color: "Sierra Blue", storage: "128GB" },
  "MNDT3": { model: "iPhone 13 Pro", color: "Alpine Green", storage: "128GB" },

  // iPhone 13
  "MLPF3": { model: "iPhone 13", color: "Midnight", storage: "128GB" },
  "MLPG3": { model: "iPhone 13", color: "Starlight", storage: "128GB" },
  "MLPH3": { model: "iPhone 13", color: "Blue", storage: "128GB" },
  "MLPJ3": { model: "iPhone 13", color: "Pink", storage: "128GB" },
  "MNGD3": { model: "iPhone 13", color: "Green", storage: "128GB" },

  // iPhone 13 mini
  "MLKD3": { model: "iPhone 13 mini", color: "Midnight", storage: "128GB" },
  "MLKE3": { model: "iPhone 13 mini", color: "Starlight", storage: "128GB" },
  "MLKF3": { model: "iPhone 13 mini", color: "Blue", storage: "128GB" },
  "MLKG3": { model: "iPhone 13 mini", color: "Pink", storage: "128GB" },
  "MNG93": { model: "iPhone 13 mini", color: "Green", storage: "128GB" },

  // iPhone 12 Pro Max
  "MGD73": { model: "iPhone 12 Pro Max", color: "Graphite", storage: "128GB" },
  "MGD83": { model: "iPhone 12 Pro Max", color: "Silver", storage: "128GB" },
  "MGD93": { model: "iPhone 12 Pro Max", color: "Gold", storage: "128GB" },
  "MGDA3": { model: "iPhone 12 Pro Max", color: "Pacific Blue", storage: "128GB" },

  // iPhone 12
  "MGJ53": { model: "iPhone 12", color: "Black", storage: "64GB" },
  "MGJ63": { model: "iPhone 12", color: "White", storage: "64GB" },
  "MGJ73": { model: "iPhone 12", color: "Red", storage: "64GB" },
  "MGJ83": { model: "iPhone 12", color: "Green", storage: "64GB" },
  "MGJ93": { model: "iPhone 12", color: "Blue", storage: "64GB" },
  "MJN13": { model: "iPhone 12", color: "Purple", storage: "64GB" },

  // iPhone 11
  "MWL72": { model: "iPhone 11", color: "Black", storage: "64GB" },
  "MWL82": { model: "iPhone 11", color: "White", storage: "64GB" },
  "MWL92": { model: "iPhone 11", color: "Red", storage: "64GB" },
  "MWLA2": { model: "iPhone 11", color: "Yellow", storage: "64GB" },
  "MWLC2": { model: "iPhone 11", color: "Green", storage: "64GB" },
  "MWLD2": { model: "iPhone 11", color: "Purple", storage: "64GB" },
};

/**
 * Fungsi untuk memecah data dari QR Code Box iPhone
 * Contoh isi QR: 30SGY70DFDQYN1PMLKD3ID/A1IMEI350424812509758
 */
export function parseIPhoneQRCode(qrText: string) {
  const result: { imei?: string; mpn?: string; serial?: string } = {};
  
  // Ambil IMEI (biasanya setelah kata IMEI atau 15 digit terakhir)
  const imeiMatch = qrText.match(/IMEI(\d{15})/);
  if (imeiMatch) result.imei = imeiMatch[1];
  
  // Ambil MPN (biasanya diawali 1P)
  const mpnMatch = qrText.match(/1P([A-Z0-9/]+)/);
  if (mpnMatch) {
    let fullMpn = mpnMatch[1];
    // Bersihkan karakter aneh di akhir jika ada (seperti Q, S, dll yang menempel)
    // MPN iPhone biasanya berakhir dengan /A atau /B atau angka sebelum karakter pemisah
    const cleanMpn = fullMpn.split(/[0-9][A-Z]/)[0];
    result.mpn = cleanMpn;
  }

  // Ambil Serial (diawali 30S)
  const serialMatch = qrText.match(/30S([A-Z0-9]+)/);
  if (serialMatch) {
    result.serial = serialMatch[1].substring(0, 12);
  }

  return result;
}

/**
 * Fungsi untuk mencari spesifikasi berdasarkan MPN (Part Number)
 * Mendukung pencarian berbasis Prefix 5 Karakter
 */
export function getSpecsByMPN(mpn: string): iPhoneSpec | null {
  if (!mpn) return null;
  
  // 1. Coba cari match persis (misal MLKD3ID/A)
  if (IPHONE_DICTIONARY[mpn]) return IPHONE_DICTIONARY[mpn];
  
  // 2. Coba cari berdasarkan prefix 5 karakter (misal MLKD3)
  const prefix = mpn.substring(0, 5);
  if (IPHONE_DICTIONARY[prefix]) return IPHONE_DICTIONARY[prefix];
  
  return null;
}
