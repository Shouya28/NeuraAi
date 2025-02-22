/*
 * Neura — Community 
 * Saluran WhatsApp: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub: https://github.com/Shouya28
 * WhatsApp: https://wa.me/62895324429899
 * Hi everyone this is my wm don't delete it!
 */

import axios from "axios";
import cheerio from "cheerio";

const neura = async (m, { conn, args, usedPrefix, command }) => {
  const extractQuery = () => {
    if (args.length > 0) return args.join(" ");
    if (m.quoted && (m.quoted.text || m.quoted.caption || m.quoted.description)) {
      return m.quoted.text || m.quoted.caption || m.quoted.description;
    }
    return null;
  };

  const query = extractQuery();
  if (!query) {
    return m.reply(
      `Silakan masukkan kata kunci pencarian atau balas pesan dengan teks yang ingin diproses.\nContoh: *${usedPrefix}${command} bmw*`
    );
  }

  try {
    const thumbnails = await fetchThumbnails(query);
    if (!thumbnails || thumbnails.length === 0) {
      return m.reply("Pencarian tidak menghasilkan gambar terkait.");
    }

    const selectedThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];
    await conn.sendMessage(
      m.chat,
      {
        image: { url: selectedThumbnail },
        caption: `*Hasil Pencarian Gambar*\n\nGambar yang relevan dengan kata kunci "${query}" telah ditemukan.\nUlangi perintah untuk mendapatkan hasil lainnya.`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kendala saat memproses permintaan Anda. Silakan coba lagi nanti.");
  }
};

neura.help = ["storyset"];
neura.tags = ["internet"];
neura.command = ["storyset"];

export default neura;

async function fetchThumbnails(query) {
  try {
    const response = await axios.get(`https://storyset.com/search?q=${encodeURIComponent(query)}`);
    const $ = cheerio.load(response.data);

    const thumbnailUrls = [];
    $("script[type='application/ld+json']").each((_, element) => {
      try {
        const jsonData = JSON.parse($(element).html());
        if (jsonData["@type"] === "ImageObject" && jsonData.thumbnailUrl) {
          thumbnailUrls.push(jsonData.thumbnailUrl);
        }
      } catch (error) {
        console.error("Kesalahan saat memproses data JSON-LD:", error);
      }
    });

    return thumbnailUrls;
  } catch (error) {
    console.error("Kesalahan saat mengambil data dari server:", error);
    return [];
  }
}