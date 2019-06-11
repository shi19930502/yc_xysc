<template>
	<yd-layout>
		<div id="UserReg">
			<yd-cell-group>
				<yd-cell-item>
					<span slot="left">
          <div class="lable">
            <strong>昵称</strong>
          </div>
       </span>
					<yd-input v-model="form.name" slot="right" max="20" placeholder="请输入昵称"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
          <!--<div class="lable">
            <strong>用户名</strong>
          </div>
        </span>
					<yd-input v-model="form.loginName" slot="right" max="20" placeholder="请输入用户名"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">-->
          <div class="lable">
          	<strong>身份</strong>
          </div>
        </span>
					<span slot="left">
						<!--:class="cgsActive ? 'sfbtn active' : 'sfbtn '"-->
          <span  class="sfbtn active" @click="cgsClick">采购商</span>
					<!--<span :class="gysActive ? 'sfbtn active' : 'sfbtn'" @click="gysClick">供应商</span>-->

					<!--<yd-badge shape="square" type="hollow">采购商</yd-badge>
          <yd-badge shape="square" type="hollow">供应商</yd-badge>-->
					</span>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
          <div class="lable">
            <strong>联系电话</strong>
          </div>
        </span>
					<yd-input regex="mobile" v-model="form.telephone" slot="right" max="20" placeholder="请输入联系电话"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
          <div class="lable">
            <strong>密码</strong>
          </div>
        </span>
					<yd-input v-model="form.password" type="password" slot="right" max="20" placeholder="请输入密码"></yd-input>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
          <div class="lable">
            <strong>确认密码</strong>
          </div>
        </span>
					<yd-input v-model="repassword" type="password" slot="right" max="20" placeholder="请确认密码"></yd-input>
				</yd-cell-item>
			</yd-cell-group>
			<!--v-show="cgsActive"-->
			<yd-cell-group>
				<yd-cell-item>
					<span slot="left">
          <div class="lable">
            <strong>邀请码</strong>
          </div>
        </span>
					<!--<yd-input v-model="form.invitationCode" slot="right" max="20" placeholder="选填"></yd-input>-->
					<div slot="left" max="20">{{form.invitationCode}}</div>
				</yd-cell-item>
			</yd-cell-group>
			<yd-cell-group v-show="gysActive">
				<yd-cell-item arrow>
					<span slot="left">
          <div class="lable">
            <strong>渠道</strong>
          </div>
        </span>
					<select slot="right" v-model="form.channelCode">
						<option :value="d.code" v-for="d in ChannelList">{{d.name}}</option>
					</select>
				</yd-cell-item>
			</yd-cell-group>
			<div class="flex flex-x-center" style="padding: 0 0.24rem;">
				<div @click="save" class="loginbtn flex flex-y-center flex-x-center">
					<span>注册</span>
				</div>
			</div>
		</div>
	</yd-layout>
</template>
<script>
	import mixin from '../../utils/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				cgsActive: false,
				gysActive: false,
				form: {
					name: '',
					telephone: '',
					key: 'buyer',
					password: '',
					channelCode: '',
					invitationCode: '',
					loginName: '',
				},
				repassword: '',
				ChannelList: [],
			}
		},
		created() {
			console.log(("6401210070001#/qrcodelogin").split('#/'))
			this.$store.dispatch('changeNavBarTitle', '注册')
			if(sessionStorage.getItem('isQrCode') == 1 && sessionStorage.getItem('loginInvitationCode')) {
				this.form.invitationCode = sessionStorage.getItem('loginInvitationCode')
			} else {
				this.$router.push({ name: 'Login' })
			}
		},
		mounted() {

		},
		methods: {
			/**
			 * 获取渠道
			 */
			getChannelList() {
				this.postRequest('channel/list', {
					level: 1
				}).then(d => {
					if(d.data && d.data.state == 0) {
						if(d.data.aaData) {
							this.ChannelList = d.data.aaData
						}
					}
				})
			},
			/**
			 * 保存
			 */
			save() {

				if(this.form.name == '') {
					this.$dialog.alert({
						mes: '请填写昵称~~'
					});
					return
				}
//				if(this.form.loginName == '') {
//					this.$dialog.alert({
//						mes: '请填写用户名~~'
//					});
//					return
//				}
				if(this.form.key == '') {
					this.$dialog.alert({
						mes: '请填选择身份~~'
					});
					return
				}
				if(this.form.telephone == '') {
					this.$dialog.alert({
						mes: '请填写联系电话~~'
					});
					return
				}
				var reg = /^1(3|4|5|7|8)\d{9}$/
				if(!reg.test(this.form.telephone)) {
					this.$dialog.alert({
						mes: '请输入正确的手机号码~~'
					});
					return
				} else {
					this.postRequest('customer/telephoneMatche', {
						telephone: this.form.telephone
					}).then(d => {
						if(d.data && d.data.state == 0) {
							if(d.data.state != 1) {
								this.$dialog.alert({
									mes: d.data.msg
								});
							}
						}
					})
				}
				if(this.form.password == '') {
					this.$dialog.alert({
						mes: '请填写密码~~'
					});
					return
				}
				if(this.form.repassword == '') {
					this.$dialog.alert({
						mes: '请确认密码~~'
					});
					return
				}
				if(this.repassword != this.form.password) {
					this.$dialog.alert({
						mes: '两次密码不一致~~'
					});
					return
				}
				if(this.form.key == 'merchant' && this.form.channelCode == '') {
					this.$dialog.alert({
						mes: '请选择渠道~~'
					});
					return
				}

				this.postRequest('customer/customerRegist', this.form).then(d => {
					if(d.data && d.data.state == 0) {
						this.$dialog.toast({
							mes: '保存成功',
							timeout: 1200,
							icon: 'success',
							callback: function() {
								this.$router.push({
									name: 'qrcodelogin'
								})
							}.bind(this)
						});
					} else {
						this.$dialog.alert({
							mes: d.data.msg
						})
					}
				})
			},
			/**
			 * 选择采购商
			 */
			cgsClick() {
				this.form.key = 'buyer'
				this.cgsActive = true
				this.gysActive = false
			},
			/**
			 * 选择供应商商
			 */
			gysClick() {
				this.form.key = 'merchant'
				this.cgsActive = false
				this.gysActive = true
			}
		}
	};
</script>
<style lang="scss">
	#UserReg {
		select {
			color: #333;
			padding-left: 5px;
		}
		.lable {
			width: 1.8rem;
			font-size: 0.3rem;
		}
		.loginbtn {
			width: 100%;
			height: 0.78rem;
			background: #6FB138;
			border-radius: 0.39rem;
			color: #fff;
			font-size: 0.31rem;
			text-align: center;
		}
		.sfbtn {
			border: 1px solid #C6C6C6;
			padding: 3px 10px;
			border-radius: 3px;
			margin-right: 5px;
		}
		.sfbtn.active {
			border: 1px solid #6FB138;
			background: #6FB138;
			color: #fff;
		}
	}
</style>