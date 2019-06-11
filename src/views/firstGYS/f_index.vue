<template>
	<yd-layout id='fIndex'>
		<div class="header" :class="{classBg:city}">
			<div ref='message' class="message">
				<div class="message_children">
					<img src="../../assets/firstImgs/home_icon-person@2x.png" alt="" />
					<div class="meassage_bottom">
						<div class="name">{{userInfo.nickName}}</div>
						<div class="name_tel">员工：{{userInfo.loginName}}&nbsp;&nbsp;{{userInfo.mobile}}</div>
					</div>
				</div>
			</div>
			<div class="feedback_information">
				<div @click="goFeedback" class="feedback_information_c">
					<yd-icon   size=".5rem" color="#018BE6" name="feedback"></yd-icon><strong>反馈信息</strong>
				</div>
			</div>
		</div>
		<div class="nav_list">
			<div class="kong" :style="kongStyle"></div>
			<div class="list_href">
				<div class="list_c_com" @click='goNext("Merchant",true)'>
					<img class="list_img" src="../../assets/firstImgs/home_icon_kjxd@2x.png" alt="" />
					<div class="list_right">
						<div class="list_title">快捷下单</div>
						<div class="list_sm">快速创建订单</div>
					</div>
				</div>
				<div class="list_c_com" @click='goNext("f_ddgl")'>
					<img class="list_img" src="../../assets/firstImgs/home_icon_ddgl@2x.png" alt="" />
					<div class="list_right">
						<div class="list_title">订单管理</div>
						<div class="list_sm">订单统计与处理</div>
					</div>
				</div>
			</div>
			<div class="list_href">
				<div class="list_c_com" @click='goNext("f_jcgl")'>
					<img class="list_img" src="../../assets/firstImgs/home_icon_jcgl@2x.png" alt="" />
					<div class="list_right">
						<div class="list_title">进场管理</div>
						<div class="list_sm">进场信息统计操作</div>
					</div>
				</div>
				<div class="list_c_com" @click='goNext("f_spgl")'>
					<img class="list_img" src="../../assets/firstImgs/home_icon_spgl@2x.png" alt="" />
					<div class="list_right">
						<div class="list_title">商品管理</div>
						<div class="list_sm">商品增删改查</div>
					</div>
				</div>
			</div>
			<div class="list_href">
				<div class="list_c_com" @click='goNext("f_tjfx")'>
					<img class="list_img" src="../../assets/firstImgs/home_icon_tjfx@2x.png" alt="" />
					<div class="list_right">
						<div class="list_title">统计分析</div>
						<div class="list_sm">数据统计与分析</div>
					</div>
				</div>
				<div v-if='true' class="list_c_com" @click='goNext("f_setting")'>
					<img class="list_img" src="../../assets/firstImgs/home_icon_xtsz@2x.png" alt="" />
					<div class="list_right">
						<div class="list_title">系统设置</div>
						<div class="list_sm">基础信息设置</div>
					</div>
				</div>
			</div>
			<div class="list_href" v-if='$root.userInfo.extend=="004"'>
				<div v-if='true' class="list_c_com" @click='goWantTobuy()'>
					<img class="list_img" src="../../assets/firstImgs/icon_caigou.png" alt="" />
					<div class="list_right">
						<div class="list_title">我要采购</div>
						<div class="list_sm">快捷购买商品</div>
					</div>
				</div>
			</div>
		</div>
		<footer class="f_footer">
			{{$root.config.footerName}}
		</footer>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: this.$root.userInfo,
				kongStyle: {
					width: '100%',
					height: '1.7rem'
				},
				city:CONFIG.ssbhbgimg?false:true,
			}
		},
		computed: {
			
		},
		created() {
			
			this.$store.dispatch('changeNavBarTitle', '首页')
			console.log(this.userInfo)
			if (!this.userInfo.userId) {
				this.$dialog.confirm({
					title: '提示:',
					mes: '请先登录！',
					opts: [{
						txt: '确定',
						color: true,
						callback: () => {
							this.$router.push({
								name: 'f_login'
							})
						}
					}]
				});
			} else if (this.userInfo.typeId == 'buyer') {
				this.$router.back();
			}
		},
		watch: {

		},
		
		mounted() {
			
			
			this.kongStyle = {
				width: '100%',
				height: this.$refs.message.offsetHeight / 100 * 2 + 'rem'
			}
		},
		methods: {
			goFeedback(){
				this.$router.push({
					name:'f_feedback',
				})
			},
			goNext(href, sellerId) {
				var o = {
					name: href
				}
				if (sellerId) {
					o = {
						name: href,
						query: {
							sellerId: this.$root.userInfo.typeCode
						}
					}
				}
				this.$router.push(o)
			},
			/**
			 * 门店账号跳转店铺列表页面购买商品
			 */
			goWantTobuy() {
				let userInfo = localStorage.getItem('quickUserInfo')
				localStorage.setItem('userInfo', userInfo)
				sessionStorage.setItem('f_index',1)
				window.location.href = 'http://ssbh.yshfresh.com/mp/index.html#/NorthDoorStore'
				
				// window.location.href = 'http://ssbh.yshfresh.com/mp/index.html#/NorthDoorStore'
				// window.location.href = 'http://localhost:8083/#/NorthDoorStore?mdjunp=1'
			}
		}
	}
</script>

<style lang='scss'>
	#fIndex {
		color: #0C0007;

		/*line-height: .4rem;*/
		img {
			display: block;
		}

		.header {
			position: relative;
			width: 100%;
			height: 4.51rem;
			background: url(../../assets/firstImgs/home_img_banner@2x.png) no-repeat;
			background-size: contain;
			.feedback_information{
				justify-content: flex-end;
				display:flex;
				.feedback_information_c{
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}
				strong{
					color: #018BE6;
					font-size: .3rem;
					padding-right: .2rem;
					line-height: .6rem;
				}
				
			}
			.message {
				width: 100%;
				position: absolute;
				top: 4rem;

				.message_children {
					margin: auto;
					width: 7.1rem;
					padding: .5rem .2rem;
					background: white;
					border-radius: .1rem;
					box-shadow: 6px 10px 20px rgba(6, 58, 95, 0.1);
					display: flex;

					img {
						width: .35rem;
						height: .42rem;
						margin: 0 .35rem 0 .2rem;
					}

					.meassage_bottom {
						line-height: .4rem;

						.name {
							font-weight: bold;
							font-size: .34rem;
							margin-bottom: .18rem;
						}

						.name_tel {
							font-size: .28rem;
						}
					}
				}
			}
		}

		.classBg {
			background: url(../../assets/firstImgs/home_img_banner@2x_1.png) no-repeat;
			background-size: contain;
		}

		.nav_list {
			color: #343434;
			margin-bottom: .3rem;
			font-size: .24rem;

			.kong {
				background: white;
			}

			.list_href {
				background: white;
				display: flex;
				padding: 0 .2rem .2rem .2rem;

				.list_c_com {
					background: -webkit-linear-gradient(180deg, #f9f9fd, #FFFFFF);
					/* Safari 5.1 - 6.0 */
					background: -o-linear-gradient(180deg, #f9f9fd, #FFFFFF);
					/* Opera 11.1 - 12.0 */
					background: -moz-linear-gradient(180deg, #f9f9fd, #FFFFFF);
					/* Firefox 3.6 - 15 */
					background: linear-gradient(180deg, #f9f9fd, #FFFFFF);
					/* 标准的语法 */
					width: 50%;
					height: 1.6rem;
					box-sizing: border-box;
					padding: .36rem .2rem .3rem .2rem;
					/*margin-right: .2rem;*/
					align-items: center;
					display: flex;

					.list_img {
						width: .86rem;
						height: .94rem;
						margin-right: .2rem;
					}

					.list_title {
						color: #0C0007;
						font-size: .3rem;
						font-weight: bold;
						margin-bottom: .03rem;
					}
				}

				/*.list_c_com:nth-child(2n){
					border-right: none;
				}*/
			}
		}
	}
</style>
