import axios from "axios";
import qs from "qs";
const ultraMSGConfig = {
  instance_id: "instance43057",
  token: "5g7fn00gtr5qkkid",
};
export async function sendSticker(
  url: string,
  phoneNumber: string
): Promise<void> {
  const data = qs.stringify({
    token: ultraMSGConfig.token,
    to: `+${phoneNumber}`,
    sticker: url,
    priority: "",
    referenceId: "",
    nocache: "",
    msgId: "",
  });
  const config = {
    method: "post",
    url: `https://api.ultramsg.com/${ultraMSGConfig.instance_id}/messages/sticker`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  return new Promise<void>(async (resolve, reject) => {
    await axios(config)
      .then(() => {
        console.log("Sticker sent successfully");
        return resolve();
      })
      .catch(() => reject());
  });
}
