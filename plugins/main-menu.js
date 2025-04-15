/*
 * Neura — Community  
 * WhatsApp Channel: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub: https://github.com/Shouya28  
 * Contact: https://wa.me/62895324429899  
 * Please retain this watermark. Thank you!  
 */

import PhoneNumber from "awesome-phonenumber";
import { promises } from "fs";
import { join } from "path";
import fetch from "node-fetch";
import { xpRange } from "../lib/levelling.js";
import moment from "moment-timezone";
import os from "os";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (
  await import("@adiwajshing/baileys")
).default;

let tags = {
  feedback: "FEEDBACK",
  main: "MAIN MENU",
  anime: "ANIME",
  game: "GAMES",
  rpg: "RPG GAMES",
  bank: "BANKING",
  db: "DATABASE",
  fun: "FUN STUFF",
  info: "INFO",
  sticker: "STICKER MAKER",
  owner: "BOT OWNER",
  group: "GROUP TOOLS",
  dl: "DOWNLOAD",
  tools: "TOOLS",
  jadian: "RELATIONSHIP STATUS",
  quotes: "QUOTES",
  random: "RANDOM FUN",
  ai: "AI TOOLS",
  internet: "INTERNET TOOLS",
  islamic: "ISLAMIC CONTENT",
  maker: "CONTENT MAKER",
};

const defaultMenu = {
    before: `
✧ *User Information*
- *Name:* %name
- *Status:* %status
- *Age:* %age
- *Limit:* %limit
- *Role:* %role
- *Level:* %level [%xp4levelup XP to Level Up]
- *XP:* %exp / %maxexp
- *Total XP:* %totalexp

✧ *Neura Information*
- *Bot Name:* %me
- *Mode:* %mode
- *Platform:* Linux
- *Type:* Node.js
- *Baileys:* Multi Device
- *Uptime:* %muptime
- *Database:* %rtotalreg of %totalreg
- *Total Hits:* %totalHits
- *Rating:* %averageRating out of 5
%readmore`,
    header: "✧ *%category*",
    body: "- %cmd %islimit %isPremium",
    footer: "",
    after: "",
};

const loadRatings = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Error membaca file rate.json:', error);
    return {};
  }
};

let neura = async (m, { conn, usedPrefix }) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, '../lib/rate.json');

  let wib = moment.tz("Asia/Jakarta").format("HH:mm:ss");
  let _package = JSON.parse(await promises.readFile(join(__dirname, "../package.json")).catch((_) => ({}))) || {};
  let { age, exp, level, role } = global.db.data.users[m.sender] || {};
  let { min, xp, max } = xpRange(level, global.multiplier);
  let tag = `@${m.sender.split("@")[0]}`;
  let mode = global.opts["self"] ? "Self" : "Public";
  let user = global.db.data.users[m.sender] || {};
  let ratings = loadRatings(filePath);
  let allRatings = Object.values(ratings);
  let totalRatings = allRatings.length;
  let averageRating = totalRatings > 0 ?
  (allRatings.reduce((sum, rating) => sum + rating, 0) / totalRatings).toFixed(2) :
  0;
  let limit = user.premiumTime >= 1 || m.sender.split`@` [0] == infoo.nomorown ? "Infinity" : user.limit;
  let name = `${user.registered ? user.name : conn.getName(m.sender)}`;
  let status = `${m.sender.split`@`[0] == infoo.nomorown ? "Developer" : user.premiumTime >= 1 ? "Premium User" : user.level >= 1000 ? "Elite User" : "Free User"}`;
  let totalHits = Object.values(global.db.data.stats).reduce((acc, stat) => acc + stat.total, 0);
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let d = new Date(new Date() + 3600000);
  let locale = "id";
  let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][Math.floor(d / 84600000) % 5];
  let week = d.toLocaleDateString(locale, { weekday: "long" });
  let date = d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  let dateIslamic = Intl.DateTimeFormat(locale + "-TN-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }).format(d);
  let time = d.toLocaleTimeString(locale, { hour: "numeric", minute: "numeric", second: "numeric" });
  let _uptime = process.uptime() * 1000;
  let _muptime;
  if (process.send) {
    process.send("uptime");
    _muptime = (await new Promise((resolve) => {
      process.once("message", resolve);
      setTimeout(resolve, 1000);
    })) * 1000;
  }
  let muptime = clockString(_muptime);
  let uptime = clockString(_uptime);
  let totalreg = Object.keys(global.db.data.users).length;
  let rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
  let help = Object.values(global.plugins)
    .filter((plugin) => !plugin.disabled)
    .map((plugin) => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: "customPrefix" in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      };
    });
  for (let plugin of help)
    if (plugin && "tags" in plugin)
      for (let tag of plugin.tags)
        if (!(tag in tags) && tag) tags[tag] = tag;
  conn.menu = conn.menu ? conn.menu : {};
  let before = conn.menu.before || defaultMenu.before;
  let header = conn.menu.header || defaultMenu.header;
  let body = conn.menu.body || defaultMenu.body;
  let footer = conn.menu.footer || defaultMenu.footer;
  let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? "" : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after;
  let _text = [
    before,
    ...Object.keys(tags).map((tag) => {
      return (
        header.replace(/%category/g, tags[tag]) +
        "\n" + [
          ...help
          .filter((menu) => menu.tags && menu.tags.includes(tag) && menu.help)
          .map((menu) => {
            return menu.help
              .map((help) => {
                return body
                  .replace(/%cmd/g, menu.prefix ? help : "%p" + help)
                  .replace(/%islimit/g, menu.limit ? "🅛" : "")
                  .replace(/%isPremium/g, menu.premium ? "🅟" : "")
                  .trim();
              })
              .join("\n");
          }),
          footer,
        ].join("\n")
      );
    }),
    after,
  ].join("\n");
  let text = typeof conn.menu == "string" ? conn.menu : typeof conn.menu == "object" ? _text : "";
  let replace = {
    "%": "%",
    p: usedPrefix,
    uptime,
    muptime,
    me: global.infoo.wm,
    npmname: _package.name,
    npmdesc: _package.description,
    version: _package.version,
    exp: exp - min,
    maxexp: xp,
    totalexp: exp,
    xp4levelup: max - exp,
    github: _package.homepage ? _package.homepage.url || _package.homepage : "[unknown github url]",
    level,
    limit,
    name,
    weton,
    week,
    date,
    dateIslamic,
    time,
    totalreg,
    rtotalreg,
    role,
    tag,
    status,
    mode,
    wib,
    age,
    totalHits,
    averageRating,
    readmore: readMore,
  };

  let group = global.db.data.bots.link.group;
  text = text.replace(
    new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, "g"),
    (_, name) => "" + replace[name]
  );
  let globall = global.db.data.bots;
  let fkon = {
  key: {
    fromMe: false,
    participant: `${m.sender.split`@`[0]}@s.whatsapp.net`,
    ...(m.chat ? { remoteJid: "16504228206@s.whatsapp.net" } : {}),
  },
  message: {
    contactMessage: {
      displayName: `${name}`,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split("@")[0]}:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
    },
  },
};

let pp = await conn
  .profilePictureUrl(m.sender, "image")
  .catch((_) => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
      let msg = generateWAMessageFromContent(
  m.chat,
  {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          body: {
            text: text,
          },
          footer: {
            text: "wm",
          },
          header: {
            title: "",
            subtitle: "Menu",
            hasMediaAttachment: true,
            ...(await prepareWAMessageMedia(
              {
                document: {
                  url: "https://whatsapp.com/channel/0029Vac0DjG6xCSJT0HTV61w",
                },
                mimetype: "image/webp",
                fileName: `[ Hello ${m.name} ]`,
                pageCount: 2024,
                jpegThumbnail: await conn.resize(pp, 400, 400),
                fileLength: 2024000,
              },
              { upload: conn.waUploadToServer }
            )),
          },
          contextInfo: {
            forwardingScore: 2024,
            isForwarded: true,
            mentionedJid: [m.sender],
            forwardedNewsletterMessageInfo: {
              newsletterJid: linkk.chid,
              serverMessageId: null,
              newsletterName: ""
            },
            externalAdReply: {
              showAdAttribution: true,
              title: "[ Hello I'm Emilia-Ogiwara ]",
              body: "",
              mediaType: 1,
              sourceUrl: "https://rest.cifumo.biz.id",
              thumbnailUrl: menu.menu,
              renderLargerThumbnail: true,
            },
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "List Menu",
                  sections: [
                    {
                      title: "List Menu",
                      highlight_label: "Popular",
                      rows: [{
                        header: infoo.wm,
                        title: "coming soon",
                        description: "404",
                        id: ".."
                      }
                      ],
                    },
                  ],
                }),
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "Owner ku cayang",
                  id: ".owner",
                }),
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Rest API",
                  url: "https://rest.cifumo.xyz",
                  merchant_url: "https://rest.cifumo.xyz",
                }),
              },
            {
        buttonId: '.owner',
        buttonText: {
          displayText: 'Contact owner'
        },
        type: 1
        },
            ],
          },
        },
      },
    },
  },
  { quoted: m },
  {}
);

    await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id,
    });
};

neura.help = ["menu"];
neura.tags = ["main"];
neura.command = /^(menu)$/i;
neura.register = true;
neura.error = 0;

export default neura;
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}

function getRandom() {
  if (Array.isArray(this) || this instanceof String)
    return this[Math.floor(Math.random() * this.length)];
  return Math.floor(Math.random() * this);
}