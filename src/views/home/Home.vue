<template>
	<div id="Home">
		<a href="http://10.2.15.105:8066/#/Enshrine">113212</a>
		<div class="header gradient">
			<!--<div class="search">
        <yd-icon name="search" color="#fff" size="0.5rem"></yd-icon>
      </div>-->
			<yd-flexbox direction="vertical">
				<yd-flexbox-item>
					<div id="main"></div>
				</yd-flexbox-item>
				<yd-flexbox-item @click.native="lookMesg">
					<div class="rollnotice flex flex-x-between flex-y-center">
						<div class="iconwrap">
							<div class="rollnotice-icon flex flex-y-center">
								<img src="../../assets/imgs/img_xitgg@2x.png" style="width: 0.42rem; height: 0.42rem;">
							</div>
						</div>
						<div class="flex-item-5">
							<yd-rollnotice autoplay="5000" height="40">
								<template v-if="msgdataList.length>0">
									<yd-rollnotice-item v-for="d in msgdataList">{{d.comment.length>23?d.comment.substring(0,23)+'...':d.comment}}</yd-rollnotice-item>
								</template>
								<template v-else>
									<yd-rollnotice-item>暂无系统公告</yd-rollnotice-item>
								</template>
							</yd-rollnotice>
						</div>
					</div>
				</yd-flexbox-item>
			</yd-flexbox>
		</div>
		<!-- 最新采购 -->
		<div class="zxcg">
			<info-card title="最新采购" moreBtnText="查看全部采购" @click="toAllPurchase">
				<template v-if="newestOrder.sellerName">
					<div class="heade flex flex-y-center">
						<div class="img">
							<!--<img v-if="orderitem.productPicUrl" :src="imgURL+orderitem.productPicUrl" alt="">-->
							<img src="../../assets/imgs/img_dianpu.png">
						</div>
						<div class="flex-item-6">
							<p class="name flex flex-x-between">
								<strong>{{newestOrder.sellerName}}</strong>
								<span>{{newestOrder.orderStatusName}}</span>
							</p>
							<p style="color:#989E92">{{newestOrder.createdDate}}</p>
						</div>
					</div>
					<div class="card-body" @click="toOrderDetails(newestOrder.id,newestOrder.orderUmber)">
						<div class="flex flex-x-between flex-y-center">
							<div class="flex">
								<template v-for="orderitem,key in newestOrder.orderitemList">
									<div class="product-img" v-if="key<4">
										<img v-if="orderitem.productPicUrl" :src="imgURL+orderitem.productPicUrl" alt="">
										<img v-else src="../../assets/imgs/img_moren@2x.png">
									</div>
								</template>
							</div>
							<div v-if="newestOrder.sl>4">
								<img src="../../assets/imgs/icon_more.png" style="width: 0.5rem;height: 0.1rem;">
							</div>
							<div class="tar">
								<p class="price">
									<span v-if="newestOrder.sortingOrderTotal==null && newestOrder.inspectedOrderTotal==null">{{'￥'+newestOrder.orderTotal/100}}</span>
									<span v-show="newestOrder.sortingOrderTotal>0 && newestOrder.inspectedOrderTotal==null">{{'￥'+newestOrder.sortingOrderTotal/100}}</span>
									<span v-show="newestOrder.inspectedOrderTotal>0">{{'￥'+newestOrder.inspectedOrderTotal/100}}</span>
								</p>
								<p class="sl" style="font-size: 0.24rem;">共{{newestOrder.sl}}件</p>
								<!--<p>
									<yd-badge shape="square" bgcolor="#FE971D" color="#FFF">{{newestOrder.distributionType = 1 ? '当天配送' : '次日配送'}}</yd-badge>
								</p>-->
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="flex flex-x-center" style="padding:0.2rem;color: #989E92;">暂无采购数据</div>
				</template>
				<!-- <infoCardList></infoCardList> -->
			</info-card>
		</div>
		<!-- 最新账单 -->
		<!--<info-card title="最新账单" @click="toAllBill">
			<div class="heade flex flex-x-between flex-y-center">
				<div class="img">
					<img src="../../assets/imgs/icon_jiesuan.png">
				</div>
				<div class="flex-item-5">
					<p class="name"><strong>账户结算</strong></p>
					<p style="color:#989E92">2017-12-30 11:23:11</p>
				</div>
				<div class="flex-item-2 tar">
					<span>-30000.00</span>
				</div>
			</div>
		</info-card>-->
		<!-- 收藏 -->
		<menuTab :item-click="menuclick" :dataList="menu"></menuTab>
		<ul class="list collection" v-show="showSellerList" v-if="sellerList.length>0">
			<li v-for="d in sellerList">
				<div class="flex flex-x-between flex-y-center">
					<div class="list-img">
						<img v-if="d.headPicUrl" :src="imgURL+d.headPicUrl" />
						<img v-else src="../../assets/imgs/img_dianpu.png">
					</div>
					<div class="flex-item-5">
						<p class="name">
							<strong>{{d.storeName}}</strong>
						</p>
						<yd-badge shape="square" bgcolor="#FE971D" style="padding: 0 6px;">{{d.distributionToday==1?'支持当天配送':'次日配送'}}</yd-badge>
						<p style="color:#989E92;margin-top: 3px;">配送时间：{{d.distributionStart}}:00~{{d.distributionEnd}}:00</p>
					</div>
					<div class="tar">
						<div class="flex flex-y-center">
							<img src="../../assets/imgs/mine_icon_phone.png" style="width: 0.34rem;height: 0.34rem;">
							<span style="color:#4D7BFE;margin-left: 0.1rem;">
								<a :href="'tel:'+d.phoneNumber">联系商家</a>
							</span>
						</div>
					</div>
				</div>
			</li>
		</ul>
		<div v-else class="empty" v-show="showSellerList">还没有收藏店铺~~ </div>
		<!-- 收藏商品 -->
		<ul class="list collection" v-show="showProductcollection" v-if="productcollection.length>0">
			<li v-for="d in productcollection">
				<div class="flex flex-x-between flex-y-center">
					<div class="list-img">
						<img v-if="d.proPic" :src="imgURL + d.proPic ">
						<img v-else src="../../assets/imgs/img_moren@2x.png">
					</div>
					<div class="flex-item-5">
						<p class="name">
							<strong>{{d.productName}}</strong>
						</p>
						<p style="color:#989E92">{{d.sellerName}}</p>
					</div>
				</div>
			</li>
		</ul>
		<div v-else class="empty" v-show="showProductcollection">还没有收藏商品~~ </div>
		<div class="flex flex-x-center flex-y-center" style="color: #6FB138;background: #fff;height: 0.8rem;" @click="toUserCollection">查看全部收藏</div>
	</div>
</template>
<script>
	import infoCard from '../component/infoCard.vue'
	import infoCardList from '../component/infoCardList.vue'
	import list from '../component/list.vue'
	import menuTab from '../component/menu.vue'

	import echarts from 'echarts'
	import mixin from '../../utils/mixin.js'
	import mixin_store from '../../utils/mixin_store.js'
	// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx11fbfc1938b63108&redirect_uri=http://10.2.5.111:8066/#/Login&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect

	export default {
		components: {
			infoCard,
			infoCardList,
			list,
			menuTab
		},
		mixins: [mixin, mixin_store],
		data() {
			return {
				newestOrder: {},
				showSellerList: true,
				sellerList: [],
				showProductcollection: false,
				productcollection: [],
				menu: ['收藏商家', '收藏商品'],
				msgdataList: []
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '首页')
			// 获取最新采购
			this.getnewestOrder()
			// 最新结算
			// this.getNewestBillInfo()
			// 获取收藏的供应商
			this.getSellerList()
			// 获取消息
			this.getUserMessage()

		},
		mounted() {
			// 获取最近七天订单走势图
			this.getOrderSum()
		},
		methods: {
			/**
			 * 订单详情
			 */
			toOrderDetails(orderId, orderUmber) {
				this.$router.push({
					name: 'OrderDetails',
					query: {
						orderId: orderId,
						orderUmber: orderUmber
					}
				})
			},
			/**
			 * 全部结算
			 */
			toAllBill() {
				this.$router.push({
					name: 'Statistics',
				})
			},
			/**
			 * 全部采购
			 */
			toAllPurchase() {
				this.$router.push({
					name: 'Order',
				})
			},
			/**
			 * 获取最近七天订单走势图
			 */
			getOrderSum() {
				this.postRequest('order/getOrderSum', {
					startTime: this.GetDateStr(-7).date,
					endTime: this.GetDateStr(0).date,
					buyerId: this.userInfo.typeCode
				}).then(d => {
					if(d.data && d.data.state == 0) {
						if(d.data.aaData.length > 0) {
							// 横坐标数据
							var xAxisData = []
							// 纵坐标数据
							var seriesData = []
							for(var i in d.data.aaData) {
								xAxisData.push(d.data.aaData[i].orderDate.substr(5, 9))
								if(d.data.aaData[i].orderTotal) {
									console.log()
									if(d.data.aaData[i].orderTotal.toString().indexOf(',') > 0) {
										d.data.aaData[i].orderTotal = d.data.aaData[i].orderTotal.replace(',', '')
									}
									seriesData.push(Number(d.data.aaData[i].orderTotal))
								} else {
									seriesData.push(0)
								}
							}
							this.setChartData(xAxisData, seriesData)
						} else {
							var xAxisData = []
							var seriesData = []
							for(var i = -6; i < 1; i++) {
								xAxisData.push(this.GetDateStr(i).date.substr(5, 9))
								seriesData.push(0)
							}
							this.setChartData(xAxisData, seriesData)
						}
					} else {
						var xAxisData = []
						var seriesData = []
						for(var i = -6; i < 1; i++) {
							xAxisData.push(this.GetDateStr(i).date.substr(5, 9))
							seriesData.push(0)
						}
						this.setChartData(xAxisData, seriesData)
					}
				})
			},
			/**
			 * 设置图表
			 */
			setChartData(xAxisData, seriesData) {
				var myChart = echarts.init(document.getElementById('main'));
				var max = Math.max.apply(Math, seriesData);
				// 图表左边的距离
				var xLeft = 0
				if(max <= 1) {
					xLeft = 35
				} else if(max >= 10 && max < 100) {
					xLeft = 33
				} else if(max >= 100 && max < 1000) {
					xLeft = 40
				} else if(max >= 1000 && max < 10000) {
					xLeft = 45
				} else if(max > 10000) {
					xLeft = 36
				} else {
					xLeft = 26
				}
				var option = {
					grid: {
						left: xLeft,
						bottom: 35,
						right: 12,
						top: 30,
						borderWidth: 1
					},
					title: {
						text: '近七日采购金额统计（元）',
						textStyle: {
							fontSize: 14,
							color: '#fff'
						},
						left: 'center',
						top: 0
					},
					xAxis: {
						type: 'category',
						data: xAxisData,
						axisLine: {
							lineStyle: {
								color: '#fff',
							}
						}
					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#fff',
							}
						},
						splitLine: {
							show: true,
							//  改变轴线颜色
							lineStyle: {
								// 使用深浅的间隔色
								color: ['#fff'],
								opacity: 0.2
							}
						},
						axisLabel: {
							formatter: function(value, index) {
								if(value >= 10000 && value < 10000000) {
									value = value / 10000 + "万";
								} else if(value >= 10000000) {
									value = value / 10000000 + "千万";
								}
								return value;
							}
						},
					},
					series: [{
						data: seriesData,
						type: 'line',
						areaStyle: {
							opacity: 0.4
						},
						smooth: true,
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'top',
									formatter: '{c}',
									textStyle: {
										color: '#fff',
										fontSize: 10,
									}
								},
							}
						}
					}],
					color: '#fff',
					textStyle: {
						color: '#fff'
					}
				};

				myChart.setOption(option);
			},
			/**
			 * 获取消息列表
			 */
			getUserMessage() {
				this.postRequest('platformnoticeflow/list', {
					customerId: this.userInfo.userId
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.msgdataList = d.data.aaData
					}
				})
			},
			/**
			 * 查看消息
			 */
			lookMesg() {
				this.$router.push({
					name: 'UserMessage'
				})
			},
			/**
			 * 最新采购
			 */
			getnewestOrder() {
				this.postRequest('order/listByUser', {
					pageNum: 1,
					pageSize: 5,
					orderField: 'f_created_date desc'
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						if(resp.data.aaData.length > 0) {
							this.newestOrder = resp.data.aaData[0]
							if(this.newestOrder.orderitemList) {
								this.newestOrder.sl = this.newestOrder.orderitemList.length
							}
						}
					} else {
						this.$dialog.alert({
							mes: resp.data.msg,
							callback: function() {
								this.$router.push({
									name: 'Login'
								})
							}.bind(this)
						})
					}
				})
			},
			/**
			 * 最新结算
			 */
			getNewestBillInfo() {
				this.postRequest('/settle/billInfo/list', {
					startTime: this.GetDateStr(-7).date,
					endTime: this.GetDateStr(0).date,
					pageNum: 1,
					pageSize: 10,
					orderField: 'f_create_date'
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						if(resp.data.aaData) {
							this.NewestBillInfo = resp.data.aaData[0]
						}
					}
				})
			},
			/**
			 * 获取收藏的供应商
			 */
			getSellerList() {
				this.postRequest('suppliercollection/querySellerByCustomerId', {
					customerId: this.userInfo.typeCode,
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						if(resp.data.aaData) {
							var a = []
							for(var i in resp.data.aaData) {
								this.getStore(resp.data.aaData[i].sellerId, function(store) {
									var o = Object.assign(store, resp.data.aaData[i])
									a.push(o)
								})
							}
							this.sellerList = a
						}
					}
				})
			},
			/**
			 * 获取收藏品
			 */
			getProductcollection() {
				this.postRequest('Productcollection/list', {
					customerId: this.userInfo.typeCode,
					pageNum: 1,
					pageSize: 2
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						this.productcollection = resp.data.aaData
					}
				})
			},
			/**
			 * 点击商品分类
			 */
			menuclick(index) {
				if(index == 0) {
					this.showSellerList = true
					this.showProductcollection = false
					this.getSellerList()
				} else {
					this.showProductcollection = true
					this.showSellerList = false
					this.getProductcollection()
				}
			},
			/**
			 * 全部收藏
			 */
			toUserCollection(){
				this.$router.push({name:'UserCollection'})
			}
		}
	}
</script>
<style lang="scss">
	#Home {
		.menu-tab {
			border-bottom: none !important;
		}
		.header {
			.search {
				position: absolute;
				right: 0.1rem;
				top: 0.1rem;
			}
			padding: 0.1rem 0.1rem 0;
			#main {
				width: 100%;
				height: 4rem;
			}
			.rollnotice {
				font-size: #2F3927;
				.iconwrap {
					background: rgba(255, 255, 255, 0.4);
				}
				.rollnotice-icon {
					padding: 0 0.2rem;
					background: rgba(255, 255, 255, 0.4);
					height: 40px;
				}
			}
			.yd-rollnotice,
			.yd-rollnotice-item {
				background: rgba(255, 255, 255, 0.4) !important;
			}
		}
		.yc-tab {
			background: #fff;
			p {
				font-size: 0.3rem;
				padding: 0.25rem;
			}
			p.active strong {
				display: inline-block;
				border-bottom: 2px solid #6FB138;
				padding-bottom: 0.05rem;
			}
		}
		.heade {
			padding: 0.2rem 0;
			.img {
				width: 0.8rem;
				height: 0.8rem;
				margin-right: 0.2rem;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.name {
				padding-bottom: 0.1rem;
				font-size: 0.27rem;
			}
		}
		.listwrap {
			background: #fff;
			padding: 0 0.25rem;
		}
		.collection {
			/*height: 200px;*/
			overflow: hidden;
		}
	}
</style>