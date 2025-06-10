
# Conda Tutorial
Conda 是一个虚拟环境管理工具，用户可以创建多个 Conda 环境。
## 下载安装Miniconda

### Windows

1. 下载并打开 [Miniconda](https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe)
2. 勾选以下选项：
    - "Add Miniconda to my PATH environment variable"
    - "Register Miniconda as the system's default Python"
3. 选择安装位置，完成安装。
4. 验证是否安装成功：
    ```bash
    conda --version
    ```

### Ubuntu(Linux)/MacOS

1. 下载 .sh 安装文件：
    ```bash
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh  # Linux
    curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh  # MacOS
    ```
2. 运行安装脚本：
    ```bash
    chmod +x Miniconda3-latest-Linux-x86_64.sh  # Linux
    ./Miniconda3-latest-Linux-x86_64.sh

    chmod +x Miniconda3-latest-MacOSX-arm64.sh  # MacOS
    ./Miniconda3-latest-MacOSX-arm64.sh

    conda init zsh    # 或 bash，取决于你使用的 shell
    source ~/.zshrc   # 或 ~/.bashrc，取决于你

    rm Miniconda3-*.sh  # 运行完后，记得删除安装脚本
    ```

## Conda的常用命令

- 创建环境
    ```bash
    conda create -n 环境名 python=版本号
    conda env create -f 某yaml文件.yml
    ```
- 查看本机上的所有环境
    ```bash
    conda env list
    ```
- 进入 Conda 环境
    ```bash
    conda activate 环境名
    ```
- 退出 Conda 环境
    ```bash
    conda deactivate
    ```
- 删除 Conda 环境
    ```bash
    conda remove -n 环境名 --all
    ```
- 添加包
    ```bash
    conda install 包名
    conda install -c conda-forge 包名
    pip install 包名
    ```
- 查看当前环境的包
    ```bash
    conda list
    ```
- 导出 Conda 环境的 YAML 文件
    ```bash
    conda env export > 文件名.yml
    ```
