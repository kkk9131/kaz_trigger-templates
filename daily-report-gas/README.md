📝 進捗管理通知テンプレート  
Google スプレッドシート上のチェック操作から  
LINE 通知＋月次シート記録を自動化するテンプレートです。  
複数現場対応・最終確認後の一括リセットにも対応しています。

---

🔧 機能一覧  
✅ チェックボックスで作業完了通知（LINEに送信）  
✅ 完了時刻を自動記録  
✅ 月別シートに作業履歴を記録（重複チェックあり）  
✅ 「最終確認」で関連シートを一括リセット  
✅ テスト通知／トークン登録もワンクリックで可能  

---

📁 ファイル構成（VSCode管理）

| ファイル名                  | 役割                                  |
|-----------------------------|---------------------------------------|
| main_progressCheck.gs       | チェックで処理開始する onEdit トリガー本体 |
| common_notifyAndRecord.gs   | LINE通知・記録・リセットなど共通処理     |
| setup_functions.gs          | トークン設定・トリガー登録・テスト通知など初期設定系 |

---

🚀 導入手順（初回）

```bash
npm install -g @google/clasp         # clasp が未導入なら実行
clasp login                          # Googleアカウント認証
mkdir progress-check-gas && cd $_   # プロジェクトフォルダ作成
clasp create --type sheets --title "進捗管理通知テンプレ"
次に .gs ファイルを3つ作成し、コードを貼り付けて clasp push：
clasp push      # GAS に反映
clasp open      # スクリプトエディタを開く
🔐 初期設定（LINE連携）
	1.	LINE Developers で Messaging API トークンを取得
	2.	setup_functions.gs の setLineToken() に貼り付け
	3.	スクリプトエディタで setLineToken() を実行

⸻

✅ 運用フロー（現場作業）
	•	📋 D6セルにチェックを入れる
	•	✅ LINEに作業完了を自動通知
	•	📅 月別シートに記録（シートがなければ自動生成）
	•	🧹 「最終確認」なら、複数シートを一括初期化

⸻

💡 カスタマイズ例
	•	担当者ごとに通知先を分岐（LINE IDごとの配信）
	•	チェック時に Google Docs 報告書を自動生成
	•	複数現場シート対応（スプレッドシートを分割運用）

⸻

📝 ライセンス／利用条件
	•	社内利用・カスタマイズ自由
	•	クレジット不要・報告不要
	•	改造・派生プロジェクトもOK！

⸻

Created by Kaz_Trigger
