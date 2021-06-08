/*
 * @author: xiejiaxin
 * @Date: 2021-05-30 16:20:15
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-05-30 16:20:22
 * @description: file content
 */
(function () {
    if (window.__POWERED_BY_QIANKUN__) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-undef
            __webpack_public_path__ = `//localhost:${process.env.VUE_APP_PORT}/`;
            return;
        }
        // eslint-disable-next-line no-undef
        __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
})();