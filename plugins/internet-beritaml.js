/*
 * Neura — Community 
 * Saluran WhatsApp: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub: https://github.com/Shouya28
 * WhatsApp: https://wa.me/62895324429899
 * Hi everyone this is my wm don't delete it!
 */
 // [ Scrape by fruatre ]
 
import axios from "axios";
import cheerio from "cheerio";

const neura = async (m, { conn }) => {
  try {
    await m.reply("⏳ Sedang mengambil berita bmw...");
    const articles = await scrapeMLNews();

    if (!articles || articles.length === 0) {
      return m.reply("❌ Tidak ada berita yang ditemukan.");
    }
    const formattedResults = articles
      .map((article, index) => {
        return `
*${index + 1}. ${article.title}*
*Kategori:* ${article.category}
*Penulis:* ${article.author} ([Lihat Profil](${article.authorLink}))
*Diterbitkan:* ${article.publishTime}
*Deskripsi:* ${article.description || "Tidak tersedia"}

[Selengkapnya](${article.link})
![Gambar](${article.image})
`.trim();
      })
      .join("\n\n───────────────────────\n\n");
    await conn.sendMessage(
      m.chat,
      {
        text: `📰 *Berita Terbaru Mobile Legends*\n\n${formattedResults}`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    await m.reply("❌ Terjadi kesalahan saat mengambil berita. Silakan coba lagi nanti.");
  }
};

neura.help = ["mlnews"];
neura.tags = ["inernet"];
neura.command = ["mlnews", "beritaml"];

export default neura;

async function scrapeMLNews() {
  try {
    const url = "https://www.oneesports.gg/mobile-legends/";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const articles = [];
    $(".row.tab-box").each((index, element) => {
      const category = $(element).find(".cat-name").text().trim();
      const title = $(element).find("h2 a").text().trim();
      const link = $(element).find("h2 a").attr("href");
      const description = $(element).find("h3 p").text().trim();
      const author = $(element).find(".author").text().trim();
      const authorLink = $(element).find(".author").attr("href");
      const publishTime = $(element).find("span[data-publish-time]").text().trim();
      const image = $(element).find("img").attr("data-src");

      if (title && link) {
        articles.push({
          category,
          title,
          link,
          description,
          author,
          authorLink,
          publishTime,
          image,
        });
      }
    });

    return articles;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}