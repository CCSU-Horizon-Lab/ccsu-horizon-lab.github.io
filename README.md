# CCSU-Horizon-Lab.github.io

长大 Horizon 全栈实验室的 GitHub Pages 主页。

## 本地预览

```bash
bundle install
bundle exec jekyll serve
```

打开 `http://127.0.0.1:4000` 查看页面。

## 发布

1. 在 GitHub 新建仓库 `CCSU-Horizon-Lab.github.io`。
2. 把本目录内容推送到仓库 `main` 分支。
3. 进入仓库 Settings -> Pages，选择 `Deploy from a branch`，分支选择 `main`，目录选择 `/root`。
4. 等待 Actions/Pages 构建完成后访问 `https://CCSU-Horizon-Lab.github.io`。
