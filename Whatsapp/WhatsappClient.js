const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const qrcode = require("qrcode-terminal");
const color = require("ansi-colors");


const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

whatsappClient.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

whatsappClient.on("ready", async () => {
  console.log(
    `${color.cyan("RhythmCat")} esta listo en ${color.green("Whatsapp")} `
  );
  sendMessage("51928750742@c.us", "PanquiBot esta listo carck!");
});

whatsappClient.on("auth_failure", (error) => {
  console.error(error);
});

whatsappClient.on('message_create', async (msg) => {
    const { from, to, body, hasMedia } = msg;
    let send;
   (from === '51928750742@c.us') ? send = to : send = from;
    const args = body.split(' ');
    const content = msg.body.replace(args[0], '');

    switch (args[0]) {
      case prefix + 'wiki':
        if(args[1]){
          let doc = await Wiki.fetch(args[1], 'es')
          sendMessage(send, doc.text());
        } else if(!args[1]){
          sendMessage(send, 'Debes de escribir lo que quieras bucar. *Ejemplo:*\n_y/wiki fotosintesis_');
        }
      break;
      case prefix + 'img':
        //console.log(await msg.getQuotedMessage())
        var quoted = await msg.getQuotedMessage()
        if(!msg.hasQuotedMsg) return sendMessage(send, 'Debes de reponder a una imagen');
        if(!quoted.hasMedia) return sendMessage(send, 'Debes de reponder a una imagen')
        if(!args[1]) return sendMessage(send, 'Debes de escribir el nombre que quieres darle al sticker');
        if (quoted.hasMedia) {
          const mediafile = await quoted.downloadMedia();
          // console.log(
          //   mediafile.mimetype,
          //   mediafile.data.length
          // );
          //How to save that object as a file? =====================================
    
          fs.writeFile("./public/upload/" + msg.timestamp + ".png", mediafile.data, "base64", (err) => {
              if (err) {
                console.log(err);
              }
          convertToSticker(send, "./public/upload/" + msg.timestamp + ".png", content);
            }
          );
          sendMessage(send, `Tu sticker **${content}** ya esta listo!`);
          //========================================================================
        } else {
          sendMessage(send, 'Debes de reponder a una imagen');
        }
        
        break;
    }
  })


const convertToSticker = (to, file, name) => {
  console.log(file)
  const mediaFile = MessageMedia.fromFilePath(`${file}`)
  client.sendMessage(to, mediaFile, {
    sendMediaAsSticker: true,
    stickerAuthor: 'PanquiBot',
    stickerName: name,
  })

  
  var path = file;
  fs.unlink(path, function (err) {
    if (err) {
       console.error(err);
     } else {
     }
   });
}


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
  sendMedia
};