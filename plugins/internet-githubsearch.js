/*
 * Neura — Community 
 * Saluran WhatsApp: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub: https://github.com/Shouya28
 * WhatsApp: https://wa.me/62895324429899
 * Hi everyone this is my wm don't delete it!
 */
 
 import axios from "axios";

const neura = async (m, { text, usedPrefix, command }) => {
  const extractQuery = () => {
    if (!text) return null;
    return text.trim();
  };

  const query = extractQuery();
  if (!query) {
    return m.reply(
      `Silakan masukkan kata kunci atau nama repositori yang ingin dicari.\nContoh penggunaan: *${usedPrefix}${command} BMW*`
    );
  }

  try {
    const repositories = await searchRepositories(query);
    if (!repositories || repositories.length === 0) {
      return m.reply("Pencarian tidak menghasilkan repositori terkait.");
    }

    const formattedResults = repositories
      .map((repo, index) => {
        return `
${index + 1}. *Nama Repositori:* ${repo.full_name}${repo.fork ? " (Fork)" : ""}
*URL:* ${repo.html_url}
*Tanggal Pembuatan:* ${formatDate(repo.created_at)}
*Tanggal Pembaruan Terakhir:* ${formatDate(repo.updated_at)}
*Statistik:* 👁️ Watchers: ${repo.watchers} | 🍴 Forks: ${repo.forks} | ⭐ Stars: ${repo.stargazers_count}
${repo.open_issues > 0 ? `*Issue Terbuka:* ${repo.open_issues}` : ""}
${repo.description ? `*Deskripsi:* ${repo.description}` : ""}
*Perintah Clone:* \`\`\`$ git clone ${repo.clone_url}\`\`\``
          .trim();
      })
      .join("\n\n");

    m.reply(formattedResults || "Tidak ada repositori yang ditemukan.");
  } catch (error) {
    console.error(error);
    m.reply("Terjadi kendala teknis saat memproses permintaan Anda. Silakan coba lagi nanti.");
  }
};

neura.help = ["githubsearch"];
neura.tags = ["internet"];
neura.command = ["githubsearch", "ghs"];

export default neura;

async function searchRepositories(query) {
  try {
    const response = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`);
    if (!response.data || !response.data.items || response.data.items.length === 0) {
      return [];
    }
    return response.data.items;
  } catch (error) {
    console.error("Kesalahan saat mengambil data dari GitHub:", error.message);
    return [];
  }
}

function formatDate(dateString, locale = "id") {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date(dateString).toLocaleDateString(locale, options);
}