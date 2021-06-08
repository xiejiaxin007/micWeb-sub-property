<template>
    <div class="build-info">
        <div class="modal-title-box">
            <h3 class="title-content">楼栋信息</h3>
            <div class="btn-box">
                <template v-if="hasEditAuth">
                    <el-input
                        class="building-name"
                        v-model="buildingNameVal"
                        :maxlength="10"
                        size="small"
                        placeholder="请输入楼栋名称">
                    </el-input>
                    <el-button
                        @click="addBuilding"
                        type="primary"
                        size="small">
                        新增楼栋
                    </el-button>
                    <el-button
                        @click="exportBuilding"
                        type="primary"
                        size="small">
                        导出楼栋
                    </el-button>
                    <el-upload
                        class="btn-export"
                        action="/backend-api/project/dynamic-sales/import-build-info"
                        :show-file-list="false"
                        :accept="accept"
                        :before-upload="beforeExport"
                        :on-success="exportSuccess"
                        :data="exportOps">
                        <el-button size="small" type="primary">导入楼栋</el-button>
                    </el-upload>
                </template>
            </div>
        </div>
        <slot />
    </div>
</template>

<script>
    import {buildingConf} from '../config/tabToggleList';
    export default {
        name: 'BuildModuleWrap',
        data() {
            return {
                // 楼栋名称表单
                buildingNameVal: ''
            }
        },
        props: {
            // 楼盘下楼栋数据
            buildData: {
                type: Array,
                default: () => []
            },
            // 是否是编辑页面
            isEdit: {
                type: Boolean,
                default: false
            },
            // 是否有编辑权限 仅在查看页处理
            hasAuth: {
                type: [String, Number],
                default: ''
            }
        },
        computed: {
            hasEditAuth() {
                return this.hasAuth == 2;
            }
        },
        created() {
            // 初始化楼盘id
            this.projectId = this.$route.query.projectId || '';
            // 初始化户型id
            this.taskId = this.$route.query.taskId || '';
            this.exportOps = {
                project_id: this.projectId,
                task_id: this.taskId
            };
            this.accept = buildingConf.fileType.join(',');
        },
        methods: {
            // 新增楼栋方法
            addBuilding() {
                if (this.buildingNameVal === '') {
                    this.$alert('请先录入楼栋名称，再新增楼栋！', {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                // 判断是否新增楼栋名称已存在 遍历数据保存楼栋名称
                if (this.checkBuildNameRepeat(this.buildingNameVal.trim())) {
                    this.$alert(`“${this.buildingNameVal}” 已经在楼盘下已存在，请重新录入`, {
                        confirmButtonText: '确定'
                    });
                    return;
                }
                // 如果再编辑页面 则需要先弹出跳转弹出
                if (this.isEdit) {
                    this.$emit('goToAlert', {
                        path: 'buildingDetailEdit',
                        idName: 'buildingId',
                        buildingName: encodeURIComponent(this.buildingNameVal),
                        isEdit: 1,
                    });
                    return;
                }
                // 以上都通过后新标签页打开楼栋新增页面
                this.goToNewPage();
            },
            /**
             * 判断楼栋名称重复方法
             * @param {Sting} name 楼栋名称
             * @return {Boolean} 是否重复  重复返回true
             */
            checkBuildNameRepeat(name) {
                // 判断是否新增楼栋名称已存在 遍历数据保存楼栋名称到数组中
                const isRepeat = this.buildData.find(ele => {
                    let buildName = '';
                    Object.keys(ele).forEach(item => {
                        if (item === 'building_name') {
                            buildName = ele[item].field_value
                        }
                    });
                    return buildName === name;
                });
                return !!isRepeat;
            },
            // 导出楼栋
            exportBuilding() {
                window.open(`/backend-api/project/dynamic-sales/export-build-info?export=1&project_id=${this.projectId}&task_id=${this.taskId}`);
            },
            /**
             * 文件上传成功后回调
             */
            exportSuccess(response, file, fileList) {
                const {
                    msg
                } = response;
                this.$message(msg);
            },
            /**
             * 上传之前的回调  若返回 false 或者返回 Promise 且被 reject，则停止上传。
             * @param {File} file file文件
             */
            beforeExport(file) {
                const { name, size } = file;
                // 默认单位是字节
                const sizeM = size / (1024 * 1024);
                const nameArr = name.split('.');
                // 后缀名
                const extensionName = nameArr[nameArr.length - 1];
                // 限制文件大小
                if (sizeM > buildingConf.sizeLimit) {
                    this.$message(`上传的文件不可大于${buildingConf.sizeLimit}M哦~`);
                    return false;
                }
                // 限制文件类型
                if (!buildingConf.fileType.includes(`.${extensionName}`)) {
                    this.$message(`请上传文件类型为${buildingConf.fileType.join()}的文件`);
                    return false;
                }
            },
            // 新页面跳转
            goToNewPage() {
                const querys = this.$route.query;
                let queryHref = this.$router.resolve({
                    path: '/building/buildingDetailEdit',
                    query: {
                        projectId: querys.projectId || '',
                        taskId: querys.taskId || '',
                        role: querys.role || '',
                        buildingName: encodeURIComponent(this.buildingNameVal),
                        // 给新增页面点击取消后决定返回哪个页面用
                        isDynamic: 1
                    }
                });
                window.open(queryHref.href);
            }
        }
    }
</script>

<style lang="less" scoped>
    .build-info {
        padding: 0 10px;
        margin-top: 50px;
    }
    .building-name {
        width: 150px;
        margin-right: 10px;
    }
    .btn-box {
        text-align: right;
    }
    .btn-export{
        display: inline-block;
        margin-left: 10px;
    }
</style>