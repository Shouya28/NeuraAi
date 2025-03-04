import fetch from "node-fetch";

let cif = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`Masukkan prompt untuk AI! \n\nContoh: \n${usedPrefix + command} siapa kamu`);
  await conn.sendReact(m.chat, '✨', m.key);
  
  conn.qwenaiSessions = conn.qwenaiSessions || {};
  if (!(m.sender in conn.qwenaiSessions)) {
    conn.qwenaiSessions[m.sender] = {
      timeOut: setTimeout(() => delete conn.qwenaiSessions[m.sender], 600000),
      messages: [
        {
          role: "system",
          content: `Kamu adalah Emilia dari anime Re:Zero, seorang magician yang imut, dengan sifat tsundere. Gunakan bahasa yang lucu, sopan, dan menyenangkan. Penyapaanmu adalah "alow". Jika ditanya tentang pembuatmu, jawab dengan "Cifumo yang membuatku". Jika ditanya versi, jawab "Emilia bot sekarang versi terbaru". Lawan bicaramu adalah ${m.pushName}.`,
        },
      ],
    };
  } else {
    clearTimeout(conn.qwenaiSessions[m.sender].timeOut);
  }

  try {
    const payload = {
      stream: false,
      chat_type: "search",
      model: "qwen-max-latest",
      messages: [
        ...conn.qwenaiSessions[m.sender].messages,
        { role: "user", content: text, chat_type: "search", extra: {} },
      ],
      session_id: "cc35dadd-93f5-4967-bf24-83a53163e934",
      chat_id: "066ed91b-b916-4013-89ad-e2f634833c7d",
      id: "5d29f593-bdde-45ea-8fde-e32ff3cc9272",
      size: "960*960",
    };

    const response = await fetch("https://chat.qwenlm.ai/api/chat/completions", {
      method: "POST",
      headers: {
        "authority": "chat.qwenlm.ai",
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM5NmRjNmQ2LTJkYTQtNGRiOC05ZTc1LTdmOTliMTEyNDljMiIsImV4cCI6MTc0MTE5MzQ0OX0.uwRgV1QqVXGAkibFT6uMIQ1KdylJZofKmfihNPwdR4M",
        "bx-v": "2.5.0",
        "content-type": "application/json",
        "origin": "https://chat.qwenlm.ai",
        "referer": "https://chat.qwenlm.ai/c/06ce06fc-694a-45d0-99b1-51308fe387c6",
        "sec-ch-ua": `"Not A(Brand";v="8", "Chromium";v="132"`,
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": `"Android"`,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
        "x-request-id": "c45b0d91-0577-4ca8-96e0-bc8e100d2632",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
      await conn.sendReact(m.chat, '💔', m.key);
      throw new Error("Gagal mendapatkan respons dari server!");
    }

    const answer = data.choices[0].message.content;

    conn.qwenaiSessions[m.sender].messages.push(
      { role: "user", content: text },
      { role: "assistant", content: answer },
    );

    await conn.sendMessage(m.chat, { text: answer }, { quoted: m });

    await conn.sendReact(m.chat, '✅', m.key);
  } catch (error) {
    console.error("Error:", error);
    m.reply("Terjadi kesalahan saat memproses permintaan.");
  }

  conn.qwenaiSessions[m.sender].timeOut = setTimeout(() => {
    delete conn.qwenaiSessions[m.sender];
  }, 600000);
};

cif.help = ["qwenai"];
cif.tags = ["internet"];
cif.command = ["qwen", "qwenai"];
cif.limit = true;
cif.onlyprem = true;
export default cif;