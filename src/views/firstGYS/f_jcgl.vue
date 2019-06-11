<template>
	<yd-layout id='fJcgl'>
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="#/f_index" class="header_left">首页</a>
				<div v-else></div>
			</div>
			<div class="name">进场列表</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' @click='goXZ' href="javascript:;">新增进场</a>
				<div v-else></div>
			</div>
		</div>
		<div class="content">
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div class="list" slot='list'>
					<div class="list_children" @click='goJcxq(item)' v-for='(item,index) in dataList'>
						<div class="list_top">
							<div class="name"><span v-if='item.detailNum>0'>共{{item.detailNum}}件商品&nbsp;</span><span class="car"><i>{{item.transporterId}}</i></span></div>
							<div v-if='item.statusId==0' class="time">已预告</div>
							<div v-else-if='item.statusId==1' class="time">已进场</div>
							<div v-else-if='item.statusId==2' class="time">已出场</div>
							<div v-else-if='item.statusId==3' class="time">作废</div>
						</div>
						<!--wholesaleMarketName-->
						<div class="indate">
							<span>{{item.inDate}}</span>
							<span v-if='item.statusId==1&&$root.config.systemid==8&&item.detailNum!=0&&$root.config.ssbhbgimg' @click='lookQr(item)' class="look_qr">查看二维码</span>
							<span v-if='item.statusId==0&&$root.config.systemid==7' @click='ygClick(item,index,true)' class="look_qr">确认预告</span>
							<span v-if='item.statusId==1&&$root.config.systemid==7' @click='ygClick(item,index,false)' class="look_qr">出场</span>
						</div>

						<div class="list_bottom" v-if='item.statusId!=0'>
							<div>
								<div class="list_name">{{item.wholesalerName}}</div>
								<div v-if='true' class="name">
									{{item.areaName}}&nbsp;&nbsp; {{item.baseName}}
								</div>
							</div>
							<div v-if='item.statusId==1' class="list_bottom_btn">
								<div v-if='item.detailNum==0' @click='goXzjcXz(item.id)' class="sz_btn">设置详情</div>
								<img v-else @click='goXzjcXz(item.id)' src="../../assets/firstImgs/jcgl_icon_edit@2x.png" alt="" />
							</div>
						</div>
						<img v-if='item.statusId==2' class="list_cczf" src="../../assets/firstImgs/img_yichuc@2x.png" alt="" />
						<img v-else-if='item.statusId==3' class="list_cczf" src="../../assets/firstImgs/img_yizuofei@2x.png" alt="" />
						<!--<div v-if='item.statusId==2||item.statusId==3' class="list_cc">
							{{item.statusId==2?"已出场":"作废"}}
						</div>-->
					</div>
				</div>

				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>

				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />

			</yd-infinitescroll>
		</div>
		<yd-popup v-model="qrShow" position="center" width="100%">
			<div class="qr_bg">
				<qriously id='qrRef' v-show='false' :backgroundAlpha="backgroundAlpha" ref='qrRef' :value="initQCode" :size="400" />
				<img :src="imgSrc" alt="" />
			</div>

		</yd-popup>
		<yd-popup v-model="ygShow" position="center" width="90%">

			<div class="yg_content">
				<div class="yg_car_num">车牌号：{{inWeightObj.transporterId}}</div>
				<div class="yg_inweight">
					<span>{{isIn?'进场重量':'出场重量'}}：</span>
					<input maxlength="9" @input='ygChangeInput(ygWeight)' v-model='ygWeight' :placeholder="isIn?'请输入进场重量':'请输入出场重量'" class="inweight_input" type="text" />
					<span>千克</span>
				</div>
				<div @click='ygSubmit' v-if='ygWeight&&ygWeight>0' class="yg_btn">{{isIn?'确认进场':'确认出场'}}</div>
				<div style="background: #DDDDDD;" v-else class="yg_btn">{{isIn?'确认进场':'确认出场'}}</div>
			</div>
		</yd-popup>
	</yd-layout>
</template>

<script>
	import VueQriously from 'vue-qriously'
	import Vue from 'vue'
	Vue.use(VueQriously)
	export default {
		data() {
			return {
				initQCode: '',
				pageNum: 1,
				pageSize: 10,
				dataList: [],
				isXg: false,
				qrShow: false,
				backgroundAlpha: 1,
				imgSrc: '',
				ygShow: false,
				ygWeight: '',
				inWeightObj: {},
				inWeightNum:0,
				isIn:true,
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '进场管理')
			sessionStorage.setItem('XZJC_edit', '')
			sessionStorage.setItem('mainId', '')
		},
		watch: {
			qrShow(val) {
				if(val) {
					this.isXg = false;
				}
			},
			ygShow(val) {
				if(val) {
					this.isXg = false;
				}
			}
		},
		computed: {

		},
		mounted() {
			if(this.$root.config.systemid == 8) {
				this.getCode().then(() => {
					this.loadList()
				})
			} else {
				this.loadList()
			}

		},
		methods: {
			ygSubmit() {
				if(!this.ygWeight) {
					this.$dialog.toast({
						mes: '请输入进场重量！',
						timeout: 1500
					});
				} else {
					this.$dialog.loading.open('加载中，请稍后...');
					var params= {
						id: this.inWeightObj.id,
						statusId: this.isIn?1:2,
					}
					this.isIn?params.inWeight= this.ygWeight:params.outWeight= this.ygWeight;
					
					this.postRequest('inmarketdetail/updateStatusByMainId',params).then(resp => {
						this.$dialog.loading.close();
						if(resp.data.success&&resp.data.state==0){
							if(this.isIn){
								this.inWeightObj.statusId=1
								this.inWeightObj.inWeight=this.ygWeight
								this.inWeightObj.statusName="已确认进场"
							}else{
								this.inWeightObj.statusId=2
								this.inWeightObj.outWeight=this.ygWeight
								this.inWeightObj.statusName="已出场"
							}
							this.$set(this.dataList,this.inWeightNum,this.inWeightObj)
							this.ygShow=false
							this.$dialog.notify({
			                    mes: '操作成功',
			                    timeout: 1500,
			                    icon: 'success',
			                    callback: () => {
			                    	
			                    }
			                });
							
						}else{
							this.ygShow=false
							this.$dialog.notify({
			                    mes: '操作失败',
			                    timeout: 3000,
			                    callback: () => {
			                    	
			                    }
			                });
						}
					})
				}
			},
			convertCanvasToImage(canvas) {
				var image = new Image();
				image.src = canvas.toDataURL("image/png");
				return image;
			},
			getCode() {
				return new Promise((resolve, reject) => {
					this.postRequest('customer/queryById', {
						id: this.$root.userInfo.typeCode
					}).then(resp => {
						if(resp.data.aaData){
							this.customerCode = resp.data.aaData.code
						}
						resolve()
					})
				})

			},
			loadList() {
				this.$dialog.loading.open('数据加载中...');
				var params = {
					//channelCode: this.$root.userInfo.typeCode,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				if(this.$root.config.systemid == 8) {
					params.wholesalerId = this.customerCode
				}
				this.postRequest('inmarketmain/baseList', params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data && resp.data.state == 0) {
						this.dataList = [...this.dataList, ...resp.data.aaData];
						if(this.dataList.length >= resp.data.dataCount) {
							/* 所有数据加载完毕 */
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
							return;
						}
						/* 单次请求数据完毕 */
						if(resp.data.aaData.length > 0) {
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
						}
						this.pageNum++;
					}
				})

			},
			goXZ() {
				
				if(this.$root.config.ssbhbgimg){
					if(this.$root.config.isTowGYS) {
						sessionStorage.setItem('XZJC_isEdit',false)
						this.$router.push({
							name: 'f_xzjc_xxlr'
						})
					} else {
						this.$router.push({
							name: 'f_xzjc_car'
						})
					}
				}else{
					sessionStorage.setItem('XZJC_isEdit',false)
					this.$router.push({
						name: 'f_xzjc_xxlr'
					})
				}
				

				//				if(localStorage.getItem('XZJC_add')){
				//					this.$dialog.confirm({
				//	                    title: '提示：',
				//	                    mes: '你尚有未完成的新增进场，是否前往？',
				//	                    opts: [
				//	                        {
				//	                            txt: '取消',
				//	                            color: false,
				//	                            callback: () => {
				//	                                
				//	                            }
				//	                        },
				//	                        {
				//	                            txt: '新建新增进场',
				//	                            color: '#018BE6',
				//	                            callback: () => {
				//	                            	sessionStorage.setItem('XZJC_search','')
				//									localStorage.setItem('XZJC_add','')
				//	                            	sessionStorage.setItem('XZJC_isEdit',false)
				//	                            	this.$router.push({
				//	                            		name:'f_xzjc_xz',
				//	                            	})
				//	                            }
				//	                        },
				//	                        {
				//	                            txt: '前往',
				//	                            color: true,
				//	                            callback: () => {
				//	                            	sessionStorage.setItem('XZJC_isEdit',false)
				//	                            	var name='f_xzjc_xz'
				//	                            	if(JSON.parse(localStorage.getItem('XZJC_add')).step==2){
				//	                            		name='f_xzjc_xg'
				//	                            	}else if(JSON.parse(localStorage.getItem('XZJC_add')).step==3){
				//	                            		name='f_xzjc_xxlr'
				//	                            	}
				//	                                this.$router.push({
				//	                            		name:name,
				//	                            	})
				//	                            }
				//	                        }
				//	                    ]
				//	                });
				//				}else{
				//	                sessionStorage.setItem('XZJC_isEdit',false)
				//	                
				//					this.$router.push({
				//	                    name:'f_xzjc_xz',
				//	                })
				//				}

			},
			lookQr(item) {
				var name = "first"
				if(this.$root.config.loginname && this.$root.config.loginname == 'md') {
					name = 'second'
				}
				var urlParams = 'fLogin_' + name + "_" + this.$root.userInfo.typeCode + '_' + item.id
				console.log(urlParams)
				this.isXg = true;
				this.qrShow = true
				console.log(item)
				if(this.$root.userInfo.quickLogin) {
					this.initQCode = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc197a55ff6d0decc&redirect_uri=" + this.$root.config.wX_URL + "&response_type=code&scope=snsapi_base&state=" + urlParams + "#wechat_redirect"
				} else {
					this.initQCode = this.$root.config.wX_URL + "?code=081H2kqP1CRtO11HO6sP1JHZpP1H2kqv&state=" + urlParams + "#/qr_index"
				}

				this.$nextTick(() => {
					var canvas = document.getElementsByTagName('canvas')
					this.imgSrc = canvas[0].toDataURL("image/png");
					//					this.convertCanvasToImage(canvas)
				})
			},
			ygClick(item,num,isIn) {
				this.isXg = true;
				this.ygShow = true;
				this.ygWeight='';
				console.log(isIn)
				isIn?this.isIn=true:this.isIn=false
				this.inWeightObj = item
				this.inWeightNum = num
			},
			//编辑
			goXzjcXz(id) {
				this.isXg = true;
				sessionStorage.setItem('XZJC_isEdit', true)
				sessionStorage.setItem('XZJC_isJcgl', true)
				sessionStorage.setItem('mainId', id)
				this.$router.push({
					name: 'f_xzjc_xxlr', //f_xzjc_xz 老的
					query: {
						mainId: id
					}
				})
			},

			goJcxq(item) {
				if(item.statusId == 0) {
					var massage = '请等待管理员确认进场~_~'
					if(this.$root.userInfo.typeId == 'market' && this.$root.config.systemid == 7) {
						//						massage='请使用管理后台系统做进场登记确认！'
						massage = '请先确认预告！'
					}
					if(this.ygShow) {

					} else {
						this.$dialog.alert({ mes: massage })
					}

				} else {
					if(!this.isXg) {
						this.$router.push({
							name: 'f_jcxq',
							query: {
								mainId: item.id
							}
						})
					}
				}
			},
			ygChangeInput(val) {
				if(val) {
					if(val.length > 9) {
						val = val.slice(0, 9)
					}
					var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
						reg_2 = /^[0-9]{1,}$/;
					if(reg_1.test(val) || reg_2.test(val)) {
						if(val > 999999.99) {
							val = '999999.99'
						}
					} else {
						if(val) {
							val = val.slice(0, val.length - 1)
							if(val > 0) {

							} else {
								val = ''
							}
						}
					}
				}
				this.ygWeight = val
			},
		}
	}
</script>
<style lang='scss'>
	#fJcgl {
		img {
			display: block;
		}
		.yd-list-loading {
			background: #efeff3;
		}
		.content {
			background: white;
			.list_children {
				position: relative;
				padding: .34rem .32rem .34rem 0;
				margin-left: .32rem;
				color: #343434;
				font-size: .28rem;
				border-bottom: 1px solid #E1E1E1;
				.list_top {
					display: flex;
					justify-content: space-between;
					font-size: .32rem;
					font-weight: 700;
					/*align-items: center;*/
					color: #211E1D;
					.name {
						flex: 1;
						display: flex;
						align-items: center;
					}
					.time {
						width: 1.3rem;
						
						font-size: .28rem;
						font-weight: normal;
						color: #848484;
						&:after {
							width: .11rem;
							height: .2rem;
							display: inline-block;
							content: '';
							background: url(../../assets/imgs/list_icon_right.png) no-repeat;
							background-size: contain;
							margin-left: .16rem;
						}
					}
				}
				.indate {
					font-family: 'PingFang-SC-Medium';
					font-size: .28rem;
					color: #848484;
					margin: .15rem 0 .15rem 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.look_qr {
						/*border: 1px solid #018BE6;*/
						padding: .05rem .1rem;
						border-radius: .04rem;
						color: #018BE6;
					}
				}
				.car {
					/*display: inline-block;*/
					/*margin-top: .05rem;*/
					font-size: .28rem;
					line-height: .32rem;
					/*height: .32rem;*/
					max-width: 3.2rem;
					flex: 1;
					i{
						font-weight: 700;
						padding: 0 .12rem;
						border-radius: 2px;
						display: inline-block;
						border: 1px solid rgba(112, 112, 112, 1);
					}
				}
				.list_name {
					font-size: .28rem;
				}
				.list_bottom {
					display: flex;
					justify-content: space-between;
					/*align-items: center;*/
					.name {
						color: #848484;
						padding: .1rem .2rem 0 0;
						/*flex-grow: 0;*/
						width: 5.2rem;
						word-break:break-all;
					}
					.list_bottom_btn {
						display: flex;
						align-items: flex-end;
					}
					.sz_btn {
						color: #018BE6;
						font-size: .28rem;
						padding: 0 .13rem;
						/*line-height: .52rem;
						height: .52rem;*/
						/*height: .48rem;*/
						/*border: 1px solid #018BE6;*/
						border-radius: .04rem;
						/*width: 1.65rem;*/
						font-weight: 500;
						text-align: right;
						flex-grow: 1;
					}
					img {
						width: .4rem;
						height: .4rem;
						position: relative;
						z-index: 20;
					}
				}
				.list_cczf {
					width: 1.54rem;
					height: 1.17rem;
					position: absolute;
					top: 1.07rem;
					right: .05rem;
				}
				.list_cc {
					position: absolute;
					top: .96rem;
					right: 1rem;
					width: 1.08rem;
					height: 1.08rem;
					color: white;
					background: rgba(0, 0, 0, .2);
					border-radius: 50%;
					z-index: 9999;
					display: flex;
					align-items: center;
					justify-content: space-around;
					text-align: center;
				}
			}
			.list_children:last-child {
				/*border-bottom: none;*/
			}
		}
		.yd-scrollview:after {
			display: none;
		}
		.qr_bg {
			background: white;
			padding: .2rem;
			margin: auto;
			text-align: center;
			img {
				margin: auto;
				border: .1rem solid #D6D6D6;
				width: 200px;
				height: 200px;
			}
		}
		.yg_content {
			background: white;
			height: 30%;
			padding: .5rem .25rem .8rem .25rem;
			border-radius: .1rem;
			.yg_car_num {
				font-size: .32rem;
				font-weight: bold;
				padding: .2rem 0;
				text-align: center;
			}
			.yg_inweight {
				width: 90%;
				margin: .4rem auto .4rem;
				font-size: .28rem;
				align-items: center;
				display: flex;
				span {
					flex-grow: 0;
					text-align: right;
				}
				.inweight_input {
					width: 1rem;
					flex-grow: 1;
					margin: 0 .15rem 0 0;
					height: .6rem;
					outline: none;
					font-size: .28rem;
					padding: .2rem;
					border: 1px solid #D0D0D0;
				}
			}
			.yg_btn {
				width: 80%;
				background: #80c551;
				color: white;
				border-radius: .45rem;
				text-align: center;
				line-height: .88rem;
				margin: auto;
				font-size: .32rem;
			}
		}
	}
</style>