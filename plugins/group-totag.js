/*
 * Neura — Community 
 * Saluran WhatsApp: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub: https://github.com/Shouya28
 * WhatsApp: https://wa.me/62895324429899
 * Hi everyone this is my wm don't delete it!
 */
 
let neura = async (m, { conn, participants }) => {
  if (!m.quoted) return m.reply("*reply pesan yang mau di tag nya*");
  conn.sendMessage(m.chat, {
    forward: m.quoted.fakeObj,
    mentions: participants.map(u => u.id).filter(id => id !== conn.user.jid)
  })
}

neura.help = ['totag']
neura.tags = ['group']
neura.command = ["totag", "tag"]
neura.admin = true
neura.group = true

export default neura