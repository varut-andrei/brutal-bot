import chalk from "chalk";

enum KEYS {
  HELP = "H",
  INFO = "I",
  GET = "G",
  SEND_MESSAGE = "S",
  EXIT = "Q",
  CLEAR = "C",
}

const CONFIG = {
  [KEYS.HELP]: "Help",
  [KEYS.INFO]: "Your information",
  [KEYS.GET]: "Get price",
  [KEYS.SEND_MESSAGE]: "Send Message",
  [KEYS.CLEAR]: "Clear",
  [KEYS.EXIT]: "Exit process",
};

const help = () => {
  console.log("› Press the following keys to execute:");
  Object.entries(CONFIG).forEach(([key, value]) =>
    console.log(`    ${chalk.bold(key)} │ ${value}`)
  );
};

const exit = () => {
  console.log("Exiting the program.");
  process.exit();
};

export const startPrompt = ({
  info,
  getPrice,
  sendMessage,
  clear,
}: {
  info: () => Promise<void>;
  getPrice: () => Promise<void>;
  sendMessage: () => Promise<void>;
  clear: () => Promise<void>;
}) => {
  const config = {
    [KEYS.HELP]: help,
    [KEYS.INFO]: info,
    [KEYS.GET]: getPrice,
    [KEYS.SEND_MESSAGE]: sendMessage,
    [KEYS.CLEAR]: clear,
    [KEYS.EXIT]: exit,
  };

  // Setting stdin to raw mode
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  help();

  process.stdin.on("data", async (key: Buffer) => {
    // Convert buffer to stringCQ
    const keyPressed = key.toString();

    switch (keyPressed.toLowerCase()) {
      case KEYS.HELP.toLowerCase():
        config[KEYS.HELP]();
        break;

      case KEYS.INFO.toLowerCase():
        console.log("Checking the client...");
        config[KEYS.INFO]();
        break;

      case KEYS.GET.toLowerCase():
        console.log("Getting the price...");
        config[KEYS.GET]();
        break;

      case KEYS.SEND_MESSAGE.toLowerCase():
        console.log("Sending the message with the price...");
        await config[KEYS.SEND_MESSAGE]();
        console.log("Message sent!");
        break;

      case KEYS.CLEAR.toLowerCase():
        config[KEYS.CLEAR]();
        help();
        break;

      case KEYS.EXIT.toLowerCase():
        config[KEYS.EXIT]();
        break;

      // This is the Unicode character for CTRL+C
      case "\u0003":
        config[KEYS.EXIT]();
        break;

      default:
        console.log(
          `You pressed ${keyPressed}, no action defined for this key.`
        );
    }
  });
};

//// This is the Unicode character for CTRL+C
// if (keyPressed === "\u0003") {
//   console.log("Exiting the program.");
//   process.exit();
// }
