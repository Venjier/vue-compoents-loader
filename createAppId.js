import crypto from 'node:crypto'
import {config} from './index.js'

const algorithm = 'aes-256-cbc'; // 加密算法


const time = parseInt(process.argv[2])

if (isNaN(time)) {
    throw new Error('输入的时间戳不合法')
}

const cipher = crypto.createCipheriv(algorithm, Buffer.from(config.key, 'hex'), Buffer.from(config.iv, 'hex'));

const data = `{"time":${time}}`;
let encryptedData = cipher.update(data, 'utf8', 'hex');
encryptedData += cipher.final('hex');

console.log('密文是', encryptedData)

const decipher = crypto.createDecipheriv(algorithm, Buffer.from(config.key, 'hex'), Buffer.from(config.iv, 'hex'));
let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
decryptedData += decipher.final('utf8');

console.log('测试解密得到明文', decryptedData)