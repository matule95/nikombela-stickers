import axios from "axios";

export async function clearChat(id: string) {
  const object = {
    token: process.env.INSTANCE_TOKEN,
    chatId: id,
  };
  return new Promise<void>((resolve, reject) => {
    axios
      .post(
        `https://api.ultramsg.com/${process.env.INSTANCE_ID}/chats/delete`,
        object
      )
      .then(() => resolve())
      .catch((error) => reject(error));
  });
}
