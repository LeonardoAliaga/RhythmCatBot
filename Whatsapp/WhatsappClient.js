const { Client, LocalAuth, NoAuth, MessageMedia } = require("whatsapp-web.js");
const Wiki = require("wtf_wikipedia");
const qrcode = require("qrcode-terminal");
const color = require("ansi-colors");
const fs = require("fs");

const prefix = "y/";
const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1014580163-alpha.html",
  },
  // puppeteer: {
  //   headless: true,
  //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
  // }
});

whatsappClient.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

whatsappClient.on("ready", async () => {
  console.log(
    `${color.cyan("RhythmCat")} está listo en ${color.green("Whatsapp")}`
  );
  // sendMessage('51928750742@c.us', 'PanquiBot está listo crack!');
});

whatsappClient.on("auth_failure", (error) => {
  console.log("Fallo de autenticación");
  console.error(error);
});

whatsappClient.on("message_create", async (msg) => {
  const { from, to, body, hasMedia } = msg;
  let send = from === "51928750742@c.us" ? to : from;
  const args = body.split(" ");
  const content = msg.body.replace(args[0], "");

  switch (args[0]) {
    case prefix + "wiki":
      if (args[1]) {
        let doc = await Wiki.fetch(args[1], "es");
        sendMessage(send, doc.text());
      } else {
        sendMessage(
          send,
          "Debes de escribir lo que quieras buscar. *Ejemplo:*\n_y/wiki fotosíntesis_"
        );
      }
      break;

    case prefix + "img":
      var quoted = await msg.getQuotedMessage();
      if (!msg.hasQuotedMsg)
        return sendMessage(send, "Debes responder a una imagen");
      if (!quoted.hasMedia)
        return sendMessage(send, "Debes responder a una imagen");
      if (!args[1])
        return sendMessage(
          send,
          "Debes escribir el nombre que quieres darle al sticker"
        );

      if (quoted.hasMedia) {
        const mediafile = await quoted.downloadMedia();
        const uploadDir = "./upload/";
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        const filePath = `${uploadDir}${msg.timestamp}.png`;
        fs.writeFile(filePath, mediafile.data, "base64", (err) => {
          if (err) {
            console.log(err);
          } else {
            convertToSticker(send, filePath, content);
            sendMessage(send, `Tu sticker **${content}** ya está listo!`);
          }
        });
      } else {
        sendMessage(send, "Debes responder a una imagen");
      }
      break;
  }
});

const convertToSticker = (to, file, name) => {
  const mediaFile = MessageMedia.fromFilePath(file);
  whatsappClient.sendMessage(to, mediaFile, {
    sendMediaAsSticker: true,
    stickerAuthor: "PanquiBot",
    stickerName: name,
  });

  fs.unlink(file, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const sendMessage = (to, message) => {
  whatsappClient.sendMessage(to, `${message}\n\n_RhythmCatBot_`);
};

const sendMedia = (to, file) => {
  const mediaFile = MessageMedia.fromFilePath(`./Discord/Sources/${file}.mp3`);
  whatsappClient.sendMessage(to, mediaFile);
};

module.exports = {
  whatsappClient,
  sendMessage,
  sendMedia,
};
