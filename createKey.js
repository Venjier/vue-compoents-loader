import crypto from 'node:crypto'

const algorithm = 'aes-256-cbc'; // 加密算法

const key = crypto.randomBytes(32); // 生成一个 256 位的随机密钥

const iv = crypto.randomBytes(16); // 生成一个 128 位的随机初始向量

const keyStr = key.toString('hex')
const ivStr = iv.toString('hex')

console.log('key是', key.toString('hex'))
console.log('iv是', iv.toString('hex'))