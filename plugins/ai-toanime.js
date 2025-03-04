/*
 * Neura — Spehere by Ryzxell ✦
 * WhatsApp Channel: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub Repository: https://github.com/Shouya28
 * WhatsApp Contact: https://wa.me/6283138902543
 * 
 * Greetings! This is my watermark. Please refrain from removing it.
 * Thank you for your understanding and cooperation.
 */
 
import axios from 'axios';
import { fileTypeFromBuffer } from "file-type";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";

const neura = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  const q = m.quoted ? m.quoted : m;
const mime = (q.msg || q).mimetype || q.mediaType || (q.header && q.header.imageMessage && q.header.imageMessage.mimetype) || "";

if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Reply or send an image with caption *${usedPrefix + command}*`);

  let media = await q.download()
  let url = await up(media)
  m.reply(wait)
  const payload = {
    init_image: url,
    image_num: 1,
    prompt: "realistic",
    style_id: "anime",
    skin: "default",
    width: 614,
    height: 1349
  };

  const {
    data
  } = await axios.post("https://api.itsrose.rest/turnMe/transform", payload, {
    headers: {
      Authorization: "Bearer Rk-9b79597d0405df275ac88df304f21979",
    },
  }).catch((e) => e?.response);

  const {
    status,
    message,
    result
  } = data;

  if (!status) {
    m.reply(message);
  } else {
    conn.sendFile(m.chat, result.images[0], 'Claire.jpg', "", m)
  }
};

neura.help = ['toanime'];
neura.tags = ["ai", "maker"];
neura.command = ["toanime"];
neura.premium = true;

export default neura;

async function up(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  return await response.text();
}