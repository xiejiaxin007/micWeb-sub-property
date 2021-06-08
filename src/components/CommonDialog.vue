<template>
    <div class="con-dialog-wrap">
        <!--楼盘任务未完成-->
        <el-dialog title="提示！"
            :visible.sync="houseStu"
            width="30%">
            <div class="content">
                <p class="txt">楼盘学习任务未完成，已经停上户，请联系咨询主管，进行补考!</p>
            </div>
            <div slot="footer"
                class="dialog-footer">
                <el-button type="primary"
                    @click="houseStu=false"
                    class="single">我知道了，马上去学习</el-button>
            </div>
        </el-dialog>
        <!--外勤核实-->
        <el-dialog title="外勤核实！"
            :visible.sync="workOut"
            width="30%">
            <div class="content"
                style="height: 40px;">
                <p class="txt">{{outStu}}</p>
            </div>
            <div slot="footer"
                class="dialog-footer">
                <el-button type="default"
                    @click="workOut=false"
                    class="default-btn double-btn">暂不处理</el-button>
                <el-button type="primary"
                    @click="goTask(workOutUrl, 1)"
                    class="double-btn">前往核对外勤出勤</el-button>
            </div>
        </el-dialog>
        <!--发布任务提醒-->
        <el-dialog title="提示！"
            :visible.sync="taskWarn"
            width="30%">
            <div class="content">
                <p class="tlt"><span class="iconfont icongantanhao-yuankuang"></span>发布任务提醒！</p>
                <p class="txt">{{taskCounName}}本周没有楼盘学习任务，请前往添加楼盘学习任务</p>
            </div>
            <div slot="footer"
                class="dialog-footer">
                <el-button type="default"
                    @click="noNessAdd"
                    class="default-btn double-btn">不用添加</el-button>
                <el-button type="primary"
                    @click="goTask(taskWarnUrl, 2)"
                    class="double-btn">前往添加</el-button>
            </div>
        </el-dialog>
        <!--成绩录入提醒-->
        <el-dialog title="提示！"
            :visible.sync="taskGrade"
            :show-close="false"
            width="30%">
            <div class="content">
                <p class="tlt">
                    <span class="iconfont icongantanhao-yuankuang"></span>成绩录入提醒！
                </p>
                <p class="txt">存在楼盘学习成绩未录入，请及时安排考试或者讲盘并录入成绩</p>
            </div>
            <div slot="footer"
                class="dialog-footer">
                <el-button type="default"
                    @click="taskGrade=false"
                    class="default-btn double-btn">暂时有事，等会录入</el-button>
                <el-button type="primary"
                    @click="goTask(taskGradeUrl, 3)"
                    class="double-btn">前往录入</el-button>
            </div>
        </el-dialog>
        <!--滴滴个人手机号-->
        <el-dialog title="提示！"
            :visible.sync="privatePhone"
            width="30%">
            <div class="content">
                <p class="txt">请您到右上角个人设置里，填写您的：个人(私人)手机号！填写后，就不会出现该提示信息了！</p>
            </div>
        </el-dialog>
        <!--滴滴企业手机号-->
        <el-dialog title="提示！"
            :visible.sync="commonPhone"
            width="30%">
            <div class="content">
                <p class="txt">请您到右上角个人设置里，填写您的：企业用车手机号！填写后，就不会出现该提示信息了！</p>
            </div>
        </el-dialog>
        <!--新订单提醒-->
        <el-dialog :visible.sync="orderConfirm.orderRemind"
            width="30%">
            <div slot="title"
                class="order-remind">
                <span>新订单提醒</span>
            </div>
            <div class="content">
                <ul class="s-query">
                    <li class="auto">
                        <div class="th">分配时间：</div>
                        <div class="td">{{orderConfirm.allowTime}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">失效时间：</div>
                        <div class="td">{{orderConfirm.failTime}}</div>
                    </li>
                    <li class="auto">
                        <div class="th required">确认订单：</div>
                        <div class="td">
                            <el-radio-group v-model="orderConfirm.isCheckOrder">
                                <el-radio :label="1">确认订单</el-radio>
                                <el-radio :label="2">放弃订单</el-radio>
                            </el-radio-group>
                        </div>
                    </li>
                    <li class="auto"
                        v-if="orderConfirm.isCheckOrder===2">
                        <div class="th">放弃原因：</div>
                        <div class="td">
                            <el-select v-model="orderConfirm.reasonVal"
                                placeholder="请选择">
                                <el-option v-for="item in orderConfirm.options"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="auto"
                        v-if="orderConfirm.isCheckOrder===2"
                        ref="giveRemark">
                        <div class="th">备注：</div>
                        <div class="td">
                            <el-input type="textarea"
                                v-model="orderConfirm.remark"></el-input>
                        </div>
                    </li>
                </ul>
                <p class="note">注释：如在短时间内接到多个订单，属于爆单现象，请及时联系咨询经理解决！</p>
            </div>
            <div slot="footer"
                class="affrim-sub">
                <el-button type="primary"
                    @click="submitOrderRemind()">确认</el-button>
            </div>
        </el-dialog>
        <!--私人微信未填写、待分组好友提醒、待绑定客户提醒-->
        <el-dialog title="提示！"
            :visible.sync="wxWriteVisible"
            custom-class="wx-write-dialog"
            width="30%">
            <div class="content">
                <p class="txt">请完善私人微信填写，填写完成后系统将不再提示～</p>
            </div>
            <div slot="footer"
                class="dialog-footer">
                <el-button type="default"
                    @click="wxWriteVisible=false"
                    class="default-btn">暂时有事，等会去</el-button>
                <el-button type="primary"
                    @click="goTask(writeWxUrl)">好的，去处理</el-button>
            </div>
        </el-dialog>
        <!--微信好友管理任务弹窗（待绑定和待分组）-->
        <el-dialog title="提示！"
            :visible.sync="wxIsTaskVisible"
            custom-class="wx-write-dialog"
            width="30%">
            <div class="content">
                <p class="txt"
                    v-if="wxTaskNoGroupNum !== 0">待分组好友： {{wxTaskNoGroupNum}} 个</p>
                <p class="txt"
                    v-if="wxTaskNoBindNum !== 0">待绑定好友：{{wxTaskNoBindNum}} 个</p>
                <p class="txt">请及时前往好友管理页面处理，有未完成的任务时系统会一直提示你哦～</p>
            </div>
            <div slot="footer"
                class="dialog-footer">
                <el-button type="default"
                    @click="wxIsTaskVisible=false"
                    class="default-btn">暂时有事，等会去</el-button>
                <el-button type="primary"
                    @click="goTask(wxIsTaskUrl)">好的，去处理</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="newOrderRemaidListFirst.isShow"
            title="新订单提醒"
            width="300px"
            center>
            <div class="content">
                <ul class="s-query">
                    <li class="auto new-order-list">
                        <div class="th new-order-th">分配时间：</div>
                        <div class="td">{{newOrderRemaidListFirst.alloc_datetime}}</div>
                    </li>
                    <li class="auto new-order-list">
                        <div class="th new-order-th">首电延迟时间：</div>
                        <div class="td delay-time">{{newOrderRemaidListFirst.delay_deadline}}</div>
                    </li>
                    <li class="auto new-order-list">
                        <div class="th new-order-th">客服备注：</div>
                    </li>
                    <li class="auto new-add">
                        <div class="txt">{{newOrderRemaidListFirst.note}}</div>
                    </li>
                </ul>
            </div>
            <div slot="footer"
                class="affrim-sub">
                <el-button type="primary"
                    @click="goTask(newOrderRemaidListFirst.order_detail_url)">查看订单</el-button>
            </div>
        </el-dialog>
        <!-- 公告 -->
        <el-dialog :title="bbsNoicte.bbsNotice.title"
            :visible.sync="bbsNoicte.isShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            width="520px">
            <div class="content">
                <p class="txt bbs-noicte-txt"
                    v-if="bbsNoicte.bbsNotice.content_type == '1'">{{bbsNoicte.bbsNotice.content}}</p>
                <div class="bbs-noicte-pic"
                    v-if="bbsNoicte.bbsNotice.content_type == '2'">
                    <img :src="bbsNoicte.bbsNotice.img_url"
                        alt="公告图片" />
                </div>
            </div>
            <div slot="footer"
                class="dialog-footer">
                <el-button :type="bbsNoicte.btnType"
                    @click="closeBbsNoicte"
                    :disabled="bbsNoicte.btnDisabled"
                    class="single-primary">{{ bbsNoicte.btnTxt }}</el-button>
            </div>
        </el-dialog>
        <!-- 提醒有客户来电 -->
        <el-dialog title="有客户来电，请及时处理！"
            :visible.sync="remindCustomerCall.isShow"
            width="520px"
            custom-class="remind-customer-call"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <div class="content">
                <ul class="s-query clearfix">
                    <li class="auto">
                        <div class="th">订单:</div>
                        <div class="td">{{remindCustomerCall.orderId}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">客户:</div>
                        <div class="td">{{remindCustomerCall.userName}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">手机号:</div>
                        <div class="td">{{remindCustomerCall.mobile}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">来电时间:</div>
                        <div class="td">{{remindCustomerCall.talkTime}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">跟进状态:</div>
                        <div class="td">
                            <span :class="`${remindCustomerCall.statusId === 2 ? 'red' : ''}`">{{remindCustomerCall.status}}</span>
                        </div>
                    </li>
                </ul>
                <p class="txt"
                    v-if="remindCustomerCall.type === 1">
                    请在{{remindCustomerCall.deadlineTime}}前给客户回电，否则将产生延迟。若您已于客户见面，则需要给客户发送验证码进行验证，点击
                    <el-button type="text"
                        @click="remindCustomerCall.isCustomerMeet=!remindCustomerCall.isCustomerMeet">已与客户见面</el-button>
                </p>
                <p class="txt"
                    v-if="remindCustomerCall.type === 2">
                    请及时给客户回电，支撑系统会在检测到您给客户回电后解锁。若您已与客户见面，请点击
                    <el-button type="text"
                        @click="remindCustomerCall.isCustomerMeet=!remindCustomerCall.isCustomerMeet">已与客户见面</el-button>
                </p>
                <div class="confirm-code"
                    v-if="remindCustomerCall.isCustomerMeet">
                    <div class="confirm-code-main">
                        <span>确认码：</span>
                        <div class="confirm-code-input">
                            <el-input v-model="remindCustomerCall.confirmCode"
                                maxlength="10"></el-input>
                        </div>
                        <el-button class="send-confirm-code"
                            @click="sendConfirmCode"
                            :disabled="remindCustomerCall.btnDisabled">{{remindCustomerCall.btnTxt}}</el-button>
                        <div class="tips">点击后将会给客户发送确认码，请询问客户并填写在输入框中</div>
                    </div>
                    <div class="tips-right-code"
                        v-if="remindCustomerCall.isCodeWrong">请输入正确确认码</div>
                    <div class="confirm-code-btn">
                        <el-button type="primary"
                            size="small"
                            @click="checkConfirmCode">确认</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 线上看房相关弹窗 -->
        <div class="online-dialog">
            <!-- 线上看房提醒 -->
            <el-dialog :visible.sync="onlineHouse.remindShow"
                width="430px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                center>
                <div slot="title"
                    class="dialog-header">
                    线上看房提醒
                </div>
                <div class="dialog-body">
                    <ul>
                        <li v-if="onlineHouse.realname">
                            <div class="th">客户：</div>
                            <div class="td">{{onlineHouse.realname}}</div>
                        </li>
                        <li v-if="onlineHouse.sex">
                            <div class="th">性别：</div>
                            <div class="td">{{onlineHouse.sex}}</div>
                        </li>
                        <li v-if="onlineHouse.mobile">
                            <div class="th">手机：</div>
                            <div class="td">{{onlineHouse.mobile}}</div>
                        </li>
                        <li v-if="onlineHouse.orderId">
                            <div class="th">订单id：</div>
                            <div class="td">{{onlineHouse.orderId}}</div>
                        </li>
                        <li>
                            <div class="th">发起视频楼盘：</div>
                            <div class="td">{{onlineHouse.liveProject}}</div>
                        </li>
                        <li class="interest-project clearfix">
                            <div class="th">感兴趣楼盘：</div>
                            <div class="td">{{onlineHouse.interestProject}}</div>
                        </li>
                        <li>
                            <div class="th">总价：</div>
                            <div class="td">{{onlineHouse.totalPrice}}</div>
                        </li>
                        <li>
                            <div class="th">{{onlineHouse.orderId ? "发起时间：" : "分配时间："}}</div>
                            <div class="td">{{onlineHouse.allocDatetime}}</div>
                        </li>
                        <li>
                            <div class="th">倒计时：</div>
                            <div class="td">{{onlineHouse.minute}}s</div>
                        </li>
                    </ul>
                </div>
                <span slot="footer"
                    class="dialog-footer">
                    <el-button v-if="!onlineHouse.endEmployee"
                        class="cancel"
                        @click="cancelSeeHouse">取消</el-button>
                    <el-button class="confirm"
                        @click="toSeeHouse">开始看房</el-button>
                </span>
            </el-dialog>
            <!-- 未接到线上看房单 -->
            <el-dialog :visible.sync="onlineHouse.noOnlineOrder"
                width="430px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                center>
                <div slot="title"
                    class="dialog-header">
                    未接到线上看房单
                </div>
                <div class="dialog-body">
                </div>
                <span slot="footer"
                    class="dialog-footer">
                    <el-button class="confirm"
                        @click="onlineHouse.noOnlineOrder=false">确定
                    </el-button>
                </span>
            </el-dialog>
            <!-- 线上看房邀请 -->
            <el-dialog custom-class="online-invitation-dialog"
                :visible.sync="onlineHouse.invitationShow"
                width="430px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                center>
                <div slot="title"
                    class="dialog-header">
                    线上看房邀请
                </div>
                <div class="dialog-body">
                    <ul>
                        <li>
                            <div class="th">咨询师：</div>
                            <div class="td">
                                {{onlineHouse.employeeName}}<span>邀请你线上看房</span>
                            </div>
                        </li>
                        <li>
                            <div class="th">邀请时间：</div>
                            <div class="td">{{onlineHouse.allocDatetime}}</div>
                        </li>
                    </ul>
                </div>
                <span slot="footer"
                    class="dialog-footer">
                    <el-button class="cancel"
                        @click="cancelSeeHouse">取消</el-button>
                    <el-button class="confirm"
                        @click="toSeeHouse">立即进入</el-button>
                </span>
            </el-dialog>
            <audio id="music"
                ref="music"
                src="http://comjia-1.oss-cn-beijing.aliyuncs.com/remindMusic/20200221/20200221060648_rhrx.mp3">
                对不起，您的浏览器不支持HTML5音频播放。</audio>
        </div>
        <!-- 打车单提示 -->
        <el-dialog title="打车单提示"
            :visible.sync="didiOrder.resData[didiOrder.currentDialogIndex].isShow"
            width="520px"
            custom-class="taxi-order-dialog"
            :before-close="didiNextDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            center>
            <div class="content">
                <ul class="s-query clearfix">
                    <li class="auto">
                        <div class="th">打车类型:</div>
                        <div class="td">{{didiOrder.resData[didiOrder.currentDialogIndex].use_type}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">叫车人:</div>
                        <div class="td">{{didiOrder.resData[didiOrder.currentDialogIndex].employee_name}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">出发地:</div>
                        <div class="td">{{didiOrder.resData[didiOrder.currentDialogIndex].start_name}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">目的地:</div>
                        <div class="td">{{didiOrder.resData[didiOrder.currentDialogIndex].end_name}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">行程结束时间:</div>
                        <div class="td">{{didiOrder.resData[didiOrder.currentDialogIndex].finish_time}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">结算状态:</div>
                        <div class="td">【{{didiOrder.resData[didiOrder.currentDialogIndex].bill_status_str}}】{{didiOrder.resData[didiOrder.currentDialogIndex].bill_status === 1 || didiOrder.resData[didiOrder.currentDialogIndex].bill_status === 2 ? '请前往企业滴滴完成支付' : ''}}</div>
                    </li>
                    <li class="auto">
                        <div class="th">绑定状态:</div>
                        <div class="td">
                            【{{didiOrder.resData[didiOrder.currentDialogIndex].bind_status_str}}】
                            <span v-if="didiOrder.resData[didiOrder.currentDialogIndex].bind_status === 1 || didiOrder.resData[didiOrder.currentDialogIndex].bind_status === 2">
                                请在【{{didiOrder.resData[didiOrder.currentDialogIndex].bind_deadline}}】前关联订单，否则需要自付车费
                            </span>
                        </div>
                    </li>
                    <template v-if="didiOrder.resData[didiOrder.currentDialogIndex].bind_status === 1 || didiOrder.resData[didiOrder.currentDialogIndex].bind_status === 2 || didiOrder.resData[didiOrder.currentDialogIndex].bind_status === 4">
                        <li class="auto">
                            <div class="th">订单:</div>
                            <div class="td">
                                <div class="td">
                                    <el-select v-model="didiOrder.orderId"
                                        filterable
                                        remote
                                        :remote-method="getDidiSearchOrder"
                                        @change="didiOrder.replateReason = ''"
                                        placeholder="请选择">
                                        <el-option v-for="item in didiOrder.orderIdOps"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </li>
                        <li class="auto">
                            <div class="th">类型:</div>
                            <div class="td">
                                <div class="td">
                                    <el-select v-model="didiOrder.replateReason"
                                        @change="getOrderData"
                                        placeholder="请选择">
                                        <el-option v-for="item in didiOrder.replateReasonOps"
                                            :key="item.key"
                                            :label="item.name"
                                            :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </li>
                        <li class="auto"
                            v-if="didiOrder.replateReason === '3' || didiOrder.replateReason === '4'">
                            <div class="th">成交单ID:</div>
                            <div class="td">
                                <div class="td">
                                    <el-select v-model="didiOrder.dealId"
                                        placeholder="请选择">
                                        <el-option v-for="item in didiOrder.dealIdOps"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </li>
                        <li class="auto"
                            v-if="didiOrder.replateReason === '1'">
                            <div class="th">带看ID:</div>
                            <div class="td">
                                <div class="td">
                                    <el-select v-model="didiOrder.seeProject"
                                        placeholder="请选择">
                                        <el-option v-for="item in didiOrder.seeProjectOps"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </li>
                        <li class="auto"
                            v-if="didiOrder.replateReason === '3'">
                            <div class="th">签约陪同:</div>
                            <div class="td">
                                <div class="td">
                                    <el-select v-model="didiOrder.signAccmopany"
                                        placeholder="请选择">
                                        <el-option v-for="item in didiOrder.dealAccompanyOpsObj[didiOrder.dealId]"
                                            :key="item.id"
                                            :label="item.text"
                                            :value="item.id"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </li>
                        <li class="auto">
                            <div class="th">备注:</div>
                            <div class="td">
                                <div class="td">
                                    <el-input type="textarea"
                                        v-model="didiOrder.remarks">
                                    </el-input>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
                <div class="content-tip">注意：今日需要报备的打车订单记得及时发起审批哦～</div>
            </div>
            <span slot="footer"
                class="dialog-footer"
                v-if="didiOrder.resData[didiOrder.currentDialogIndex].bind_status === 1 || didiOrder.resData[didiOrder.currentDialogIndex].bind_status === 2 || didiOrder.resData[didiOrder.currentDialogIndex].bind_status === 4">
                <el-button class="confirm"
                    type="primary"
                    @click="didiSubmit">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { commonFun } from '../assets/js/utils/utils';
import commonApi from '@/api/commonApi';
// websocket 重连
import ReconnectingWebSocket from 'reconnecting-websocket';
export default {
    data() {
        return {
            // 微信填写弹窗
            wxWriteVisible: false,
            // 去填写微信号的url
            writeWxUrl: '',
            // 微信好友管理（待绑定/待分组）
            wxIsTaskVisible: false,
            // 去微信管理页面URL
            wxIsTaskUrl: '',
            // 微信好友中未分组人数
            wxTaskNoGroupNum: 0,
            // 微信好友中未绑定人数
            wxTaskNoBindNum: 0,
            orderConfirm: {
                affirm: '', // 确认
                order_id: '', // 订单id
                allowTime: '', // 分配时间
                failTime: '', // 失效时间
                remark: '', // 备注
                reasonVal: '', // 放弃订单原因
                options: [], // 放弃订单的原因
                isCheckOrder: 1, // 默认选确认订单
                orderRemind: false // 新订单提醒
            },
            houseStu: false, // 楼盘学习未完成弹出
            outStu: '', // 外勤学习文字
            workOut: false, // 核对外勤
            workOutUrl: '', // 核对外勤地址
            taskWarn: false, // 发布任务提醒
            taskWarnUrl: '', // 添加任务链接
            taskCounName: '', // 咨询师名称
            noAddTrackId: '', // 不用添加按钮的track_id
            addTrackId: '', // 去添加按钮的track_id
            taskGrade: false, // 成绩录入
            taskGradeName: '', // 成绩录入咨询师名称
            taskGradeUrl: '', // 成绩录入链接
            privatePhone: false, // 私人手机号
            newOrderRemaidListFirst: {}, // 新订单提醒
            commonPhone: false, // 企业用车手机号
            // bbs公告
            bbsNoicte: {
                isShow: false,
                url: '',
                bbsNotice: {},
                btnTxt: '(8s 后确定收到)',
                btnDisabled: true,
                btnType: 'info'
            },
            // 提醒有客户未接来电
            remindCustomerCall: {
                btnTxt: '发送确认码',
                btnDisabled: false,
                isCustomerMeet: false,
                confirmCode: '',
                isCodeWrong: false,
                isShow: false,
                orderId: '',
                userName: '',
                mobile: '',
                talkTime: '',
                deadlineTime: '',
                type: '',
                talkingID: ''
            },
            // 线上看房提醒
            onlineHouse: {
                remindShow: false, // 提醒弹窗
                realname: '', // 客户姓名，为空不展示
                mobile: '', // 客户手机号，为空不展示
                sex: '', // 客户性别，为空不展示
                id: '', //
                circulationType: '', // 流转类型
                endEmployee: '', // 是否为兜底咨询师
                allocType: '', // 分配类型
                allocTime: '', // 分配时间，时间戳
                allocDatetime: '', // 分配时间，格式化
                roomId: '', // 房间ID
                minute: '', // 倒计时时间
                minuteTimer: null, // 倒计时定时器
                timer: null, // 定时器
                noOnlineOrder: false, // 未接到线上看房单
                invitationShow: false, // 线上看房邀请弹窗
                employeeName: '', // 员工id 分配类型为：3 邀请参加时返回
                sign: '', // 记录id 区分页面
                employeeId: '', // 咨询师id
                heartbeatTime: 0, // 几秒钟轮询一次
                // websocket 服务器域名
                wsUrl: '',
                // 订单id
                orderId: '',
                // 发起视频楼盘
                liveProject: '',
                // 感兴趣楼盘
                interestProject: '',
                // 总价
                totalPrice: ''
            },
            // 线上看房提醒websocket对象
            onlineHouseRemindWS: null,
            didiOrder: {
                // 弹窗数据数组
                resData: [{}],
                // 当前显示的弹窗
                currentDialogIndex: 0,
                // 订单id
                orderId: '',
                // 订单id下拉
                orderIdOps: [],
                // 类型
                replateReason: '',
                // 类型下拉
                replateReasonOps: [
                    {
                        name: '正常带看',
                        value: '1'
                    },
                    {
                        name: '临时取消带看',
                        value: '2'
                    },
                    {
                        name: '签约陪同',
                        value: '3'
                    },
                    {
                        name: '其他成交后服务',
                        value: '4'
                    },
                    {
                        name: '其他',
                        value: '5'
                    }
                ],
                // 带看ID
                seeProject: '',
                // 带看ID下拉
                seeProjectOps: [],
                // 成交单ID
                dealId: '',
                // 成交单ID下拉
                dealIdOps: [],
                // 签约陪同
                signAccmopany: '',
                // 签约陪同下拉
                dealAccompanyOpsObj: {},
                // 备注
                remarks: '',
                // 是否有绑定任务（是否展示输入框)
                hasBindTask: false
            }
        };
    },
    watch: {
        // 监听线上订单弹窗 判断音乐播放
        'onlineHouse.remindShow': {
            deep: true,
            handler(val) {
                this.playMusic(val);
            }
        },
        // 监听线上邀请弹窗 判断音乐播放
        'onlineHouse.invitationShow': {
            deep: true,
            handler(val) {
                this.playMusic(val);
            }
        }
    },
    mounted() {
        window.addEventListener('storage', e => {
            if (e.key === 'user_online') {
                let storageValue = {
                    roomId: this.onlineHouse.roomId,
                    employeeId: this.onlineHouse.employeeId,
                    allocType: this.onlineHouse.allocType,
                    circulationType: this.onlineHouse.circulationType
                };
                if (e.newValue === JSON.stringify(storageValue)) {
                    if (this.onlineHouse.allocType === 3) {
                        this.onlineHouse.invitationShow = false;
                    } else {
                        this.onlineHouse.remindShow = false;
                    }
                }
            }
        });
        this.$nextTick(() => {
            this.getDialogData();
        });
        // 生成记录id
        this.getSign();
        // 获取轮询配置信息
        this.getHeartbeatInfo();
    },
    methods: {
        // 下一个滴滴打车单弹窗
        didiNextDialog() {
            // 关闭当前弹窗
            if (this.didiOrder.resData[this.didiOrder.currentDialogIndex]) {
                this.didiOrder.resData[this.didiOrder.currentDialogIndex].isShow = false;
            }
            if (this.didiOrder.currentDialogIndex < this.didiOrder.resData.length - 1) {
                setTimeout(() => {
                    this.didiOrder.currentDialogIndex++;
                }, 500);
                this.didiOrder.orderId = '';
                this.didiOrder.replateReason = '';
                this.didiOrder.seeProject = '';
                this.didiOrder.seeProjectOps = [];
                this.didiOrder.dealId = '';
                this.didiOrder.dealIdOps = [];
                this.didiOrder.signAccmopany = '';
                this.didiOrder.dealAccompanyOpsObj = {};
                this.didiOrder.remarks = '';
                this.getDidiSearchOrder();
            }
        },
        // 滴滴打车单提交
        async didiSubmit() {
            if (!this.didiOrder.orderId) {
                this.$message('请选择订单id');
                return;
            } else if (!this.didiOrder.replateReason) {
                this.$message('请选择类型');
                return;
            } else if (this.didiOrder.replateReason === '1' && !this.didiOrder.seeProject) {
                this.$message('请选择带看id');
                return;
            } else if ((this.didiOrder.replateReason === '3' || this.didiOrder.replateReason === '4') && !this.didiOrder.dealId) {
                this.$message('请选择成交单ID');
                return;
            } else if (this.didiOrder.replateReason === '3' && !this.didiOrder.signAccmopany) {
                this.$message('请选择签约陪同');
                return;
            } else if ((this.didiOrder.replateReason === '2' || this.didiOrder.replateReason === '5') && !this.didiOrder.remarks) {
                this.$message('请填写备注');
                return;
            }
            try {
                let params = {
                    id: this.didiOrder.resData[this.didiOrder.currentDialogIndex].didi_order_id,
                    order_id: this.didiOrder.orderId,
                    reason: this.didiOrder.replateReason,
                    see_project: this.didiOrder.seeProject,
                    sign_accmopany: this.didiOrder.signAccmopany
                };
                // 不同类型的备注字段名不同
                params['remarks_' + this.didiOrder.replateReason] = this.didiOrder.remarks;
                // 类型是3 签约陪同时传成交单字段是sign_deal_id
                if (this.didiOrder.replateReason === '3') {
                    params.sign_deal_id = this.didiOrder.dealId;
                    // 类型是4 其他成交后服务时传成交单字段是deal_id
                } else if (this.didiOrder.replateReason === '4') {
                    params.deal_id = this.didiOrder.dealId;
                }
                const {
                    data: { code, msg }
                } = await commonApi.saveRelateDidi(params);
                if (code === 0) {
                    this.didiOrder.resData[this.didiOrder.currentDialogIndex].isShow = false;
                    if (this.didiOrder.currentDialogIndex < this.didiOrder.resData.length - 1) {
                        this.didiNextDialog();
                    }
                } else {
                    this.$message({
                        message: msg,
                        type: null,
                        duration: 1000
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 打车单选中类型后获取带看id/成交单id 下拉
         * @param {boolean} val 选中内容
         */
        async getOrderData(val) {
            if (val === '2' || val === '') return;
            try {
                let params = {
                    order_id: this.didiOrder.orderId,
                    replate_reason: val
                };
                const {
                    data: { code, data }
                } = await commonApi.getDataForOrder(params);
                if (code === 0) {
                    this.didiOrder.seeProjectOps = data.see_project_ids;
                    this.didiOrder.dealIdOps = data.deal_ids;
                    this.didiOrder.dealAccompanyOpsObj = data.deal_accompany;
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 打车单获取订单下拉列表
         * @param {boolean} q 搜索关键词
         */
        async getDidiSearchOrder(q) {
            try {
                let params = {
                    q: q
                };
                const {
                    data: { code, data }
                } = await commonApi.didiSearchOrder(params);
                if (code === 0) {
                    this.didiOrder.orderIdOps = data.list;
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * 音乐播放
         * @param {boolean} isShow 弹窗是否显示
         */
        playMusic(isShow) {
            this.$nextTick(() => {
                if (isShow) {
                    // 获取storage里music_online的数据，如果内容一致，则证明该弹窗已经播放过音乐，则该次弹窗不播放音乐，不一致则播放音乐，并将数据存入storage中
                    let storageValue = {
                        roomId: this.onlineHouse.roomId,
                        employeeId: this.onlineHouse.employeeId,
                        allocType: this.onlineHouse.allocType,
                        circulationType: this.onlineHouse.circulationType
                    };
                    let storageStr = localStorage.getItem('music_online');
                    if (storageStr !== '' && storageStr === JSON.stringify(storageValue)) {
                        this.$refs['music'].currentTime = 0;
                        this.$refs['music'].pause();
                    } else {
                        localStorage.setItem('music_online', JSON.stringify(storageValue));
                        if (this.$refs['music'].paused) {
                            this.$refs['music'].play();
                        }
                    }
                } else {
                    this.$refs['music'].currentTime = 0;
                    this.$refs['music'].pause();
                }
            });
        },
        // 随机生成记录id
        getSign() {
            let now = new Date().getTime();
            let random = commonFun.random_string(4);
            this.onlineHouse.sign = now + random;
        },
        // 获取轮询配置信息
        async getHeartbeatInfo() {
            try {
                const { data } = await commonApi.getHeartbeatInfo();
                if (data.code === 0) {
                    this.onlineHouse.employeeId = data.data.employee_id;
                    this.onlineHouse.heartbeatTime = data.data.heartbeat_time;
                    if (data.data.live_notice_type === 2) {
                        this.wsUrl = data.data.socket_ws_url;
                        this.creatWebsocket('backend', this.onlineHouse.employeeId);
                    } else {
                        // 获取路由信息，如果是/dist/liveRoom则线上带看相关弹窗不显示
                        if (window.location.pathname != '/dist/liveRoom') {
                            // 轮询是否有视频看
                            this.pollOnlineHouseInfo();
                        }
                        // 启用容错轮训
                        this.getPollingCustomerMissCall();
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        /**
         * @description: 创建websocket连接
         * @param {string} system 系统平台
         * @param {string} employee_id 咨询师ID
         */
        creatWebsocket(system, employee_id) {
            let url;
            url = `${this.wsUrl}/ws?system=${system}&employee_id=${employee_id}`;
            // if (window.location.protocol == "https:") {
            //     url = `wss://messageServer.comjia.com/ws?system=${system}&employee_id=${employee_id}`;
            // }
            try {
                this.onlineHouseRemindWS = new ReconnectingWebSocket(url);
                this.initRemind();
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: 初始化websocket
         */
        initRemind() {
            if (!this.onlineHouseRemindWS) return;
            this.onlineHouseRemindWS.addEventListener('message', this.wsMessage);
            this.onlineHouseRemindWS.addEventListener('error', this.wsError);
            this.onlineHouseRemindWS.addEventListener('open', this.wsOpen);
            this.onlineHouseRemindWS.addEventListener('close', this.wsClose);
        },
        // 监听websocket错误
        wsError() {
            console.log(`%cwebsocket错误`, 'color:red;background:yellow;');
        },
        /**
         * @description: 监听websocket message事件
         * @param {object} 事件对象
         */
        wsMessage(event) {
            console.log(`%c${event.data}`, 'color:blue;background:yellow;');
            this.handleMessage(event.data);
        },
        /**
         * @description: 监听websocket open事件
         */
        wsOpen() {
            console.log(`%c-----------WebSocket连接已建立-----------`, 'color:green;background:yellow;');
        },
        /**
         * @description: 监听websocket close事件
         */
        wsClose() {
            console.log(`%c-----------WebSocket连接已关闭-----------`, 'color:red;background:yellow;');
        },
        /**
         * @description: 接收到消息处理
         * @param {string} message 接收到data消息
         */
        handleMessage(message) {
            try {
                if (typeof message === 'string') {
                    message = JSON.parse(message);
                }
                if (message.key) {
                    let message_list = localStorage.getItem('messageList') ? localStorage.getItem('messageList').split(',') : [];
                    if (message_list.indexOf(message.key + '') > -1) {
                        return;
                    } else {
                        message_list.unshift(message.key);
                        message_list = message_list.slice(0, 20);
                        localStorage.setItem('messageList', message_list);
                    }
                }

                if (message.socket_type) {
                    switch (message.socket_type) {
                        case 1:
                            // 获取路由信息，如果是/dist/liveRoom则线上带看相关弹窗不显示
                            if (window.location.pathname != '/dist/liveRoom') {
                                this.getOnlineHouseInfo();
                            }
                            break;
                        case 2:
                            this.getCallInfo(message.task_id);
                            break;
                        default:
                            console.log('socket_type:' + message.socket_type);
                            break;
                    }
                }
            } catch (error) {
                console.log(error);
                console.log('接收到异常处理消息：' + message);
            }
        },
        /**
         * @description: 获取未接来电信息
         * @param {String} taskId socket传送的ID
         */
        async getCallInfo(taskId) {
            this.taskId = taskId;
            // 如果弹窗已经打开，就不再重新打开
            let params = {
                task_id: taskId
            };
            try {
                let result = await commonApi.getTalkingPop(params);
                const { data, code } = result.data;
                if (code === 0) {
                    // 如果弹窗已经打开，就不再重新打开
                    if (data.is_show === 1) {
                        if (!this.remindCustomerCall.isShow) {
                            this.remindCustomerCall.isShow = this.parseBool(data.is_show);
                        }
                        this.remindCustomerCall.orderId = data.data.order_id;
                        this.remindCustomerCall.userName = data.data.user_name;
                        this.remindCustomerCall.mobile = data.data.mobile;
                        this.remindCustomerCall.talkTime = data.data.talk_time;
                        this.remindCustomerCall.deadlineTime = data.data.deadline_time;
                        this.remindCustomerCall.type = data.data.type;
                        this.remindCustomerCall.talkingID = data.data.talking_id;
                        this.remindCustomerCall.status = data.data.status;
                        this.remindCustomerCall.statusId = data.data.follow_status;
                    } else if (data.is_show === -1) {
                        // 自动关闭弹窗
                        this.remindCustomerCall.isShow = false;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 轮询-线上看房弹窗信息
        pollOnlineHouseInfo() {
            this.getOnlineHouseInfo();
            if (this.onlineHouse.timer) clearInterval(this.onlineHouse.timer);
            this.onlineHouse.timer = setInterval(() => {
                this.getOnlineHouseInfo();
            }, this.onlineHouse.heartbeatTime);
        },
        // 线上看房弹窗信息
        async getOnlineHouseInfo() {
            let params = {
                sign: this.onlineHouse.sign,
                employee_id: this.onlineHouse.employeeId
            };
            try {
                const { data } = await commonApi.pollOnlineHouseRemind(params);
                if (data.code === 0) {
                    // 弹窗属于线上邀请弹窗
                    if (data.data.alloc_type === 3) {
                        this.onlineHouse.invitationShow = true;
                        this.onlineHouse.employeeName = data.data.employee_name;
                    } else {
                        // 弹窗属于线上看房提醒弹窗
                        this.onlineHouse.remindShow = true;
                        // let nowTime = Date.parse(new Date()) / 1000;
                        // this.onlineHouse.minute = data.data.alloc_time - nowTime + 20;
                        this.onlineHouse.minute = 20;
                        if (this.onlineHouse.minuteTimer) clearInterval(this.onlineHouse.minuteTimer);
                        this.onlineHouse.minuteTimer = setInterval(() => {
                            if (this.onlineHouse.minute === 0) {
                                this.onlineHouse.remindShow = false;
                                // 上报超时未接通记录
                                this.reportRecord();
                                clearInterval(this.onlineHouse.minuteTimer);
                            } else {
                                --this.onlineHouse.minute;
                            }
                        }, 1000);
                    }
                    this.onlineHouse.realname = data.data.realname;
                    this.onlineHouse.mobile = data.data.mobile;
                    this.onlineHouse.sex = data.data.sex;
                    this.onlineHouse.id = data.data.id;
                    this.onlineHouse.circulationType = data.data.circulation_type;
                    this.onlineHouse.endEmployee = data.data.end_employee;
                    this.onlineHouse.allocType = data.data.alloc_type;
                    this.onlineHouse.allocTime = data.data.alloc_time;
                    this.onlineHouse.allocDatetime = data.data.alloc_datetime;
                    this.onlineHouse.roomId = data.data.room_id;
                    this.onlineHouse.orderId = data.data.order_id;
                    this.onlineHouse.liveProject = data.data.live_project ? data.data.live_project : '';
                    this.onlineHouse.interestProject = data.data.interest_project ? data.data.interest_project : '';
                    this.onlineHouse.totalPrice = data.data.total_price;
                } else if (data.code === 3021) {
                    // 返回3021(已进入房间)，弹窗自动关闭（不等待20S） 考虑到咨询师已进入房间，但是同时打开了其他标签页
                    if (this.onlineHouse.minuteTimer) clearInterval(this.onlineHouse.minuteTimer);
                    this.onlineHouse.remindShow = false;
                    this.onlineHouse.invitationShow = false;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 上报超时未接通记录
        async reportRecord() {
            let params = {
                room_id: this.onlineHouse.roomId,
                alloc_type: this.onlineHouse.allocType
            };
            try {
                await commonApi.popupTimeOut(params);
            } catch (err) {
                console.log(err);
            }
        },
        // 点击开始看房
        async toSeeHouse() {
            // 取消读秒定时器
            if (this.onlineHouse.minuteTimer) clearInterval(this.onlineHouse.minuteTimer);
            let params = {
                room_id: this.onlineHouse.roomId,
                alloc_type: this.onlineHouse.allocType
            };
            try {
                const { data } = await commonApi.enterRoom(params);
                if (data.code === 0) {
                    // 进入房间成功,存入storage内，其他页面监听storage状态，自动关闭弹窗
                    localStorage.setItem(
                        'user_online',
                        JSON.stringify({
                            roomId: this.onlineHouse.roomId,
                            employeeId: this.onlineHouse.employeeId,
                            allocType: this.onlineHouse.allocType,
                            circulationType: this.onlineHouse.circulationType
                        })
                    );
                    this.$router.push({
                        path: '/liveRoom',
                        query: {
                            room_id: this.onlineHouse.roomId
                        }
                    });
                    this.onlineHouse.remindShow = false;
                    this.onlineHouse.invitationShow = false;
                } else {
                    this.onlineHouse.remindShow = false;
                    this.onlineHouse.invitationShow = false;
                    this.onlineHouse.noOnlineOrder = true;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 点击取消看房
        async cancelSeeHouse() {
            // 取消读秒定时器
            if (this.onlineHouse.minuteTimer) clearInterval(this.onlineHouse.minuteTimer);
            let params = {
                room_id: this.onlineHouse.roomId,
                alloc_type: this.onlineHouse.allocType,
                circulation_type: this.onlineHouse.circulationType
            };
            try {
                const { data } = await commonApi.cancelEnterRoom(params);
                if (data.code === 0) {
                    this.onlineHouse.remindShow = false;
                    this.onlineHouse.invitationShow = false;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 点击发送确认码
        async sendConfirmCode() {
            let start = 60;
            let params = {
                task_id: this.taskId
            };
            try {
                const res = await commonApi.getTalkingPopSendCode(params);
                if (res.data.code === 0) {
                    let timer = setInterval(() => {
                        start--;
                        this.remindCustomerCall.btnTxt = `(${start}秒)重新发送`;
                        this.remindCustomerCall.btnDisabled = true;
                        if (start === 0) {
                            this.remindCustomerCall.btnTxt = `发送确认码`;
                            this.remindCustomerCall.btnDisabled = false;
                            clearInterval(timer);
                        }
                    }, 1000);
                }
            } catch (err) {
                this.$message({
                    message: '发送失败，请重新发送',
                    type: null,
                    duration: 2000
                });
            }
        },
        // 校验确认码
        async checkConfirmCode() {
            let params = {
                order_id: this.remindCustomerCall.orderId,
                mobile: this.remindCustomerCall.mobile,
                code: this.remindCustomerCall.confirmCode,
                task_id: this.taskId
            };
            try {
                const res = await commonApi.getTalkingPopCheckCode(params);
                if (res.data.code === 0) {
                    this.remindCustomerCall.isShow = false;
                } else {
                    this.remindCustomerCall.isCodeWrong = true;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 轮询是否已给客户回电
        getPollingCustomerMissCall() {
            let timer = setInterval(async () => {
                let params = {
                    talking_id: this.remindCustomerCall.talkingID ? this.remindCustomerCall.talkingID : 1
                };
                try {
                    let result = await commonApi.getTalkingPop(params);
                    const { data, code } = result.data;
                    if (code === 0) {
                        // 如果is_show返回-1 咨询师已给客户回电 关闭弹窗
                        if (data.is_show === 1) {
                            if (!this.remindCustomerCall.isShow) {
                                // 如果弹窗已经打开，就不再重新打开
                                this.remindCustomerCall.isShow = this.parseBool(data.is_show);
                                this.remindCustomerCall.orderId = data.data.order_id;
                                this.remindCustomerCall.userName = data.data.user_name;
                                this.remindCustomerCall.mobile = data.data.mobile;
                                this.remindCustomerCall.talkTime = data.data.talk_time;
                                this.remindCustomerCall.deadlineTime = data.data.deadline_time;
                                this.remindCustomerCall.type = data.data.type;
                                this.remindCustomerCall.talkingID = data.data.talking_id;
                                this.remindCustomerCall.status = data.data.status;
                                this.remindCustomerCall.statusId = data.data.follow_status;
                            }
                        } else if (data.is_show === -1) {
                            this.remindCustomerCall.isShow = false;
                            clearInterval(timer);
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            }, 30000);
        },
        noNessAdd() {
            this.taskWarn = false;
            // 不用添加按钮 埋点
            commonFun.setTrack(this.noAddTrackId, this.trackCommon.info, '', this.trackCommon.backendApi);
        },
        // 点击公告确认按钮
        closeBbsNoicte() {
            if (!this.bbsNoicte.btnDisabled) {
                this.bbsNoicte.isShow = false;
                // 埋点
                let paraObj = {
                    role: this.trackCommon.info.role,
                    url: this.bbsNoicte.url,
                    pronouncement_id: this.bbsNoicte.bbsNotice.id
                };
                commonFun.setTrack('5798', this.trackCommon.info, paraObj, this.trackCommon.backendApi);
            }
        },
        //  跳转页面
        goTask(para, diff) {
            if (diff === 1) {
                //  外勤核实
                this.axios.post('/backend-api/api-user/task-popup-click').then(res => {
                    if (res.data.code === 0) {
                        window.location.href = para;
                    }
                });
            } else if (diff === 2) {
                // 发布任务
                // 点击 添加任务埋点
                commonFun.setTrack(this.addTrackId, this.trackCommon.info, '', this.trackCommon.backendApi);
                this.axios.post('/backend-api/api-user/task-no-add-task').then(res => {
                    if (res.data.code === 0) {
                        window.location.href = para;
                    }
                });
            } else if (diff === 3) {
                // 成绩录入
                this.axios.post('/backend-api/api-user/task-set-input').then(res => {
                    if (res.data.code === 0) {
                        window.location.href = para;
                    }
                });
            } else {
                window.location.href = para;
            }
            // 关闭弹窗
            this.houseStu = false;
            this.workOut = false;
            this.taskWarn = false;
            this.privatePhone = false;
            this.commonPhone = false;
            this.taskGrade = false;
            this.wxWriteVisible = false;
        },
        // 请求接口数据
        async getDialogData() {
            try {
                // 发送ajax请求  来判断展示哪个弹窗
                const res = await commonApi.getCommonDialogApi();
                if (res.data.code === 0) {
                    let resData = res.data.data;
                    // 个人手机号 和 企业手机号
                    this.privatePhone = this.parseBool(resData.bind_mobile.is_show);
                    this.commonPhone = this.parseBool(resData.bind_didi_mobile.is_show);
                    // 外勤弹窗
                    this.workOut = this.parseBool(resData.legwork.is_show);
                    this.outStu = resData.legwork.popup_legwork_confirm_data;
                    this.workOutUrl = resData.legwork.legwork_confirm_url;
                    // 楼盘学习任务未完成弹窗
                    this.houseStu = this.parseBool(resData.study_undo.is_show);
                    // 发布任务
                    this.taskWarn = this.parseBool(resData.publish_task.is_show);
                    this.taskWarnUrl = resData.publish_task.task_url;
                    this.taskCounName = resData.publish_task.no_study_task_arr;
                    this.noAddTrackId = resData.publish_task.data_track_click_not_add;
                    this.addTrackId = resData.publish_task.data_track_click_add;
                    // 成绩未录入  测试中
                    this.taskGrade = this.parseBool(resData.performance_undo.is_show);
                    this.taskGradeName = resData.performance_undo.result_input_task_arr;
                    this.taskGradeUrl = resData.performance_undo.tr_employee_url;
                    // 订单流转确认
                    this.orderConfirm.orderRemind = this.parseBool(resData.order_confirm.is_show);
                    this.orderConfirm.allowTime = resData.order_confirm.distribute_datetime;
                    this.orderConfirm.failTime = resData.order_confirm.deadline_datetime;
                    this.orderConfirm.options = resData.order_confirm.drop_reason;
                    this.orderConfirm.order_id = resData.order_confirm.order_id;
                    this.orderConfirm.affirm = resData.order_confirm.order_detail_url;
                    // 填写私人微信号
                    this.wxWriteVisible = this.parseBool(resData.no_personal_wechat.is_show);
                    this.writeWxUrl = resData.no_personal_wechat.confirm_url;
                    // 微信好友管理任务（待绑定/待分组）
                    this.wxTaskNoGroupNum = (resData.wechat_task && resData.wechat_task.no_group) || 0;
                    this.wxTaskNoBindNum = (resData.wechat_task && resData.wechat_task.no_bind) || 0;
                    this.wxIsTaskVisible = this.parseBool(resData.wechat_task.is_show);
                    this.wxIsTaskUrl = resData.wechat_task.confirm_url;
                    // 新订单提醒弹窗
                    this.newOrderRemaidList = resData.remind_orders || [];
                    if (Array.isArray(this.newOrderRemaidList) && this.newOrderRemaidList.length > 0) {
                        this.newOrderRemaidListFirst = this.newOrderRemaidList[0];
                        this.$set(this.newOrderRemaidListFirst, 'isShow', true);
                    }
                    // 公告
                    this.bbsNoicte.isShow = this.parseBool(resData.bbs_noicte.is_show);
                    this.bbsNoicte.url = resData.bbs_noicte.url;
                    this.bbsNoicte.bbsNotice = resData.bbs_noicte.bbs_notice;
                    if (this.bbsNoicte.isShow) {
                        this.bbsNoicteBtnTime();
                    }
                    // 提醒有客户未接来电
                    if (!this.remindCustomerCall.isShow) {
                        this.remindCustomerCall.isShow = this.parseBool(resData.talking_number.is_show);
                        this.remindCustomerCall.orderId = resData.talking_number.data.order_id;
                        this.remindCustomerCall.userName = resData.talking_number.data.user_name;
                        this.remindCustomerCall.mobile = resData.talking_number.data.mobile;
                        this.remindCustomerCall.talkTime = resData.talking_number.data.talk_time;
                        this.remindCustomerCall.deadlineTime = resData.talking_number.data.deadline_time;
                        this.remindCustomerCall.type = resData.talking_number.data.type;
                        this.remindCustomerCall.talkingID = resData.talking_number.data.talking_id;
                        this.remindCustomerCall.status = resData.talking_number.data.status;
                        this.remindCustomerCall.statusId = resData.talking_number.data.follow_status;
                    }
                    // 滴滴打车单
                    if (resData.didi.is_show !== 0) {
                        resData.didi.data.forEach(item => {
                            item.isShow = true;
                        });
                        this.didiOrder.resData = resData.didi.data;
                        // 获取订单下拉列表
                        this.getDidiSearchOrder();
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 提交扭转弹窗
        submitOrderRemind() {
            // 提交前参数校验
            if (this.orderConfirm.isCheckOrder === 2) {
                if (this.orderConfirm.reasonVal === '') {
                    this.$message({
                        message: '请选择放弃原因',
                        type: null,
                        duration: 1000
                    });
                    return false;
                }
                if (this.orderConfirm.reasonVal === 5) {
                    if (commonFun.trim(this.orderConfirm.remark).length === 0) {
                        this.$message({
                            message: '请填写备注内容',
                            type: null,
                            duration: 1000
                        });
                        return false;
                    }
                    if (commonFun.trim(this.orderConfirm.remark).length > 20) {
                        this.$message({
                            message: '备注最多20字',
                            type: null,
                            duration: 1000
                        });
                        return false;
                    }
                }
            }
            let params = {
                order_id: this.orderConfirm.order_id,
                is_confirm: this.orderConfirm.isCheckOrder,
                cause_type: this.orderConfirm.reasonVal,
                cause_remarks: this.orderConfirm.remark
            };
            // 请求订单分配确认接口
            this.axios
                .post('/backend-api/api-user/confirm-distribute', params)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            message: res.data.msg,
                            type: null,
                            duration: 1000
                        });
                        let resData = res.data.data;
                        if (resData.is_show === 0) {
                            this.orderConfirm.order_id = resData.order_id;
                            this.orderConfirm.affirm = resData.order_detail_url;
                            window.location.href = this.orderConfirm.affirm + '&order_id=' + this.orderConfirm.order_id;
                        } else {
                            this.orderConfirm.orderRemind = this.parseBool(resData.is_show);
                            this.orderConfirm.allowTime = resData.distribute_datetime;
                            this.orderConfirm.failTime = resData.deadline_datetime;
                            this.orderConfirm.options = resData.drop_reason;
                            this.orderConfirm.order_id = resData.order_id;
                            this.orderConfirm.affirm = resData.order_detail_url;
                            this.orderConfirm.isCheckOrder = resData.is_drop;
                        }
                    } else {
                        if (res.data.code === 2) {
                            this.$message({
                                message: res.data.msg,
                                type: null,
                                duration: 1000
                            });
                        } else {
                            this.$confirm(res.data.msg, '确认信息', {
                                confirmButtonText: '确认',
                                cancelButtonText: '取消'
                            })
                                .then(() => {
                                    let resData = res.data.data;
                                    if (resData.is_show === 0) {
                                        this.orderConfirm.affirm = resData.order_detail_url;
                                        this.orderConfirm.order_id = resData.order_id;
                                        window.location.href = this.orderConfirm.affirm + '&order_id=' + this.orderConfirm.order_id;
                                    } else {
                                        this.orderConfirm.orderRemind = this.parseBool(resData.is_show);
                                        this.orderConfirm.allowTime = resData.distribute_datetime;
                                        this.orderConfirm.failTime = resData.deadline_datetime;
                                        this.orderConfirm.options = resData.drop_reason;
                                        this.orderConfirm.order_id = resData.order_id;
                                        this.orderConfirm.affirm = resData.order_detail_url;
                                        this.orderConfirm.isCheckOrder = resData.is_drop;
                                    }
                                })
                                .catch(() => {
                                    this.orderConfirm.orderRemind = false;
                                });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    window.location.href = this.orderConfirm.affirm + '&order_id=' + this.orderConfirm.order_id;
                });
        },
        parseBool(para) {
            return para === 1;
        },
        // 公告按钮倒计时
        bbsNoicteBtnTime() {
            let start = 8;
            let timer = null;
            timer = setInterval(() => {
                start--;
                this.bbsNoicte.btnTxt = `(${start}s 后确定收到)`;
                if (start === 0) {
                    this.bbsNoicte.btnTxt = `确定收到`;
                    this.bbsNoicte.btnDisabled = false;
                    this.bbsNoicte.btnType = 'primary';
                    clearInterval(timer);
                }
            }, 1000);
        }
    },
    computed: {
        ...mapState(['trackCommon'])
    },
    beforeRouteLeave(to, from, next) {
        if (this.onlineHouse.timer) {
            clearInterval(this.onlineHouse.timer);
            this.onlineHouse.timer = null;
        }
        if (this.onlineHouse.minuteTimer) {
            clearInterval(this.onlineHouse.minuteTimer);
            this.onlineHouse.minuteTimer = null;
        }
        next();
    }
};
</script>

<style scoped>
.content-tip {
    color: #ff0000;
    font-size: 14px;
}
.online-dialog >>> .el-dialog__header {
    padding: 30px 0 20px;
    border: none;
}

.online-dialog .dialog-header {
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #3e4254;
    line-height: 25px;
}

.online-dialog >>> .el-dialog__body {
    padding: 0 30px;
}

.online-dialog .dialog-body li {
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    font-weight: 400;
    margin-bottom: 10px;
}
.online-dialog .dialog-body .interest-project {
    height: auto;
}
.online-dialog .dialog-body .interest-project .td {
    width: 280px;
}
.online-dialog .dialog-body .th {
    float: left;
    color: #77808a;
}

.online-dialog .dialog-body .td {
    float: left;
    color: #333;
}

.online-dialog >>> .el-dialog__footer {
    padding: 20px 0;
}

.online-dialog .dialog-footer .el-button {
    width: 132px;
    height: 38px;
    border-radius: 4px;
    padding: 8px 0;
    border: none;
}

.online-dialog .dialog-footer .cancel {
    background: #e6e6e6;
    color: #77808a;
}

.online-dialog .dialog-footer .confirm {
    background: #33a1ff;
    color: #fff;
}

.online-dialog .dialog-footer .el-button >>> span {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 22px;
}

.online-invitation-dialog .td span {
    color: #33a1ff;
    margin-left: 20px;
}

.con-dialog-wrap .remind-customer-call .content .txt,
.confirm-code {
    font-size: 14px;
}

.con-dialog-wrap .remind-customer-call li {
    margin-bottom: 0;
    line-height: 25px;
}

.con-dialog-wrap .remind-customer-call li .th {
    width: 70px;
    text-align: left;
    height: 25px;
}

.con-dialog-wrap .remind-customer-call .content .txt {
    margin-top: 20px;
}

.remind-customer-call .confirm-code .confirm-code-input {
    display: inline-block;
    width: 90px;
}
.remind-customer-call .s-query > li .red {
    color: #f00;
}

.remind-customer-call .confirm-code .confirm-code-input >>> .el-input__inner {
    height: 30px;
}

.remind-customer-call .confirm-code .tips {
    display: inline-block;
    height: 40px;
    width: 200px;
    line-height: 20px;
    vertical-align: bottom;
}

.remind-customer-call .confirm-code .tips-right-code {
    color: #f00;
}

.remind-customer-call .confirm-code-btn {
    text-align: center;
    margin-top: 20px;
}

.remind-customer-call .send-confirm-code {
    width: 110px;
    padding: 12px 0;
}

.con-dialog-wrap .el-dialog__footer .double-btn:first-child {
    float: left;
}

.con-dialog-wrap .el-dialog__footer .double-btn:last-child {
    float: right;
}

.con-dialog-wrap .double-btn {
    width: 47%;
}

.con-dialog-wrap .content > .tlt {
    text-align: center;
    padding-bottom: 20px;
}

.con-dialog-wrap .content > .txt {
    color: #666;
    font-size: 18px;
}

.con-dialog-wrap .content > p > span {
    margin-right: 10px;
    font-size: 20px;
    color: #2e9ae1;
}

.con-dialog-wrap .affrim-sub {
    text-align: center;
}

.con-dialog-wrap .el-radio {
    margin-right: 15px;
}

.con-dialog-wrap .note {
    color: #ff0000;
}

.con-dialog-wrap .new-order-th {
    text-align: left;
    font-weight: bold;
    width: 100px;
}

.con-dialog-wrap .new-order-list {
    margin-bottom: 0;
}

.con-dialog-wrap .delay-time {
    color: #f00;
}

.con-dialog-wrap .new-add {
    height: 80px;
    overflow-y: auto;
}
.taxi-order-dialog li {
    margin-bottom: 4px;
    line-height: 25px;
}
.taxi-order-dialog li .th {
    width: 100px;
    text-align: left;
    height: 25px;
}
</style>
<style>
.taxi-order-dialog .el-dialog__footer {
    padding-top: 0;
}
.con-dialog-wrap .el-dialog__header {
    border-bottom: 1px solid #eaeaea;
    padding: 20px;
}

.con-dialog-wrap .el-dialog__header .el-dialog__title,
.con-dialog-wrap .content > .tlt,
.con-dialog-wrap .el-dialog__header .order-remind {
    font-size: 22px;
    color: #333;
}

.con-dialog-wrap .el-dialog__body {
    font-size: 16px;
}

.con-dialog-wrap .single {
    width: 100%;
}

.con-dialog-wrap .el-dialog {
    border-radius: 8px;
}

.con-dialog-wrap .el-dialog__footer {
    overflow: hidden;
}

.con-dialog-wrap .el-dialog__footer .dialog-footer span {
    font-size: 18px;
}

.con-dialog-wrap .wx-write-dialog .el-dialog__footer {
    text-align: center;
}

.con-dialog-wrap .wx-write-dialog .el-dialog__footer .dialog-footer span {
    font-size: 14px;
}

.con-dialog-wrap .wx-write-dialog .dialog-footer .el-button--default {
    background-color: #fff;
    color: #606266;
}

.con-dialog-wrap .wx-write-dialog .dialog-footer .el-button {
    height: auto;
    width: auto;
    padding: 12px 20px;
}

.con-dialog-wrap .dialog-footer .single-primary {
    margin: 0 auto;
    display: block;
}

.con-dialog-wrap .bbs-noicte-txt {
    max-height: 340px;
    overflow-y: auto;
}

.con-dialog-wrap .bbs-noicte-pic {
    text-align: center;
}

.con-dialog-wrap .bbs-noicte-pic img {
    width: 480px;
    max-height: 340px;
    object-fit: contain;
}
</style>
