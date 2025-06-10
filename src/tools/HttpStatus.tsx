import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Info, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
  details: string;
}

const HttpStatus: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const statusCodes: StatusCode[] = [
    // 1xx 信息响应
    { code: 100, name: 'Continue', description: '继续', category: '1xx', details: '服务器已接收到请求头，客户端应继续发送请求体。' },
    { code: 101, name: 'Switching Protocols', description: '切换协议', category: '1xx', details: '服务器正在切换协议，根据客户端的请求。' },
    { code: 102, name: 'Processing', description: '处理中', category: '1xx', details: '服务器已接收并正在处理请求，但尚无响应可用。' },

    // 2xx 成功响应
    { code: 200, name: 'OK', description: '成功', category: '2xx', details: '请求成功。响应的信息取决于所使用的方法。' },
    { code: 201, name: 'Created', description: '已创建', category: '2xx', details: '请求成功并且服务器创建了新的资源。' },
    { code: 202, name: 'Accepted', description: '已接受', category: '2xx', details: '服务器已接受请求，但尚未处理。' },
    { code: 203, name: 'Non-Authoritative Information', description: '非权威信息', category: '2xx', details: '服务器成功处理了请求，但返回的信息可能来自另一来源。' },
    { code: 204, name: 'No Content', description: '无内容', category: '2xx', details: '服务器成功处理了请求，但不需要返回任何实体内容。' },
    { code: 205, name: 'Reset Content', description: '重置内容', category: '2xx', details: '服务器成功处理了请求，且没有返回任何内容。' },
    { code: 206, name: 'Partial Content', description: '部分内容', category: '2xx', details: '服务器已经成功处理了部分 GET 请求。' },

    // 3xx 重定向
    { code: 300, name: 'Multiple Choices', description: '多种选择', category: '3xx', details: '请求的资源有一系列可供选择的回馈信息。' },
    { code: 301, name: 'Moved Permanently', description: '永久移动', category: '3xx', details: '请求的资源已被永久的移动到新URI。' },
    { code: 302, name: 'Found', description: '临时移动', category: '3xx', details: '请求的资源现在临时从不同的URI响应请求。' },
    { code: 303, name: 'See Other', description: '查看其他位置', category: '3xx', details: '对应当前请求的响应可以在另一个URI上被找到。' },
    { code: 304, name: 'Not Modified', description: '未修改', category: '3xx', details: '资源未被修改，可以使用缓存的版本。' },
    { code: 305, name: 'Use Proxy', description: '使用代理', category: '3xx', details: '被请求的资源必须通过指定的代理才能被访问。' },
    { code: 307, name: 'Temporary Redirect', description: '临时重定向', category: '3xx', details: '请求的资源临时从不同的URI响应请求。' },
    { code: 308, name: 'Permanent Redirect', description: '永久重定向', category: '3xx', details: '请求的资源已被永久移动到新的URI。' },

    // 4xx 客户端错误
    { code: 400, name: 'Bad Request', description: '错误请求', category: '4xx', details: '服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。' },
    { code: 401, name: 'Unauthorized', description: '未授权', category: '4xx', details: '请求要求用户的身份认证。' },
    { code: 402, name: 'Payment Required', description: '需要付款', category: '4xx', details: '该状态码是为了将来可能的需求而预留的。' },
    { code: 403, name: 'Forbidden', description: '禁止访问', category: '4xx', details: '服务器理解请求客户端的请求，但是拒绝执行此请求。' },
    { code: 404, name: 'Not Found', description: '未找到', category: '4xx', details: '请求失败，请求所希望得到的资源未被在服务器上发现。' },
    { code: 405, name: 'Method Not Allowed', description: '方法不被允许', category: '4xx', details: '请求行中指定的请求方法不能被用于请求相应的资源。' },
    { code: 406, name: 'Not Acceptable', description: '不可接受', category: '4xx', details: '请求的资源的内容特性无法满足请求头中的条件。' },
    { code: 407, name: 'Proxy Authentication Required', description: '需要代理授权', category: '4xx', details: '与401响应类似，只不过客户端必须在代理服务器上进行身份验证。' },
    { code: 408, name: 'Request Timeout', description: '请求超时', category: '4xx', details: '请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。' },
    { code: 409, name: 'Conflict', description: '冲突', category: '4xx', details: '由于和被请求的资源的当前状态之间存在冲突，请求无法完成。' },
    { code: 410, name: 'Gone', description: '已删除', category: '4xx', details: '被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。' },
    { code: 411, name: 'Length Required', description: '需要有效长度', category: '4xx', details: '服务器拒绝在没有定义 Content-Length 头的情况下接受请求。' },
    { code: 412, name: 'Precondition Failed', description: '先决条件失败', category: '4xx', details: '服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。' },
    { code: 413, name: 'Payload Too Large', description: '请求实体过大', category: '4xx', details: '服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。' },
    { code: 414, name: 'URI Too Long', description: 'URI过长', category: '4xx', details: '请求的URI长度超过了服务器能够解释的长度。' },
    { code: 415, name: 'Unsupported Media Type', description: '不支持的媒体类型', category: '4xx', details: '请求中提交的实体并不是服务器中所支持的格式。' },
    { code: 416, name: 'Range Not Satisfiable', description: '请求范围不符合要求', category: '4xx', details: '如果请求中包含了 Range 请求头，并且 Range 中指定的任何数据范围都与当前资源的可用范围不重合。' },
    { code: 417, name: 'Expectation Failed', description: '期望失败', category: '4xx', details: '服务器无法满足 Expect 的请求头信息。' },
    { code: 418, name: "I'm a teapot", description: '我是茶壶', category: '4xx', details: '这是一个愚人节玩笑，定义于RFC 2324。' },
    { code: 421, name: 'Misdirected Request', description: '错误指向的请求', category: '4xx', details: '该请求针对的是无法产生响应的服务器。' },
    { code: 422, name: 'Unprocessable Entity', description: '无法处理的实体', category: '4xx', details: '请求格式正确，但是由于含有语义错误，无法响应。' },
    { code: 423, name: 'Locked', description: '已锁定', category: '4xx', details: '当前资源被锁定。' },
    { code: 424, name: 'Failed Dependency', description: '失败的依赖', category: '4xx', details: '由于之前的某个请求发生的错误，导致当前请求失败。' },
    { code: 425, name: 'Too Early', description: '太早', category: '4xx', details: '服务器拒绝处理在Early Data中的请求。' },
    { code: 426, name: 'Upgrade Required', description: '需要升级', category: '4xx', details: '客户端应当切换到TLS/1.0。' },
    { code: 428, name: 'Precondition Required', description: '要求先决条件', category: '4xx', details: '原服务器要求该请求满足一定条件。' },
    { code: 429, name: 'Too Many Requests', description: '请求过多', category: '4xx', details: '用户在给定的时间内发送了太多的请求。' },
    { code: 431, name: 'Request Header Fields Too Large', description: '请求头字段太大', category: '4xx', details: '服务器不愿处理请求，因为一个或多个头字段过大。' },
    { code: 451, name: 'Unavailable For Legal Reasons', description: '因法律原因不可用', category: '4xx', details: '该请求因法律原因不可用。' },

    // 5xx 服务器错误
    { code: 500, name: 'Internal Server Error', description: '内部服务器错误', category: '5xx', details: '服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。' },
    { code: 501, name: 'Not Implemented', description: '尚未实施', category: '5xx', details: '服务器不支持当前请求所需要的某个功能。' },
    { code: 502, name: 'Bad Gateway', description: '错误网关', category: '5xx', details: '作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。' },
    { code: 503, name: 'Service Unavailable', description: '服务不可用', category: '5xx', details: '由于临时的服务器维护或者过载，服务器当前无法处理请求。' },
    { code: 504, name: 'Gateway Timeout', description: '网关超时', category: '5xx', details: '作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器收到响应。' },
    { code: 505, name: 'HTTP Version Not Supported', description: 'HTTP版本不受支持', category: '5xx', details: '服务器不支持，或者拒绝支持在请求中使用的HTTP版本。' },
    { code: 506, name: 'Variant Also Negotiates', description: '变体协商', category: '5xx', details: '由于服务器的内部配置错误，被请求的协商变元资源被配置为在透明内容协商中使用自己。' },
    { code: 507, name: 'Insufficient Storage', description: '存储空间不足', category: '5xx', details: '服务器无法存储完成请求所必须的内容。' },
    { code: 508, name: 'Loop Detected', description: '检测到循环', category: '5xx', details: '服务器在处理请求时陷入死循环。' },
    { code: 510, name: 'Not Extended', description: '未扩展', category: '5xx', details: '获取资源所需要的策略并没有被满足。' },
    { code: 511, name: 'Network Authentication Required', description: '需要网络认证', category: '5xx', details: '客户端需要进行身份验证才能获得网络访问权限。' }
  ];

  const categories = [
    { key: 'all', name: '全部', icon: Info },
    { key: '1xx', name: '1xx 信息', icon: Clock },
    { key: '2xx', name: '2xx 成功', icon: CheckCircle },
    { key: '3xx', name: '3xx 重定向', icon: Info },
    { key: '4xx', name: '4xx 客户端错误', icon: AlertTriangle },
    { key: '5xx', name: '5xx 服务器错误', icon: XCircle }
  ];

  const filteredStatusCodes = statusCodes.filter(status => {
    const matchesSearch = searchTerm === '' || 
      status.code.toString().includes(searchTerm) ||
      status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || status.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (category: string): string => {
    switch (category) {
      case '1xx': return 'bg-blue-50 border-blue-200 text-blue-800';
      case '2xx': return 'bg-green-50 border-green-200 text-green-800';
      case '3xx': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case '4xx': return 'bg-red-50 border-red-200 text-red-800';
      case '5xx': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.key === category);
    if (categoryData) {
      const IconComponent = categoryData.icon;
      return <IconComponent size={20} />;
    }
    return <Info size={20} />;
  };

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">HTTP 状态码查询</h1>
            <p className="text-xl text-gray-600">
              查询 HTTP 状态码的含义和详细说明
            </p>
          </div>

          {/* 搜索和筛选 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索状态码、名称或描述..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* 类别筛选 */}
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors whitespace-nowrap ${
                        selectedCategory === category.key
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <IconComponent size={16} />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* 状态码列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {filteredStatusCodes.length > 0 ? (
              filteredStatusCodes.map((status, index) => (
                <motion.div
                  key={status.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-6 rounded-lg border-2 ${getStatusColor(status.category)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(status.category)}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold font-mono">{status.code}</span>
                          <span className="text-lg font-semibold">{status.name}</span>
                          <span className="text-base text-gray-600">({status.description})</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{status.details}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status.category === '1xx' ? 'bg-blue-100 text-blue-800' :
                      status.category === '2xx' ? 'bg-green-100 text-green-800' :
                      status.category === '3xx' ? 'bg-yellow-100 text-yellow-800' :
                      status.category === '4xx' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {status.category}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Search size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-xl text-gray-600">未找到匹配的状态码</p>
                <p className="text-gray-500 mt-2">尝试调整搜索条件或选择不同的类别</p>
              </div>
            )}
          </motion.div>

          {/* 统计信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">状态码统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.slice(1).map(category => {
                const count = statusCodes.filter(status => status.category === category.key).length;
                const IconComponent = category.icon;
                return (
                  <div key={category.key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <IconComponent size={24} className="text-gray-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{category.name}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">HTTP 状态码说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">状态码分类</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>
                    <strong>1xx 信息响应:</strong> 接收的请求正在处理
                    <br />
                    <span className="text-xs text-gray-500">服务器收到请求，需要请求者继续执行操作</span>
                  </li>
                  <li>
                    <strong>2xx 成功:</strong> 请求正常处理完毕
                    <br />
                    <span className="text-xs text-gray-500">操作被成功接收并处理</span>
                  </li>
                  <li>
                    <strong>3xx 重定向:</strong> 需要进行附加操作以完成请求
                    <br />
                    <span className="text-xs text-gray-500">需要进一步的操作以完成请求</span>
                  </li>
                  <li>
                    <strong>4xx 客户端错误:</strong> 请求有语法错误或请求无法实现
                    <br />
                    <span className="text-xs text-gray-500">请求包含语法错误或无法完成请求</span>
                  </li>
                  <li>
                    <strong>5xx 服务器错误:</strong> 服务器处理请求出现错误
                    <br />
                    <span className="text-xs text-gray-500">服务器在处理请求的过程中发生了错误</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">常见状态码</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• <strong>200 OK:</strong> 请求成功</li>
                  <li>• <strong>301 Moved Permanently:</strong> 永久重定向</li>
                  <li>• <strong>400 Bad Request:</strong> 请求语法错误</li>
                  <li>• <strong>401 Unauthorized:</strong> 需要身份验证</li>
                  <li>• <strong>403 Forbidden:</strong> 服务器拒绝请求</li>
                  <li>• <strong>404 Not Found:</strong> 资源未找到</li>
                  <li>• <strong>500 Internal Server Error:</strong> 服务器内部错误</li>
                  <li>• <strong>502 Bad Gateway:</strong> 网关错误</li>
                  <li>• <strong>503 Service Unavailable:</strong> 服务不可用</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HttpStatus;