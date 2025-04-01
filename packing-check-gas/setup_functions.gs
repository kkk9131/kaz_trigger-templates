/**
 * 🔐 LINEのアクセストークンをスクリプトプロパティに保存
 * ※最初に一度だけ実行（トークンは安全な場所に保管推奨）
 */
function setLineToken() {
  const token = "ここにLINEアクセストークンを貼ってください";

  // ⚙️ プロパティに保存
  PropertiesService.getScriptProperties().setProperty('LINE_TOKEN', token);
  Logger.log("LINE_TOKENを設定しました");
}
