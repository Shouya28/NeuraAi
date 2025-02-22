/*
 * Neura — Spehere by Ryzxell ✦
 * WhatsApp Channel: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub Repository: https://github.com/Shouya28
 * WhatsApp Contact: https://wa.me/6283138902543
 * 
 * Greetings! This is my watermark. Please refrain from removing it.
 * Thank you for your understanding and cooperation.
 */
 
import PDFDocument from 'pdfkit';
import { Writable } from 'stream';
import fetch from 'node-fetch';
import up from '../lib/uploadImage.js';

const neura = async (m, { conn, usedPrefix, command, text, args }) => {
  const q = m.quoted ? m.quoted : m;
  const mime =
  (q.msg || q).mimetype ||
  q.mediaType ||
  (q.header && q.header.imageMessage && q.header.imageMessage.mimetype) ||
  "";
  if (!/image\/(jpe?g|png)/.test(mime)) { 
    return m.reply(
  `✦ *Image to pdf Converter*\n\n*Cara penggunaan:*\n- Kirim atau reply gambar dengan caption ${usedPrefix + command}`)
  }

  
  try {
    let img = await up(await q.download());
    const pdfBuffer = await generatePDFFromImage(img);
    await conn.sendFile(
      m.chat,
      pdfBuffer,
      `NeuraSpehere-${Date.now()}.pdf`,
      `*Berhasil mengkonversi gambar ke PDF*\n` +
        `Ukuran file: ${formatFileSize(pdfBuffer.length)}\n` +
        `Link PDF: ${img}`,
      m
    );
  } catch (err) {
    console.error('Error membuat PDF:', err);
    m.reply('Terjadi kesalahan saat membuat PDF.');
  }
};

const generatePDFFromImage = async (img) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    const stream = new Writable({
      write(chunk, encoding, next) {
        chunks.push(chunk);
        next();
      }
    });

    stream.on('finish', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err) => reject(err));

    doc.pipe(stream);

    try {
      const response = await fetch(img);
      const imageBuffer = await response.buffer();

      doc.image(imageBuffer, {
        fit: [doc.page.width - 100, doc.page.height - 100],
        align: 'center',
        valign: 'center'
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

neura.command = ["imgtopdf", "img2pdf"];
neura.help = ["imgtopdf"];
neura.tags = ['tools'];

export default neura;