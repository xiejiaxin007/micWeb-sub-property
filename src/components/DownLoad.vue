<!--
 * @author: xiejiaxin
 * @Date: 2020-11-21 15:01:17
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-06 11:20:21
 * @description: oss下载组件
-->
<template>
    <div class="download-wrapper">
        <!-- 对下载样式不做处理 -->
        <div @click="ossDownloadFile">
            <slot name="trigger"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'download',
    props: {
        // 要下载的内容的-url（半路径）、文件名称
        file: {
            type: [Object, Array],
            required: true
        },
        // 是否批量下载
        multiple: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 文件下载并且重命名
        async ossDownloadFile() {
            const { client } = await this.createOssClient();
            if (!client) return false;
            // 批量下载
            let url = '';
            if (this.multiple && Array.isArray(this.file)) {
                // 使用公共方法
                this.file.forEach((item) => {
                    // 更改名字
                    url = this.downloadUrl(client, item.name, item.ext, item.url);
                    this.downloadFile(url);
                });
            } else if (!Array.isArray(this.file)) {
                // 单选并且是对象
                url = this.downloadUrl(client, this.file.name, this.file.ext, this.file.url);
                // 如果url不是空，则不进行跳转
                if (url) window.location.href = url;
            } else {
                console.log('组件传参错误');
            }
            // 暴露成功函数
            this.$emit('success');
		},
		// js动态创建iframe进行文件下载
        downloadFile(url) {
            //下载文件方法
			const iframe = document.createElement('iframe');
			// 防止影响页面
            iframe.style.display = 'none';
            iframe.style.height = 0;
			iframe.src = url;
			// iframe挂在到dom树上才会发请求
			document.body.appendChild(iframe);
			// 移除iframe
            setTimeout(() => {
                iframe.remove();
            }, 5 * 60 * 1000);
        }
    }
};
</script>