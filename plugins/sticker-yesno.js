/*
 * Neura — Community 
 * Saluran WhatsApp: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub: https://github.com/Shouya28
 * WhatsApp: https://wa.me/62895324429899
 * Hi everyone this is my wm don't delete it!
 */
 
import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

let neura = async (m, { conn, args, usedPrefix, command }) => {
  try {
const cmdText = args.length > 0 ? args.join(" ") : "";
const replyText = m.quoted?.text || m.quoted?.caption || m.quoted?.description || "";

const text = [cmdText, replyText].filter(Boolean).join(" ").trim();

if (!text) {
  return m.reply(
    `✦ *Format salah !*\n\n*Masukkan teks atau balas pesan yang ingin*\n*kamu tanyakan kepada ${command}*\n\n> Contoh:\n> ${usedPrefix + command} BMW`);
};
    const { image, answer } = await fetch('https://yesno.wtf/api').then(res => res.json())

    const sticker = new Sticker(image, {
      pack: 'Neura say',
      author: answer.toUpperCase(),
      type: 'full',
      quality: 30
    })

    await conn.sendMessage(m.chat, { sticker: await sticker.toBuffer() }, { quoted: m })
  } catch (e) {
    console.error(e) 
    await m.reply('error lek cape gw.')
  }
}

neura.help = ["yesno"]
neura.tags = ["game"]
neura.command = ["yesno"];

export default neura;