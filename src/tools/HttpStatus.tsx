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
    { code: 204, name: 'No Content', description: '无内容', category: '2xx', details: '服务器成功处理了请求，但不需要返回任何实体内容。' },
    { code: 206, name: 'Partial Content', description: '部分内容', category: '2xx', details: '服务器已经成功处理了部分 GET 请求。' },

    // 3xx 重定向
    { code: 300, name: 'Multiple Choices', description: '多种选择', category: '3xx', details: '请求的资源有一系列可供选择的回馈信息。' },
    { code: 301, name: 'Moved Permanently', description: '永久移动', category: '3xx', details: '请求的资源已被永久的移动到新URI。' },
    { code: 302, name: 'Found', description: '临时移动', category: '3xx', details: '请求的资源现在临时从不同的URI响应请求。' },
    { code: 304, name: 'Not Modified', description: '未修改', category: '3xx', details: '资源未被修改，可以使用缓存的版本。' },
    { code: 307, name: 'Temporary Redirect', description: '临时重定向', category: '3xx', details: '请求的资源临时从不同的URI响应请求。' },
    { code: 308, name: 'Permanent Redirect', description: '永久重定向', category: '3xx', details: '请求的资源已被永久移动到新的URI。' },

    // 4xx 客户端错误
    { code: 400, name: 'Bad Request', description: '错误请求', category: '4xx', details: '服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。' },
    { code: 401, name: 'Unauthorized', description: '未授权', category: '4xx', details: '请求要求用户的身份认证。' },
    { code: 403, name: 'Forbidden', description: '禁止访问', category: '4xx', details: '服务器理解请求客户端的请求，但是拒绝执行此请求。' },
    { code: 404, name: 'Not Found', description: '未找到', category: '4xx', details: '请求失败，请求所希望得到的资源未被在服务器上发现。' },
    { code: 405, name: 'Method Not Allowed', description: '方法不被允许', category: '4xx', details: '请求行中指定的请求方法不能被用于请求相应的资源。' },
    { code: 408, name: 'Request Timeout', description: '请求超时', category: '4xx', details: '请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。' },
    { code: 409, name: 'Conflict', description: '冲突', category: '4xx', details: '由于和被请求的资源的当前状态之间存在冲突，请求无法完成。' },
    { code: 410, name: 'Gone', description: '已删除', category: '4xx', details: '被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。' },
    { code: 413, name: 'Payload Too Large', description: '请求实体过大', category: '4xx', details: '服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。' },
    { code: 414, name: 'URI Too Long', description: 'URI过长', category: '4xx', details: '请求的URI长度超过了服务器能够解释的长度。' },
    { code: 415, name: 'Unsupported Media Type', description: '不支持的媒体类型', category: '4xx', details: '请求中提交的实体并不是服务器中所支持的格式。' },
    { code: 418, name: "I'm a teapot", description: '我是茶壶', category: '4xx', details: '这是一个愚人节玩笑，定义于RFC 2324。' },
    { code: 422, name: 'Unprocessable Entity', description: '无法处理的实体', category: '4xx', details: '请求格式正确，但是由于含有语义错误，无法响应。' },
    { code: 429, name: 'Too Many Requests', description: '请求过多', category: '4xx', details: '用户在给定的时间内发送了太多的请求。' },

    // 5xx 服务器错误
    { code: 500, name: 'Internal Server Error', description: '内部服务器错误', category: '5