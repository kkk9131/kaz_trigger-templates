/**
 * 📩 LINE通知を送信する関数
 * @param {string} 担当者名 - 通知に表示する名前
 * @param {Date} timestamp - 通知に含める日時（積込完了時刻）
 * @returns {boolean} 通知成功時はtrue、失敗時はfalse
 */
function sendNotification(担当者名, timestamp) {
  // 📌 スクリプトプロパティからLINEのトークンを取得
  const token = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
  if (!token) return false; // トークン未設定時はスキップ

  // 📆 時刻をフォーマット（日本時間、HH:mm:ss）
  const formattedTime = Utilities.formatDate(timestamp, "Asia/Tokyo", "HH:mm:ss");

  // ✉️ 通知内容のメッセージ
  const message = `📦 積み込み完了通知\n担当者: ${担当者名}\n時刻: ${formattedTime}`;

  try {
    // 📦 LINE Messaging API 用のリクエストボディ
    const payload = JSON.stringify({
      messages: [{ type: "text", text: message }]
    });

    // 🚀 LINE API にPOST送信
    const response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      payload: payload,
      muteHttpExceptions: true // エラーがあっても throw しない（後でチェック）
    });

    // ✅ レスポンス判定（成功コード or "ok" 含むか）
    const code = response.getResponseCode();
    const body = response.getContentText();
    return code < 400 || body.toLowerCase().includes('"message":"ok"');

  } catch (error) {
    // ❌ エラー時はログを残さず false を返す（必要に応じてLoggerで補足可能）
    return false;
  }
}

