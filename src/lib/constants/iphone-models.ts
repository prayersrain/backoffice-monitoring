/**
 * SUPER DICTIONARY iPHONE (V2.0 - APRIL 2026)
 * Mencakup iPhone 11, 12, 13, 14, 15, dan 16.
 */

export interface iPhoneSpec {
  model: string;
  color: string;
  storage: string;
}

export const IPHONE_DICTIONARY: Record<string, iPhoneSpec> = {
  // --- iPHONE 16 SERIES (NEWEST) ---
  // 16 Pro Max
  "MYW73": { model: "iPhone 16 Pro Max", color: "Black Titanium", storage: "256GB" },
  "MYW83": { model: "iPhone 16 Pro Max", color: "White Titanium", storage: "256GB" },
  "MYW93": { model: "iPhone 16 Pro Max", color: "Natural Titanium", storage: "256GB" },
  "MYWA3": { model: "iPhone 16 Pro Max", color: "Desert Titanium", storage: "256GB" },
  "MYWC3": { model: "iPhone 16 Pro Max", color: "Black Titanium", storage: "512GB" },
  "MYWD3": { model: "iPhone 16 Pro Max", color: "White Titanium", storage: "512GB" },
  "MYWE3": { model: "iPhone 16 Pro Max", color: "Natural Titanium", storage: "512GB" },
  "MYWF3": { model: "iPhone 16 Pro Max", color: "Desert Titanium", storage: "512GB" },
  "195949805066": { model: "iPhone 16 Pro Max", color: "Black Titanium", storage: "256GB" },
  "195949805189": { model: "iPhone 16 Pro Max", color: "White Titanium", storage: "256GB" },
  "195949805301": { model: "iPhone 16 Pro Max", color: "Natural Titanium", storage: "256GB" },
  "195949805424": { model: "iPhone 16 Pro Max", color: "Desert Titanium", storage: "256GB" },

  // 16 Pro
  "MYX73": { model: "iPhone 16 Pro", color: "Black Titanium", storage: "128GB" },
  "MYX83": { model: "iPhone 16 Pro", color: "White Titanium", storage: "128GB" },
  "MYX93": { model: "iPhone 16 Pro", color: "Natural Titanium", storage: "128GB" },
  "MYXA3": { model: "iPhone 16 Pro", color: "Desert Titanium", storage: "128GB" },

  // 16 Standard
  "MYY73": { model: "iPhone 16", color: "Black", storage: "128GB" },
  "MYY83": { model: "iPhone 16", color: "White", storage: "128GB" },
  "MYY93": { model: "iPhone 16", color: "Pink", storage: "128GB" },
  "MYYA3": { model: "iPhone 16", color: "Teal", storage: "128GB" },
  "MYYB3": { model: "iPhone 16", color: "Ultramarine", storage: "128GB" },

  // --- iPHONE 15 SERIES ---
  "MU773": { model: "iPhone 15 Pro Max", color: "Black Titanium", storage: "256GB" },
  "MU783": { model: "iPhone 15 Pro Max", color: "White Titanium", storage: "256GB" },
  "MU793": { model: "iPhone 15 Pro Max", color: "Blue Titanium", storage: "256GB" },
  "MU7A3": { model: "iPhone 15 Pro Max", color: "Natural Titanium", storage: "256GB" },
  "195949048388": { model: "iPhone 15 Pro Max", color: "Natural Titanium", storage: "256GB" },
  "195949048142": { model: "iPhone 15 Pro Max", color: "Blue Titanium", storage: "256GB" },
  "195949048265": { model: "iPhone 15 Pro Max", color: "White Titanium", storage: "256GB" },
  "195949048029": { model: "iPhone 15 Pro Max", color: "Black Titanium", storage: "256GB" },
  
  "MTUV3": { model: "iPhone 15 Pro", color: "Black Titanium", storage: "128GB" },
  "MTUW3": { model: "iPhone 15 Pro", color: "White Titanium", storage: "128GB" },
  "MTUX3": { model: "iPhone 15 Pro", color: "Blue Titanium", storage: "128GB" },
  "MTUY3": { model: "iPhone 15 Pro", color: "Natural Titanium", storage: "128GB" },
  
  "MTP03": { model: "iPhone 15", color: "Black", storage: "128GB" },
  "MTP43": { model: "iPhone 15", color: "Pink", storage: "128GB" },
  "MTP13": { model: "iPhone 15", color: "Blue", storage: "128GB" },
  "MTP23": { model: "iPhone 15", color: "Green", storage: "128GB" },
  "MTP33": { model: "iPhone 15", color: "Yellow", storage: "128GB" },

  // --- iPHONE 14 SERIES ---
  "MQ9P3": { model: "iPhone 14 Pro Max", color: "Space Black", storage: "128GB" },
  "MQ9Q3": { model: "iPhone 14 Pro Max", color: "Silver", storage: "128GB" },
  "MQ9R3": { model: "iPhone 14 Pro Max", color: "Gold", storage: "128GB" },
  "MQ9T3": { model: "iPhone 14 Pro Max", color: "Deep Purple", storage: "128GB" },
  "194253408130": { model: "iPhone 14", color: "Midnight", storage: "128GB" },
  "MPUF3": { model: "iPhone 14", color: "Midnight", storage: "128GB" },
  "MPUR3": { model: "iPhone 14", color: "Starlight", storage: "128GB" },
  "MPV03": { model: "iPhone 14", color: "Purple", storage: "128GB" },
  "MPV63": { model: "iPhone 14", color: "Red", storage: "128GB" },
  "MPVG3": { model: "iPhone 14", color: "Blue", storage: "128GB" },

  // --- iPHONE 13 SERIES ---
  "MLV93": { model: "iPhone 13 Pro", color: "Graphite", storage: "128GB" },
  "MLVA3": { model: "iPhone 13 Pro", color: "Silver", storage: "128GB" },
  "MLVC3": { model: "iPhone 13 Pro", color: "Gold", storage: "128GB" },
  "MLVD3": { model: "iPhone 13 Pro", color: "Sierra Blue", storage: "128GB" },
  "MLPF3": { model: "iPhone 13", color: "Midnight", storage: "128GB" },
  "MLPG3": { model: "iPhone 13", color: "Starlight", storage: "128GB" },
  "MLPH3": { model: "iPhone 13", color: "Blue", storage: "128GB" },
  "MLPJ3": { model: "iPhone 13", color: "Pink", storage: "128GB" },
  "MLKD3": { model: "iPhone 13 mini", color: "Midnight", storage: "128GB" },

  // --- iPHONE 12 SERIES ---
  "MGJ53": { model: "iPhone 12", color: "Black", storage: "64GB" },
  "MGJ63": { model: "iPhone 12", color: "White", storage: "64GB" },
  "MGJ73": { model: "iPhone 12", color: "Red", storage: "64GB" },
  "MGJ83": { model: "iPhone 12", color: "Green", storage: "64GB" },
  "MGJ93": { model: "iPhone 12", color: "Blue", storage: "64GB" },
  "MGD73": { model: "iPhone 12 Pro Max", color: "Graphite", storage: "128GB" },

  // --- iPHONE 11 SERIES ---
  "MWL72": { model: "iPhone 11", color: "Black", storage: "64GB" },
  "MWL82": { model: "iPhone 11", color: "White", storage: "64GB" },
  "MWL92": { model: "iPhone 11", color: "Red", storage: "64GB" },
  "MWLA2": { model: "iPhone 11", color: "Yellow", storage: "64GB" },
  "MWLC2": { model: "iPhone 11", color: "Green", storage: "64GB" },
  "MWLD2": { model: "iPhone 11", color: "Purple", storage: "64GB" },
};

/**
 * Mencari spesifikasi berdasarkan teks scan (UPC atau MPN Prefix)
 */
export function getSpecsByScannedText(text: string): iPhoneSpec | null {
  if (!text) return null;
  const cleanText = text.replace(/\s/g, '');

  // 1. Cek UPC (12 digit angka)
  if (/^\d{12}$/.test(cleanText)) {
    return IPHONE_DICTIONARY[cleanText] || null;
  }

  // 2. Cek MPN Prefix (5 karakter pertama)
  // Bisa dari Data Matrix (ada 1P) atau scan barcode MPN murni
  const mpnMatch = cleanText.match(/1P([A-Z0-9]{5})/);
  const mpnPrefix = mpnMatch ? mpnMatch[1] : cleanText.substring(0, 5);
  
  return IPHONE_DICTIONARY[mpnPrefix] || null;
}

/**
 * Parser Data Matrix Apple (Jika ada)
 */
export function parseIPhoneQRCode(qrText: string) {
  const result: { imei?: string; mpn?: string; serial?: string } = {};
  const imeiMatch = qrText.match(/IMEI(\d{15})/) || qrText.match(/(\d{15})/);
  if (imeiMatch) result.imei = imeiMatch[1];
  
  const mpnMatch = qrText.match(/1P([A-Z0-9/]+)/);
  if (mpnMatch) result.mpn = mpnMatch[1].split(/[0-9][A-Z]/)[0];

  const serialMatch = qrText.match(/30S([A-Z0-9]+)/);
  if (serialMatch) result.serial = serialMatch[1].substring(0, 12);

  return result;
}
