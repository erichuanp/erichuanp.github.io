# GitLab Tutorial
GitLab 是一个在生产环境中维护代码、控制版本的必要工具。为多人协作提供了更多可能。
## 注册 GitLab
- 访问公司 GitLab 以注册

## 添加密钥
1. 打开电脑的终端，输入以下命令复制公钥内容 
    ```bash
    ssh-keygen # 生成密钥无需填入内容，按Enter即可
    cat ~/.ssh/id_ed25519.pub # 复制.pub内容
    ```
2. 在 Gitlab 中，点击头像 -> 偏好设置 -> 左边导航栏的 SSH 密钥 -> 添加新密钥
3. 填入前面复制的公钥内容 -> 将到期时间设置为合理的时间 -> 添加密钥
- **注意**：每个系统都需要添加一次公钥。例如：小P的Windows电脑设置好了公钥，可他的WSL没有设置，他在Windows下的终端中访问Gitlab SSH是可以不需要输入密码的，可他却不能在WSL下的终端访问Gitlab SSH。因此他需要在他的WSL里重新添加一次密钥。

## 下载代码
1. 安装 [Git](https://git-scm.com/)
2. 设置 Git 的用户名和邮箱
    ```bash
    git config --global user.name "这里填写你的用户名"
    git config --global user.email "这里填写你的邮箱"
    ```
3. 访问公司 GitLab 
4. 点击左边导航栏的 Projects(项目)，点击选择一个仓库，如果没有内容，请联系公司管理员
5. 点击右上角的蓝色按钮 代码 ，使用SSH克隆，复制链接
6. `cd` 进入电脑中一块风水宝地文件夹里(例如：~/Projects)，执行以下命令：
    ```bash
    git clone 这里填入刚刚复制的ssh链接
    ```
7. `cd` 进入项目文件夹

## 使用 VS Code 与 Git 管理项目版本
1. 下载安装 [Visual Studio Code](https://code.visualstudio.com/)
2. 在使用终端进入项目文件夹后，执行 `code .` 即可用 Visual Studio Code 打开项目文件夹了
3. 点击左侧导航栏的源代码管理即可查看该项目的过去版本

### 将 远程仓库 同步到 本地仓库 中
1. 流程：Fetch + Pull
2. 在源代码管理中，左下角的图形模块中，上方的有数个按钮，其中：
    1. Fetch From All Remotes：意为 将远程仓库同步到本地的仓库中但不更新本地仓库的版本
    2. Pull 意为 将远程仓库的版本同步到本地仓库的版本
- **注意**：在生产环境中，通常需要先把远程仓库的版本 Fetch + Pull 到本地后，再进行编辑
### 将 本地仓库 同步到 远程仓库 中
1. 流程：输入备注信息 + 添加已修改的文件 + Commit  + Push
2. 在源代码管理中，左上角的源代码管理模块中，有若干按钮：
    1. 消息输入框：输入备注信息（必填）
    2. 提交/Commit：将 一个 Commit 推送到本地仓库中
    3. 推送/Push：按下提交后，可以将本地仓库的Commits推送到远程仓库
    4. 更改 或 每个文件 的右边有 U形箭头 按钮，Discard (All) Changes 意为 撤回 所有文件 或 该文件 的修改
    5. 更改 或 每个文件 的右边有 + 按钮，Stage (All) Changes 意为 将 所有文件 或 该文件 添加到已修改的文件中
- **注意**：由 已修改的文件 + 备注信息 组成的版本，我们称之为一个Commit。本地仓库可以提交多个Commits后再一次性Push到远程仓库

### 额外内容
- 在 VS Code 中的图形操作对应的终端命令为：`git fetch`, `git pull`, `git add 文件1 文件2` or `git add .`, `git commit -m "这里输入备注信息"`, `git push`
- 切换分支 `git checkout` 分支名字
- 检查远程仓库的链接 `git remote -v`
- 移除远程仓库的链接 `git remote remove origin`，添加远程仓库的链接 `git remote add origin` 这里填远程仓库链接
- `git clone` 这里填远程仓库链接 填入SSH链接时，需要 Gitlab 账户里存在电脑的公钥；填入HTTPS链接时，需要输入 Gitlab 账户的账号和密码