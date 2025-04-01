function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // 📌 設定値（行・列の位置）
  const checkStartRow = 2; // チェック開始行
  const checkEndRow = 110; // チェック終了行
  const checkCol = 4; // チェック欄（D列）
  const valueCol = 3; // 項目の有無（C列）
  const completeCheckRow = 113; // 完了欄（行）
  const completeCheckCol = 2; // 完了チェック列（B列）
  const nameCol = 3; // 担当者名（C列）
  const timeCol = 4; // タイムスタンプ記録列（D列）
  const templateCheckCol = 1; // テンプレ複製チェック列（A列）
  const templateCheckRow = 113; // テンプレ複製チェック行

  const prop = PropertiesService.getScriptProperties();
  if (prop.getProperty("isDuplicating") === "true") return; // 📛 複製中は処理をスキップ（競合防止）

  // ✅ 1. チェック欄が更新されたとき → 完了チェックをリセット
  if (range.getRow() >= checkStartRow && range.getRow() <= checkEndRow && range.getColumn() === checkCol) {
    let allChecked = true;
    for (let i = checkStartRow; i <= checkEndRow; i++) {
      const required = sheet.getRange(i, valueCol).getValue(); // 対象項目あり？
      const isChecked = sheet.getRange(i, checkCol).getValue(); // チェック済み？
      if (required !== "" && required !== null && isChecked !== true) {
        allChecked = false;
        break;
      }
    }
    if (!allChecked) {
      // ✅ 未完了なら、完了チェックを外す＆時刻をクリア
      sheet.getRange(completeCheckRow, completeCheckCol).setValue(false);
      sheet.getRange(completeCheckRow, timeCol).clearContent();
    }
  }

  // ✅ 2. 完了チェック（B113）が押されたとき
  if (
    range.getRow() === completeCheckRow &&
    range.getColumn() === completeCheckCol &&
    range.getValue() === true
  ) {
    let allChecked = true;
    for (let i = checkStartRow; i <= checkEndRow; i++) {
      const required = sheet.getRange(i, valueCol).getValue();
      const isChecked = sheet.getRange(i, checkCol).getValue();
      if (required !== "" && required !== null && isChecked !== true) {
        allChecked = false;
        break;
      }
    }

    if (allChecked) {
      // ✅ 全てチェック済み → 通知＋タイムスタンプ＋リセット
      const 担当者名 = sheet.getRange(completeCheckRow, nameCol).getValue();
      const timestamp = new Date();
      sheet.getRange(completeCheckRow, timeCol).setValue(timestamp);

      const success = sendNotification(担当者名, timestamp);
      if (success) {
        // ✔ チェック欄・完了欄を初期化
        sheet.getRange(checkStartRow, checkCol, checkEndRow - checkStartRow + 1, 1).clearContent();
        sheet.getRange(completeCheckRow, completeCheckCol, 1, 3).clearContent();
      }
    } else {
      // ❗ チェックが未完了 → アラートを表示して完了チェックを戻す
      sheet.getRange(completeCheckRow, completeCheckCol).setValue(false);
      SpreadsheetApp.getUi().alert("まだ積み込みチェックが完了していません！");
    }
  }

  // ✅ 3. A113にチェック → シートをテンプレートから複製
  if (
    range.getRow() === templateCheckRow &&
    range.getColumn() === templateCheckCol &&
    range.getValue() === true
  ) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const date = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd");
    const baseName = `${date}_積込`;
    let count = 1;

    // ✅ 同名シートが存在しない連番名を探す
    while (ss.getSheetByName(`${baseName}_${count}`)) {
      count++;
    }
    const newName = `${baseName}_${count}`;

    // ✅ フラグON（複製中）
    prop.setProperty("isDuplicating", "true");

    // ✅ 現在のシートを複製し、新しいシート名をつける
    const beforeSheets = ss.getSheets().map(s => s.getSheetId());
    sheet.copyTo(ss);
    const afterSheets = ss.getSheets();
    const newSheet = afterSheets.find(s => !beforeSheets.includes(s.getSheetId()));

    if (newSheet) {
      newSheet.setName(newName);
      ss.setActiveSheet(newSheet);
      SpreadsheetApp.getUi().alert(`📄 新しいシート「${newName}」を作成しました！`);
    }

    // ✅ フラグOFF＋チェックを自動解除
    prop.deleteProperty("isDuplicating");
    sheet.getRange(templateCheckRow, templateCheckCol).setValue(false);
  }
}
