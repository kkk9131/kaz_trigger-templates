# 🚀 Kaz_Trigger テンプレート集（GAS × 自動化 × 発信）

「現場仕事をもっとスマートに」  
このリポジトリは、現場で実際に使える Google Apps Script（GAS）テンプレートや仕組みをまとめた、**Kaz_Trigger公式テンプレート集**です。

---

## 🔧 テンプレート一覧

| テンプレ名 | 説明 | フォルダ |
|------------|------|----------|
| 📋 [日報自動通知テンプレ](./daily-report-gas) | チェックボックスでLINE通知＋完了時刻記録＋月別整理＋リセット処理まで自動化 | `/daily-report-gas` |
| 📦 [積込チェック通知テンプレ](./packing-check-gas) | 積込チェックリストの複製＋通知機能付きテンプレ。現場で即運用できる構成 | `/packing-check-gas` |
| 🧠 [GPTプロンプト（発信用）](./gpt-prompt) | テンプレ公開をnote・Instagram・GitHubに一括展開するプロンプト集 | `/gpt-prompt` |
| 📘 Notion連携テンプレ（準備中） | 公開フローの見える化・進行管理用データベース | `/notion-template` |

---

## 📦 特徴

- ✅ すぐに使える実務テンプレ
- ✅ LINE通知、月次記録、複製、初期化などを自動化
- ✅ GAS × GitHub × GPT × Notion の連携構成
- ✅ 現場職人でも「ノーコード感覚」で導入可能

---

## 🔧 利用方法（GASテンプレ）

```bash
# claspを使った導入方法（例）
npm install -g @google/clasp
clasp login
mkdir daily-report-gas && cd $_
clasp create --type sheets --title "日報テンプレ"
# .gsファイルをコピペ → clasp push
