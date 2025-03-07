# Momban

---

# 概要

ブラウザで表示しているページに含まれているハイパーリンクを検査して、フィッシングを防ぐための拡張機能です。

事前に定義されている条件・ホワイトリスト設定に合致しないURLをもつハイパーリンクは無効化し、意図して（コピー&ペーストで）操作しない限りページを開けなくなるので、紛らわしいドメイン、業務で通常利用しないWebサービスに誤ってアクセスすることを防げます。

# 動作対象ページ

- mail.google.com
- outlook.office.com
- qiita.com

# 除外条件

- 開いているページとリンク先URLのオリジンが同一なら
- リンク先がルート（例：https://example.com/path/to/pageではなく、https://example.com/のように、パスがないURL）
- リンク先が、拡張機能のオプション画面から設定するホワイトリストに登録されているURLならスキップ

---

Copyright (c) 2025 YA-androidapp(https://github.com/yzkn) All rights reserved.
