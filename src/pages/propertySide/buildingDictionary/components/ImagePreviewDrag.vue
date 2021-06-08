<!--
    @name: 图集预览组件
    @description: 楼盘动销信息页面 - 图集预览组件 此组件为移植element 预览组件，将拖动添加到iamge容器，可拖拽图片，可以编辑图片遮罩层后面的内容
    @author: 贺伟
    @date: 2019-12-11
-->
<template>
    <transition name="viewer-fade">
        <div
            class="el-image-viewer__wrapper"
            :style="imgBoxstyle">
            <!-- CLOSE -->
            <span
                class="el-image-viewer__btn el-image-viewer__close"
                @click="hide">
                <i class="el-icon-circle-close" aria-hidden="true"></i>
            </span>
            <!-- ARROW -->
            <template v-if="!isSingle">
                <span
                    class="el-image-viewer__btn el-image-viewer__prev"
                    :class="{ 'is-disabled': !infinite && isFirst }"
                    @click="prev"
                >
                    <i class="el-icon-arrow-left" aria-hidden="true" />
                </span>
                <span
                    class="el-image-viewer__btn el-image-viewer__next"
                    :class="{ 'is-disabled': !infinite && isLast }"
                    @click="next"
                >
                    <i class="el-icon-arrow-right" aria-hidden="true" />
                </span>
            </template>
            <!-- ACTIONS -->
            <div class="el-image-viewer__btn el-image-viewer__actions">
                <div class="el-image-viewer__actions__inner">
                    <i
                        class="el-icon-zoom-out" 
                        aria-hidden="true"
                        @click="handleActions('zoomOut')"
                    ></i>
                    <i
                        class="el-icon-zoom-in" 
                        aria-hidden="true"
                        @click="handleActions('zoomIn')"
                    ></i>
                    <i class="el-image-viewer__actions__divider" 
                        aria-hidden="true"></i>
                    <i
                        :class="mode.icon" 
                        aria-hidden="true"
                        @click="toggleMode"
                    ></i>
                    <i class="el-image-viewer__actions__divider" 
                        aria-hidden="true"></i>
                    <i
                        class="el-icon-refresh-left" 
                        aria-hidden="true"
                        @click="handleActions('anticlocelise')"
                    ></i>
                    <i
                        class="el-icon-refresh-right" 
                        aria-hidden="true"
                        @click="handleActions('clocelise')"
                    ></i>
                </div>
            </div>
            <!-- CANVAS -->
            <div class="el-image-viewer__canvas">
                <img
                    v-for="(url, i) in urlList"
                    v-if="i === index"
                    ref="img"
                    class="el-image-viewer__img"
                    :key="url"
                    :src="currentImg"
                    :style="imgStyle"
                    @load="handleImgLoad"
                    @error="handleImgError"
                    @mousedown="handleMouseDown"
                    alt="图片">
            </div>
        </div>
    </transition>
</template>

<script>
    const isFirefox = function() {
        return window.navigator.userAgent.match(/firefox/i);
    };
    const rafThrottle = function(fn) {
        let locked = false;
        return function(...args) {
            if (locked) return;
            locked = true;
            window.requestAnimationFrame(_ => {
            fn.apply(this, args);
            locked = false;
            });
        };
    }
    /* istanbul ignore next */
    const on = (function() {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    })();

    /* istanbul ignore next */
    const off = (function() {
        return function(element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    })();
    const Mode = {
        CONTAIN: {
            name: 'contain',
            icon: 'el-icon-full-screen'
        },
        ORIGINAL: {
            name: 'original',
            icon: 'el-icon-c-scale-to-original'
        }
    };

    const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';

    export default {
        name: 'elImageViewer',
        props: {
            urlList: {
                type: Array,
                default: () => []
            },
            zIndex: {
                type: Number,
                default: 2000
            },
            onSwitch: {
                type: Function,
                default: () => {}
            },
            // 关闭函数
            onClose: {
                type: Function,
                default: () => {}
            }
        },

        data() {
            return {
                index: 0,
                isShow: false,
                infinite: true,
                loading: false,
                mode: Mode.CONTAIN,
                transform: {
                    scale: 1,
                    deg: 0,
                    offsetX: 0,
                    offsetY: 0,
                    enableTransition: false
                }
            };
        },
        computed: {
            isSingle() {
                return this.urlList.length <= 1;
            },
            isFirst() {
                return this.index === 0;
            },
            isLast() {
                return this.index === this.urlList.length - 1;
            },
            currentImg() {
                return this.urlList[this.index];
            },
            imgStyle() {
                const { scale, deg, enableTransition } = this.transform;
                const style = {
                    transform: `scale(${scale}) rotate(${deg}deg)`,
                    transition: enableTransition ? 'transform .3s' : ''
                };
                if (this.mode === Mode.CONTAIN) {
                    style.maxWidth = style.maxHeight = '100%';
                }
                return style;
            },
            imgBoxstyle() {
                const { offsetX, offsetY, enableTransition } = this.transform;
                const style = {
                    width: '400px',
                    height: '100%',
                    marginLeft: '-200px',
                    transition: enableTransition ? 'transform .3s' : '',
                    'z-index': this.zIndex,
                    'left': offsetX ? `${offsetX}px` : `50%`,
                    'top': offsetY ? `${offsetY}px` : '0'
                };
                /* if (this.mode === Mode.CONTAIN) {
                    style.maxWidth = style.maxHeight = '100%';
                } */
                return style;
            }
        },
        watch: {
            index: {
                handler: function(val) {
                    this.reset();
                    this.onSwitch(val);
                }
            },
            currentImg(val) {
                this.$nextTick(_ => {
                    const $img = this.$refs.img[0];
                    if (!$img.complete) {
                        this.loading = true;
                    }
                });
            }
        },
        methods: {
            hide() {
                this.deviceSupportUninstall();
                this.onClose();
            },
            deviceSupportInstall() {
                this._keyDownHandler = rafThrottle(e => {
                    const keyCode = e.keyCode;
                    switch (keyCode) {
                        // ESC
                        case 27:
                            this.hide();
                            break;
                        // SPACE
                        case 32:
                            this.toggleMode();
                            break;
                        // LEFT_ARROW
                        case 37:
                            this.prev();
                            break;
                        // UP_ARROW
                        case 38:
                            this.handleActions('zoomIn');
                            break;
                        // RIGHT_ARROW
                        case 39:
                            this.next();
                            break;
                        // DOWN_ARROW
                        case 40:
                            this.handleActions('zoomOut');
                            break;
                    }
                });
                this._mouseWheelHandler = rafThrottle(e => {
                    const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
                    if (delta > 0) {
                        this.handleActions('zoomIn', {
                            zoomRate: 0.015,
                            enableTransition: false
                        });
                    } else {
                        this.handleActions('zoomOut', {
                            zoomRate: 0.015,
                            enableTransition: false
                        });
                    }
                });
                on(document, 'keydown', this._keyDownHandler);
                // on(document, mousewheelEventName, this._mouseWheelHandler);
            },
            deviceSupportUninstall() {
                off(document, 'keydown', this._keyDownHandler);
                // off(document, mousewheelEventName, this._mouseWheelHandler);
                this._keyDownHandler = null;
                this._mouseWheelHandler = null;
            },
            handleImgLoad(e) {
                this.loading = false;
            },
            handleImgError(e) {
                this.loading = false;
                e.target.alt = '加载失败';
            },
            handleMouseDown(e) {
                if (this.loading || e.button !== 0) return;

                const { offsetX, offsetY } = this.transform;
                const startX = e.pageX;
                const startY = e.pageY;
                this._dragHandler = rafThrottle(ev => {
                    this.transform.offsetX = (offsetX || window.innerWidth / 2) + ev.pageX - startX;
                    this.transform.offsetY = offsetY + ev.pageY - startY;
                });
                on(document, 'mousemove', this._dragHandler);
                on(document, 'mouseup', ev => {
                    off(document, 'mousemove', this._dragHandler);
                });

                e.preventDefault();
            },
            reset() {
                this.transform = {
                    scale: 1,
                    deg: 0,
                    offsetX: 0,
                    offsetY: 0,
                    enableTransition: false
                };
            },
            toggleMode() {
                if (this.loading) return;

                const modeNames = Object.keys(Mode);
                const modeValues = Object.values(Mode);
                const index = modeValues.indexOf(this.mode);
                const nextIndex = (index + 1) % modeNames.length;
                this.mode = Mode[modeNames[nextIndex]];
                this.reset();
            },
            prev() {
                if (this.isFirst && !this.infinite) return;
                const len = this.urlList.length;
                this.index = (this.index - 1 + len) % len;
            },
            next() {
                if (this.isLast && !this.infinite) return;
                const len = this.urlList.length;
                this.index = (this.index + 1) % len;
            },
            handleActions(action, options = {}) {
                if (this.loading) return;
                const { zoomRate, rotateDeg, enableTransition } = {
                    zoomRate: 0.2,
                    rotateDeg: 90,
                    enableTransition: true,
                    ...options
                };
                const { transform } = this;
                switch (action) {
                    case 'zoomOut':
                        if (transform.scale > 0.2) {
                            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
                        }
                        break;
                    case 'zoomIn':
                        transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
                        break;
                    case 'clocelise':
                        transform.deg += rotateDeg;
                        break;
                    case 'anticlocelise':
                        transform.deg -= rotateDeg;
                        break;
                }
                transform.enableTransition = enableTransition;
            }
        },
        mounted() {
            this.deviceSupportInstall();
        }
    };
</script>
<style lang="less" scoped>
    .el-image-viewer__btn{
        position: fixed;
    }
    .el-image-viewer__img{
        border-radius: 2px;
        box-shadow: 0 0 8px 0px rgba(125, 125, 125, 0.8);
    }
    .el-image-viewer__close{
        top: 180px;
    }
</style>