// ✅ LINE通知送信関数
function sendNotification(担当者名, timestamp) {
  const token = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
  if (!token) return false;

  const formattedTime = Utilities.formatDate(timestamp, "Asia/Tokyo", "HH:mm:ss");
  const message = `📦 積み込み完了通知\n担当者: ${担当者名}\n時刻: ${formattedTime}`;

  try {
    const payload = JSON.stringify({
      messages: [{ type: "text", text: message }]
    });

    const response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      payload: payload
    });

    return true;
  } catch (e) {
    Logger.log(e);
    return false;
  }
}
