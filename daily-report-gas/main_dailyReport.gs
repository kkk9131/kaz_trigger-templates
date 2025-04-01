/**
 * ✅ 特定セル（進捗管理シートのD6）がチェックされたら通知・記録・初期化を行う
 */
function onEdit(e) {
  const sheetName = '進捗管理'; // 対象シート名
  const checkCol = 4; // チェック対象：D列（4列目）
  const checkRow = 6; // チェック対象：6行目（D6）
  const timeCol = 5; // チェック時刻記録用：E列（5列目）
  const notifiedCol = 6; // 通知済ステータス記録：F列（6列目）

  const sheet = e.source.getSheetByName(sheetName); // 対象シート
  const activeSheet = e.source.getActiveSheet(); // 実際に編集されたシート
  const range = e.range; // 編集されたセルの範囲

  // ✅ 編集対象が「進捗管理シート」の「D6」でなければ処理終了
  if (!activeSheet || activeSheet.getName() !== sheetName) return;
  if (range.getColumn() !== checkCol || range.getRow() !== checkRow) return;

  // ✅ チェックボックスがONのときだけ処理実行
  const checkboxValue = range.getValue();
  if (checkboxValue !== true) return;

  const row = range.getRow(); // = 6
  const taskName = sheet.getRange(row, 1).getValue(); // A列：作業名（例："最終確認"）
  const notified = sheet.getRange(row, notifiedCol).getValue(); // 通知済みかどうか
  const sheetNameLabel = sheet.getName(); // シート名（ログに使える）

  // ✅ 通知がまだされていない場合のみ通知処理
  if (notified !== "通知済") {
    const timestamp = new Date();
    
    // 🕒 チェック時刻をE列に記録
    sheet.getRange(row, timeCol).setValue(timestamp);

    // ✉️ LINE通知送信（成功時のみ処理継続）
    if (sendLineNotification(taskName, sheetNameLabel)) {
      sheet.getRange(row, notifiedCol).setValue("通知済"); // ✅ 通知済ステータスに変更
      recordToMonthlySheet(taskName, timestamp); // 📅 月次ログへ記録

      // 🔁 特定の作業名（最終確認）なら関連シートを初期化
      if (taskName === "最終確認") {
        const sheetsToReset = ["現場情報", "リーダー指示書", "アシスタント指示書", "進捗管理"];
        resetMultipleSheets(sheetsToReset); // 複数シートを一括リセット
      }
    }
  }
}
