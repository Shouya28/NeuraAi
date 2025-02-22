/*
 * Neura — Community 
 * Saluran WhatsApp: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub: https://github.com/Shouya28
 * WhatsApp: https://wa.me/62895324429899
 * Hi everyone this is my wm don't delete it!
 */
 
import { wiki } from "vtuber-wiki";

const neura = async (m, { conn, text }) => {
  if (!text) return m.reply(`*404* Example: .vtuber bmw`);

  try {
    const getVTuberInfo = async (query) => {
      const result = await wiki(query);
      if (!result || !result.image_url) throw new Error("VTuber not found.");
      return result;
    };

    const vtuberData = await getVTuberInfo(text);
    const formatDetails = (data) => {
      const fields = [
        { label: "Name", value: data.title },
        { label: "Profile Link", value: data.url },
        { label: "Affiliation", value: data.author },
        { label: "Account", value: data.account },
        { label: "Debut Date", value: data.date },
        { label: "Type", value: data.type },
        { label: "Channel", value: data.channel },
        { label: "Social Media", value: data.social_media },
        { label: "Official Website", value: data.official_website },
        { label: "Gender", value: data.gender },
        { label: "Age", value: data.age },
        { label: "Description", value: data.description },
        { label: "More Info", value: data.more }
      ];

      let formatted = `*[ VTUBER WIKI ]*\n\n`;
      fields.forEach(({ label, value }) => {
        formatted += `*${label}:* ${value || "-"}\n`;
      });
      return formatted.trim();
    };
    
    const vtuberDetails = formatDetails(vtuberData);
    await conn.sendMessage(m.chat, {
      image: { url: vtuberData.image_url },
      caption: vtuberDetails
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    await m.reply(`Error: ${error.message}`);
  }
};

neura.help = ["vtuber"];
neura.tags = ["internet"];
neura.command = ["vtuber"];

export default neura;