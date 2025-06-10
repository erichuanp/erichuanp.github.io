export interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  toolPath?: string;
}

export interface ToolCategory {
  title: string;
  tools: Tool[];
}

const toolsData: { [key: string]: { name: string; description: string; toolPath?: string }[] } = {
  '文本处理工具': [
    {
      name: 'JSON 格式化器',
      description: '美化和压缩 JSON 数据，验证 JSON 语法错误',
      toolPath: '/tools/json-formatter'
    },
    {
      name: 'Base64 编码解码器',
      description: '文本与 Base64 格式之间的相互转换工具',
      toolPath: '/tools/base64-converter'
    },
    {
      name: 'URL 编码解码器',
      description: '处理 URL 参数的编码和解码操作',
      toolPath: '/tools/url-converter'
    },
    {
      name: 'Markdown 预览器',
      description: '实时预览 Markdown 文档的渲染效果',
      toolPath: '/tools/markdown-preview'
    },
    {
      name: '正则表达式测试器',
      description: '测试和验证正则表达式的匹配结果',
      toolPath: '/tools/regex-tester'
    },
    {
      name: '文本差异对比',
      description: '比较两段文本的差异并高亮显示',
      toolPath: '/tools/text-diff'
    }
  ],
  '开发者工具': [
    {
      name: '颜色选择器',
      description: 'RGB、HEX、HSL 等颜色格式转换和调色板',
      toolPath: '/tools/color-picker'
    },
    {
      name: 'CSS 生成器',
      description: '生成阴影、渐变、动画等 CSS 代码',
      toolPath: '/tools/css-generator'
    },
    {
      name: '二维码生成器',
      description: '将文本或链接转换为二维码图片',
      toolPath: '/tools/qr-generator'
    },
    {
      name: '哈希计算器',
      description: '计算文本的 MD5、SHA1、SHA256 等哈希值',
      toolPath: '/tools/hash-calculator'
    },
    {
      name: '时间戳转换器',
      description: 'Unix 时间戳与标准日期格式互相转换',
      toolPath: '/tools/timestamp-converter'
    },
    {
      name: 'UUID 生成器',
      description: '生成各种版本的唯一标识符 UUID',
      toolPath: '/tools/uuid-generator'
    }
  ],
  '计算工具': [
    {
      name: '单位转换器',
      description: '长度、重量、温度、面积等单位换算',
      toolPath: '/tools/unit-converter'
    },
    {
      name: '进制转换器',
      description: '二进制、八进制、十进制、十六进制互转',
      toolPath: '/tools/base-converter'
    },
    {
      name: '密码生成器',
      description: '根据自定义规则生成安全密码',
      toolPath: '/tools/password-generator'
    },
    {
      name: 'Lorem Ipsum 生成器',
      description: '生成用于设计和排版的占位文本',
      toolPath: '/tools/lorem-generator'
    },
    {
      name: '百分比计算器',
      description: '计算百分比、增长率、折扣等',
      toolPath: '/tools/percentage-calculator'
    }
  ],
  '图片工具': [
    {
      name: '图片压缩器',
      description: '在浏览器中压缩图片文件大小',
      toolPath: '/tools/image-compressor'
    },
    {
      name: '图片格式转换',
      description: 'JPEG、PNG、WebP 等格式互相转换',
      toolPath: '/tools/image-converter'
    },
    {
      name: '图片尺寸调整',
      description: '批量调整图片的宽度和高度',
      toolPath: '/tools/image-resizer'
    },
    {
      name: '图片滤镜',
      description: '为图片添加各种视觉效果和滤镜',
      toolPath: '/tools/image-filter'
    }
  ],
  '网络工具': [
    {
      name: 'IP 地址查询',
      description: '查询 IP 地址的地理位置和网络信息',
      toolPath: '/tools/ip-lookup'
    },
    {
      name: 'User Agent 解析',
      description: '解析和分析浏览器 User Agent 字符串',
      toolPath: '/tools/user-agent-parser'
    },
    {
      name: 'HTTP 状态码查询',
      description: '查询 HTTP 状态码的含义和说明',
      toolPath: '/tools/http-status'
    }
  ]
};

export const generateCategorizedTools = (): ToolCategory[] => {
  const categories: ToolCategory[] = [];
  let toolId = 1;

  Object.entries(toolsData).forEach(([categoryTitle, tools]) => {
    const categoryTools: Tool[] = tools.map(tool => ({
      id: toolId++,
      name: tool.name,
      description: tool.description,
      category: categoryTitle,
      toolPath: tool.toolPath
    }));

    categories.push({
      title: categoryTitle,
      tools: categoryTools
    });
  });

  return categories;
};

// 保持向后兼容的函数
export const generateTools = (count: number = 28): Tool[] => {
  const categories = generateCategorizedTools();
  const allTools: Tool[] = [];
  
  categories.forEach(category => {
    allTools.push(...category.tools);
  });
  
  return allTools.slice(0, count);
};