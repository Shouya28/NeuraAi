/*
 * Neura — Community 
 * Saluran WhatsApp: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub: https://github.com/Shouya28
 * WhatsApp: https://wa.me/62895324429899
 * Hi everyone this is my wm don't delete it!
 */
 
import fetch from "node-fetch";

const CONFIG = {
  API_ENDPOINT: "https://carbonara.solopov.dev/api/cook",
  DEFAULT_THEME: "dracula",
  DEFAULT_FONT_FAMILY: "Hack",
  IMAGE_FORMAT: "png"
};

class CarbonGenerationError extends Error {
  constructor(message, statusCode = null) {
    super(message);
    this.name = 'CarbonGenerationError';
    this.statusCode = statusCode;
  }
}

class ContentExtractor {
  static extractFromMessage(message, args) {
    if (args?.length > 0) {
      return args.join(" ");
    }

    if (message.quoted) {
      const { text, caption, description } = message.quoted;
      return text || caption || description;
    }

    return null;
  }
}

class CarbonImageService {
  static async generateImage(code, options = {}) {
    const requestBody = {
      code,
      theme: options.theme || CONFIG.DEFAULT_THEME,
      fontFamily: options.fontFamily || CONFIG.DEFAULT_FONT_FAMILY,
      ...options
    };

    try {
      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new CarbonGenerationError(
          `API Error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      return Buffer.from(arrayBuffer);

    } catch (error) {
      if (error instanceof CarbonGenerationError) {
        throw error;
      }
      throw new CarbonGenerationError("Failed to generate carbon image");
    }
  }
}

const neura = async (message, { conn, args, usedPrefix, command }) => {
  const text = ContentExtractor.extractFromMessage(message, args);

  if (!text) {
    return message.reply(
      `Mohon masukkan kode atau teks yang ingin divisualisasikan.\n\nContoh penggunaan:\n${usedPrefix}${command} console.log("Hello BMW!")`
    );
  }

  const progressMessage = await message.reply(wait);

  try {
    const carbonImage = await CarbonImageService.generateImage(text, {
      windowControls: true,
      widthAdjustment: true,
      paddingVertical: "56px",
      paddingHorizontal: "56px",
    });

    await conn.sendFile(
      message.chat,
      carbonImage,
      `carbon_${Date.now()}.${CONFIG.IMAGE_FORMAT}`,
      `*Kode berhasil divisualisasikan oleh:*\n${message.name}\n\n_Gunakan ${usedPrefix}carbon <kode> untuk membuat visualisasi kode yang indah_`,
      message
    );

  } catch (error) {
    console.error('Carbon Generation Error:', error);
    await message.reply(
      "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti."
    );
  } finally {
    if (progressMessage.delete) {
      await progressMessage.delete();
    }
  }
};

neura.help = ["carbonivy"];
neura.tags = ["tools"];
neura.command = ["carbonivy"];

export default neura;