const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");

async function startSock() {
    const { state, saveState } = useSingleFileAuthState("./auth_info.json");
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        // Get message content
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;

        // Example command: !ping
        if (text && text.startsWith("!ping")) {
            await sock.sendMessage(sender, { text: "Pong! Bot is alive." });
        }

        // Add your own commands below
        if (text && text.startsWith("!hello")) {
            await sock.sendMessage(sender, { text: "Hello there! 👋" });
        }
    });

    sock.ev.on("creds.update", saveState);
}

startSock();