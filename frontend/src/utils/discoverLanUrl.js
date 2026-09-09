const PRIVATE_IP =
  /^(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})$/;

function extractPrivateIp(candidateLine) {
  if (!candidateLine) return "";
  const tokens = candidateLine.split(" ");
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (PRIVATE_IP.test(token)) return token;
  }
  return "";
}

/** หา IP ใน WiFi เดียวกัน เพื่อสร้าง QR ตอน dev บน localhost */
export function discoverLanUrl() {
  if (typeof window === "undefined") return Promise.resolve("");

  if (process.env.REACT_APP_LAN_URL) {
    return Promise.resolve(process.env.REACT_APP_LAN_URL.replace(/\/$/, ""));
  }

  const { protocol, port } = window.location;
  const portSuffix = port ? `:${port}` : "";

  return new Promise((resolve) => {
    if (!window.RTCPeerConnection) {
      resolve("");
      return;
    }

    const candidates = new Set();
    const pc = new RTCPeerConnection({ iceServers: [] });

    const finish = () => {
      pc.close();
      const preferred =
        [...candidates].find((ip) => ip.startsWith("192.168.")) ||
        [...candidates][0] ||
        "";
      resolve(preferred ? `${protocol}//${preferred}${portSuffix}` : "");
    };

    pc.onicecandidate = (event) => {
      const ip = extractPrivateIp(event.candidate?.candidate);
      if (ip) candidates.add(ip);
    };

    pc.createDataChannel("nutriai-share");
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(() => resolve(""));

    window.setTimeout(finish, 1800);
  });
}
