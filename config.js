/*
 * Neura — Spehere by Ryzxell ✦
 * WhatsApp Channel: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub Repository: https://github.com/Shouya28
 * WhatsApp Contact: https://wa.me/6283138902543
 * 
 * Greetings! This is my watermark. Please refrain from removing it.
 * Thank you for your understanding and cooperation.
 */
 
import { watchFile, unwatchFile } from "fs";
import chalk from "chalk";
import { fileURLToPath } from "url";

// ==============================
// KONFIGURASI IDENTITAS 
// ==============================
global.owner = [
  ["62895324429899", "Ryzxell", true] // [nomor, nama, status admin]
];
global.systemContacts = {
  pairingNumber: "6283148375193", // [isi dengan nomor WhatsApp bot kamu]
  pairingAuth: true, // [jika false akan tautkan menggunakan qr code]
};

// ========================
// KONFIGURASI STICKER 
// ========================
global.stickerMetadata = {
  packName: "Neura Spehere",
  author: "Powered by Ryzxell"
};

// ========================
// SISTEM NOTIFIKASI
// ========================
global.systemMessages = {
  processing: "Processing your request...",
  error: "_The server is busy. Please try again later._",
  success: "✓ Operation completed successfully"
};

// ========================
// RESPON INTERAKTIF
// ========================
global.msg = {
  privilege: {
    owner: "🚫 *Authorization Required* | This feature is restricted to bot owners only",
    admin: "🔑 *Privilege Restriction* | Administrator access required",
    botAdmin: "🤖 *Permission Needed* | Bot requires administrator privileges"
  },
  accessControl: {
    group: "👥 *Group Context Required* | This command is only available in group chats",
    private: "🔒 *Privacy Restriction* | Please use this feature in direct messages",
    premium: "💎 *Premium Feature* | Upgrade your account with .buyprem command"
  },
  systemStatus: {
    rpg: "🎮 *System Alert* | RPG module is currently disabled in this group",
    game: "🕹 *System Alert* | Gaming features are suspended in this group",
    limitExp: "📉 *Resource Limit* | Daily quota exhausted. Type .buy limit or wait for reset"
  },
  userManagement: {
    unreg: `📋 Registration Required | 
    Usage: .register [name].[age].[gender]
    Example: .register Neura.18.female
    
    For automatic verification: @verify`
  }
};

// ========================
// MANAJEMEN ASET
// ========================
global.assetUrls = {
  accessDenied: "https://files.catbox.moe/frlknp.jpg",
  thumb: [
    "https://files.catbox.moe/ctv3p3.jpg"
  ]
};

// ========================
// SISTEM AUTO-RELOAD
// ========================
const configPath = fileURLToPath(import.meta.url);
watchFile(configPath, () => {
  unwatchFile(configPath);
  console.log(chalk.hex("#2ecc71")(`[ SYSTEM ] Configuration updated at ${new Date().toLocaleTimeString()}`));
  import(`${configPath}?update=${Date.now()}`);
});