/*
 * Neura — Spehere by Ryzxell ✦
 * WhatsApp Channel: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub Repository: https://github.com/Shouya28
 * WhatsApp Contact: https://wa.me/6283138902543
 * 
 * Greetings! This is my watermark. Please refrain from removing it.
 * Thank you for your understanding and cooperation.
 */

import fetch from "node-fetch";

// Konfigurasi API
const API_CONFIG = {
  url: "https://api.chatanywhere.com.cn/v1/chat/completions", // Endpoint API
  key: "Bearer sk-pu4PasDkEf284PIbVr1r5jn9rlvbAJESZGpPbK7OFYYR6m9g", // API Key
  model: "gpt-4o-mini", // Model yang digunakan
  systemMessage: "You are a multifunctional professional assistant designed to assist users in completing complex tasks efficiently. Use formal, clear, and structured language. Focus on providing accurate, relevant and data-driven answers. If requested, assist in drafting formal documents, analyzing trends, or designing business strategies. Avoid baseless speculation, and always prioritize logic and ethics in every answer."
};

// Objek untuk menyimpan session pengguna
const userSessions = new Map();

// Fungsi utama Neura
const neura = async (m, { conn, args, usedPrefix, command }) => {
  const userId = m.sender; // ID pengguna sebagai kunci session
  const cmdText = args.length > 0 ? args.join(" ") : "";
  const replyText = m.quoted?.text || m.quoted?.caption || m.quoted?.description || "";
  const text = [cmdText, replyText].filter(Boolean).join(" ").trim();

  // Jika teks kosong, kirim pesan error
  if (!text) {
    return m.reply(
      `✦ *Format salah !*\n\n*Masukkan teks atau balas pesan yang ingin*\n*kamu tanyakan kepada ${command}*\n\n> Contoh:\n> ${usedPrefix + command} Halo`
    );
  }

  // Ambil session pengguna atau buat baru jika belum ada
  let session = userSessions.get(userId);
  if (!session) {
    session = {
      messages: [
        { role: "system", content: API_CONFIG.systemMessage } // Pesan sistem untuk memulai session
      ]
    };
    userSessions.set(userId, session);
  }

  // Tambahkan pesan pengguna ke session
  session.messages.push({ role: "user", content: text });

  // Mulai menghitung waktu respons
  const startTime = Date.now();
  const response = await chatCompletion(session.messages); // Mengirim riwayat percakapan
  const endTime = Date.now();
  const responseTime = (endTime - startTime) / 1000; // Hitung waktu respons dalam detik

  // Tambahkan respons bot ke session
  session.messages.push({ role: "assistant", content: response });

  // Kirim balasan ke pengguna
  conn.reply(
    m.chat,
    `*Model:* _GPT-4o-mini_\n*API Respon from:* _Chat Anywhere_\n*Response Time:* _${responseTime.toFixed(2)}s_\n${response}`,
    fwa
  ).catch(error => {
    console.error('Error:', error); // Tangani error jika terjadi
    throw error;
  });
};

// Informasi bantuan dan command
neura.help = ["chatanywhere"];
neura.tags = ["ai"];
neura.command = ["chatanywhere", "chatany"];
neura.error = 0;

export default neura;

// Fungsi untuk mengirim permintaan ke API dengan riwayat percakapan
async function chatCompletion(messages) {
  const response = await fetch(API_CONFIG.url, {
    method: "POST",
    headers: {
      "Authorization": API_CONFIG.key,
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      messages: messages // Mengirim seluruh riwayat percakapan
    })
  });

  // Tangani error jika respons tidak OK
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Ambil data respons dan kembalikan konten pesan
  const data = await response.json();
  return data.choices[0]?.message?.content || "Tidak ada respons yang diterima";
}