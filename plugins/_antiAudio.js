/*
 * Neura — Spehere by Ryzxell ✦
 * WhatsApp Channel: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub Repository: https://github.com/Shouya28
 * WhatsApp Contact: https://wa.me/6283138902543
 * 
 * Greetings! This is my watermark. Please refrain from removing it.
 * Thank you for your understanding and cooperation.
 */
 
export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true
  let chat = global.db.data.chats[m.chat]
  let sender = global.db.data.chats[m.sender]
  if (chat.antiVn && m.mtype) {
    if (m.mtype === "audioMessage") {
      if (isAdmin || !isBotAdmin) {
      } else {
        m.reply(`*Admin mengaktifkan anti audio*`)
        return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant } })
      }
      return true
    }
  }
  return true
}