/*
 * @author: xiejiaxin
 * @Date: 2021-01-20 17:39:01
 * @LastEditors: kangxue
 * @LastEditTime: 2021-03-18 17:13:30
 * @description: 初始化map
 */
const map = {
    loadBMap() {
        return new Promise((resolve, reject) => {
            // 检查是否存在BMap对象
            if (typeof BMap !== 'undefined') {
                resolve(BMap);
                return true;
            }
            window.onBMapCallback = function () {
                resolve(BMap);
            }
            // 动态生成script标签
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.setAttribute('id', 'mapScript');
            script.src = `//api.map.baidu.com/api?v=3.0&ak=MACS7AerwZBS2G7cUIX1kyIGKYgg1oXH&callback=onBMapCallback`;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    },
    // 删除多余script，因为可能会出现多个地图组件同时渲染的情况 2021 01 11 174932
    deleteSameScript() {
        const scriptList = document.body.getElementsByTagName('script');
        const scripts = scriptList.length > 0 ? Array.from(scriptList) : [];
        const targetScript = scripts.filter(v => v.getAttribute('data-map') === 'map-tag');
        let len = targetScript.length;
        targetScript.forEach((item, index) => {
            if (index < len - 1) {
                item.remove();
            }
        });
    },
    loadMap() {
        return new Promise((resolve, reject) => {
            if (typeof BMap !== 'undefined') {
                resolve(BMap);
                return true;
            }
            let script = document.createElement('script');
            window.BMAP_PROTOCOL = window.location.protocol.split(':')[0];
            window.BMap_loadScriptTime = (new Date).getTime();
            script.type = 'text/javascript';
            // 设置一个自定义属性，方便查找
            script.setAttribute('data-map', 'map-tag');
            script.src = `//api.map.baidu.com/getscript?v=3.0&ak=MACS7AerwZBS2G7cUIX1kyIGKYgg1oXH&services=&t=20210111174932`;
            script.onerror = reject;
            if (script.addEventListener) {
                script.addEventListener('load', () => {
                    // 判断当前加载地图的script标签有几个，只留下一个
                    this.deleteSameScript();
                    resolve(BMap);
                }, false);
            } else if (script.attachEvent) {
                script.attachEvent('onreadystatechange', (e) => {
                    var target = e.target || e.srcElement
                    if (target.readyState == 'loaded') {
                        this.deleteSameScript();
                        resolve(BMap);
                    }
                });
            }
            document.body.appendChild(script);
        })
    }
};
export default map;
