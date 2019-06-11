<template>
	<yd-layout id='fDdxq'>
		<!--<yd-navbar title="订单详情">
	        <router-link to="#" slot="left">
	            <yd-navbar-back-icon>订单管理</yd-navbar-back-icon>
	        </router-link>
	    </yd-navbar>-->
		<div class="header">
			<div class="header_left" @click='goFddgl'>订单管理</div>
			<div>订单详情</div>
			<div></div>
			<div class="ddzt">
				<ul class="ddzt_children">
					<!--<li>订单<span v-if='orderObj.payStatusName'>{{orderObj.payStatusName=='未支付'?'待收款':'已完成'}}</span></li>-->
					<li>订单<span v-if='orderObj.payStatusName'>{{orderObj.orderStatusName}}</span></li>
					<li v-if='orderObj.distributionType==1' class="ddzt_time">预计送达时间：{{orderObj.distributionTimeEnd}}</li>
					<li v-else class="ddzt_time">配送方式：自提</li>
				</ul>
			</div>
		</div>
		<div class="content">
			<div v-if='orderObj.distributorId&&orderObj.distributorId!=null&&orderObj.distributionType==1&&(this.orderObj.orderStatusId==3||this.orderObj.orderStatusId==4||this.orderObj.orderStatusId==5||this.orderObj.orderStatusId==8)&&orderObj.orderStatusId!=null' class="content_header">
				<div class="img_right">
					<img class="img_left" src="../../assets/imgs/img_moren@2x.png" alt="" />
					<div class="c_h_lxr">
						<div class="name">{{people.f_driver_name}}</div>
						<div class="mc">配送员</div>
					</div>
				</div>
				<a class="c_h_tel" :href="'tel:'+people.f_driver_phone">联系</a>
			</div>
			<div class="spxx_name">
				商品信息
			</div>
			<div class="goods_list">
				<div class="list" v-for='item in dataList'>
					<div class="list_children">
						<img v-if='item.skuPicUrl&&item.skuPicUrl!=null' class="list_img" :src="$root.imgURL+item.skuPicUrl" alt="" />
						<img v-else-if='item.productPicUrl&&item.productPicUrl!=null' class="list_img" :src="$root.imgURL+item.productPicUrl" alt="" />
						<img v-else class="list_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
						<div class="list_right_1">
							<div class="right_top">{{item.productName}}<span v-if='item.skuName&&item.skuName!=null'>{{' - '+item.skuName}}</span></div>
							<div class="right_bottom" v-if="item.promotionPrice>0 && item.promotionBasePrice>0">{{'￥'+(item.promotionPrice/100).toFixed(2)+'元/'+item.skuMeasureName}}</div>
							<div class="right_bottom" v-else>
								<i :class='{base_money:!isPos&&item.measureTypePro ==1&&item.measureTypeSKU ==2&&item.chargingModel ==1&&!(orderObj.orderStatusId == 0||orderObj.orderStatusId == 1||orderObj.orderStatusId == 7||orderObj.orderStatusId == 6)}'>{{'￥'+(item.price/100).toFixed(2)+'/'+item.skuMeasureName}}</i> &nbsp;
								<i v-if='!isPos&&item.measureTypePro ==1&&item.measureTypeSKU ==2&&item.chargingModel ==1&&!(orderObj.orderStatusId == 0||orderObj.orderStatusId == 1||orderObj.orderStatusId == 7||orderObj.orderStatusId == 6)'>{{'￥'+(item.oriPriceForDecimal).toFixed(2)+'/'+item.baseMeasureName}}</i>
							</div>
						</div>
						<div class="list_right_2">
							<div class="right_top" v-if="(!(orderObj.orderStatusId == 0||orderObj.orderStatusId == 1||orderObj.orderStatusId == 7||orderObj.orderStatusId == 6))&&item.sortingWeight!=null&&item.sortingWeight>=0">x{{item.quantity}}</div>
							<div class="right_top" style="text-decoration: none;" v-else>x{{item.quantity}}</div>

							<div v-if="(!(orderObj.orderStatusId == 0||orderObj.orderStatusId == 1||orderObj.orderStatusId == 7||orderObj.orderStatusId == 6))&&item.sortingWeight!=null&&item.sortingWeight>=0" class="right_bottom">x&nbsp;{{item.sortingWeight}}</div>
						</div>
						<div class="list_right_3">
							<div class="right_top" v-if="(!(orderObj.orderStatusId == 0||orderObj.orderStatusId == 1||orderObj.orderStatusId == 7||orderObj.orderStatusId == 6))&&item.sortingTotalForDecimal!=null&&item.sortingTotalForDecimal>=0">￥{{item.itemTotalForDecimal}}</div>
							<div class="right_top" style="text-decoration: none;" v-else>￥{{item.itemTotalForDecimal}}</div>

							<div v-if="(!(orderObj.orderStatusId == 0||orderObj.orderStatusId == 1||orderObj.orderStatusId == 7||orderObj.orderStatusId == 6))&&item.sortingTotalForDecimal!=null&&item.sortingTotalForDecimal>=0" class="right_bottom">￥{{item.sortingTotalForDecimal}}</div>
						</div>
					</div>
					<div v-if='item.comment' class="list_beizhu">备注:{{item.comment}}</div>
				</div>
			</div>
			<div class="all_goods" v-if='orderObj.orderitemList'>共&nbsp;{{orderObj.orderitemList.length}}&nbsp;件商品</div>
			<div class="all_money">
				<a v-if='orderObj.buyerTel' class="all_money_tel" :href="'tel:'+orderObj.buyerTel">联系客户</a>
				<a v-else style="font-weight: bold;color: #4D7BFE;" href="javascript:;"></a>
				<div class="all_money_bottom">
					<!--其实这个可以写一个函数。。后面有空来改-->
					<!--!(orderObj.orderStatusId == 0||orderObj.orderStatusId == 1||orderObj.orderStatusId == 7||orderObj.orderStatusId == 6)-->
					<!--(!(orderObj.orderStatusId == 0||orderObj.orderStatusId == 1||orderObj.orderStatusId == 7||orderObj.orderStatusId == 6))&&orderObj.orderitemList[0].sortingWeight&&orderObj.orderitemList[0].sortingWeight!=null-->
					<div v-if='ifSortingOrderTotal()' class="all_money_bottom_1"><span>小计:</span>￥{{(orderObj.sortingOrderTotal/100).toFixed(2)}}</div>
					<div v-else class="all_money_bottom_1"><span>小计:</span>￥{{orderObj.orderTotalForDecimal}}</div>
					<div v-if='ifSortingOrderTotal()' class="all_money_bottom_2">￥{{orderObj.orderTotalForDecimal}}</div>

				</div>
			</div>
			<div class="message">
				<div class="message_title">配送信息</div>
				<div class="message_list">
					<div class="list_name">配送方式</div>
					<div class="list_content">{{distributionTypeName||orderObj.distributionTypeName}}</div>
				</div>
				<div class="message_list" v-if='orderObj.distributionType==1'>
					<div class="list_name">送达时间</div>
					<div class="list_content">{{orderObj.distributionTimeBegin}} - {{orderObj.distributionTimeEnd}}</div>
				</div>
				<div class="message_list" v-if='orderObj.distributionType==1'>
					<div class="list_name">收货人</div>
					<div class="list_content">
						<div class="message_tel">{{orderObj.contacts}}&nbsp;&nbsp;tel:{{orderObj.buyerTel}}</div>
					</div>
				</div>
				<!--<div class="message_list" v-if='orderObj.distributionType==1'>
					<div class="list_name">电话</div>
					<div class="list_content">
						<div class="message_tel">{{orderObj.buyerTel}}</div>
					</div>
				</div>-->
				<div class="message_list" v-if='orderObj.distributionType==1'>
					<div class="list_name">收货地址</div>
					<div class="list_content">
						<div class="message_arr">{{orderObj.shippingAdd}}</div>
						<!--<div class="message_tel">{{orderObj.contacts}}&nbsp;&nbsp;tel:{{orderObj.buyerTel}}</div>-->
					</div>
				</div>

			</div>
			<div class="message">
				<div class="message_title">订单信息</div>
				<div class="message_list">
					<div class="list_name">订单号码</div>
					<div class="list_content">{{orderObj.orderUmber}}</div>
				</div>
				<div class="message_list">
					<div class="list_name">下单时间</div>
					<div class="list_content">{{orderObj.createdDate}}</div>
				</div>
				<div class="message_list">
					<div class="list_name">支付方式</div>
					<div class="list_content">{{orderObj.payTypeName||orderObj.payWayStatusName}}</div>
				</div>
				<div class="message_list" v-if='orderObj.comment'>
					<div class="list_name">订单备注</div>
					<div class="list_content">{{orderObj.comment}}</div>
				</div>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				orderObj: {},
				people: {},
				dataList: [],
				//是否是pos下单
				isPos: false,
				distributionTypeName:'',
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '订单详情')
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			if(this.$route.query.orderUmber) {
				if(this.$route.query.orderUmber.indexOf('ON-2') >= 0) {
					this.isPos = true;
				}
				this.$dialog.loading.open('数据加载中...');
				this.init()
			} else {
				this.$router.push({
					name: 'f_ddgl'
				})
			}
		},
		methods: {
			ifSortingOrderTotal() {
				if(
					(!(
						this.orderObj.orderStatusId == 0 ||
						this.orderObj.orderStatusId == 1 ||
						this.orderObj.orderStatusId == 7 ||
						this.orderObj.orderStatusId == 6
					)) &&
					this.orderObj.orderitemList ? this.orderObj.orderitemList[0].sortingWeight : false &&
					this.orderObj.orderitemList ? this.orderObj.orderitemList[0].sortingWeight != null : false
				) {
					return true
				} else {
					return false
				}
			},
			init() {
				//				this.postRequest('orderitem/list',{
				//					orderId:this.$route.query.orderId
				//				}).then(resp => {
				//					this.dataList=resp.data.aaData
				//				})
				this.postRequest('order/listByUser', {
					orderUmber: this.$route.query.orderUmber
				}).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0 && resp.data.aaData.length > 0) {
						this.orderObj = resp.data.aaData[0];
						this.dataList = resp.data.aaData[0].orderitemList
						if(this.orderObj.distributionType == 1 &&
							(this.orderObj.orderStatusId == 3 || this.orderObj.orderStatusId == 4 || this.orderObj.orderStatusId == 5 || this.orderObj.orderStatusId == 8) &&
							this.orderObj.orderStatusId != null &&
							this.orderObj.distributorId && this.orderObj.distributorId != null
						) {
							this.getPeople()
						}
						return this.orderObj.distributionType
					} else {
						this.$dialog.confirm({
							title: '提示：',
							mes: '暂无查询到该订单信息，返回上一级！',
							opts: [{
								txt: '确定',
								color: true,
								callback: () => {
									this.$router.push({
										name: 'f_ddgl'
									})
								}
							}]
						});
					}
				}).then((distributionType)=>{
					return this.getDistributionTypeName(distributionType)
				})
			},
			getDistributionTypeName(distributionType){
				this.postRequest('datadic/list', {
					dataType: 'SHIPPING_METHOD',
					key: distributionType
				}).then(resp => {
					if(resp.data.state==0){
						this.distributionTypeName=resp.data.aaData[0].value
					}
				})
			},
			getPeople() {
				this.postRequest('/distribute/distributionOrder/GetDistributionOrderByOrderNo', {
					orderNumber: this.orderObj.orderUmber,
				}).then(resp => {
					if(resp.data.state == 0 && resp.data.aaData) {
						this.people = resp.data.aaData
					}
				})
			},
			goFddgl() {
				this.$router.push({ name: 'f_ddgl' })
			}
		}
	}
</script>
<style lang='scss'>
	#fDdxq {
		background: white;
		line-height: .4rem;
		font-size: .24rem;
		img {
			display: block;
		}
		.header {
			padding: .27rem .2rem .87rem .2rem;
			background: #018BE6;
			color: white;
			font-size: .32rem;
			font-weight: bold;
			justify-content: space-between;
			position: relative;
			display: flex;
			div {
				width: 33%;
				text-align: center;
			}
			.ddzt {
				width: 100%;
				position: absolute;
				top: .9rem;
				left: 0;
				.ddzt_children {
					font-size: .36rem;
					color: #000000;
					margin: auto;
					width: 7.1rem;
					background: white;
					padding: .4rem 0;
					box-shadow: 5px 10px 18px rgba(6, 58, 95, 0.1);
					border-radius: .1rem;
					text-align: center;
					.ddzt_time {
						font-weight: 500;
						font-size: .24rem;
						margin-top: .23rem;
						color: #848484;
					}
				}
			}
			.header_left {
				display: flex;
				font-weight: 500;
				align-items: center;
				&:before {
					content: '';
					display: inline-block;
					width: .32rem;
					height: .32rem;
					border: 2px solid white;
					transform: rotate(45deg);
					border-top: none;
					border-right: none;
				}
			}
		}
		.content {
			background: white;
			padding: 1.21rem .22rem 0 .22rem;
			.content_header {
				display: flex;
				justify-content: space-between;
				box-shadow: 0px 2px 10px 0px rgba(48, 47, 72, 0.1);
				padding: .24rem .16rem;
				.img_left {
					width: .72rem;
					height: .72rem;
					margin-right: .16rem;
					border-radius: 50%;
				}
				.img_right {
					display: flex;
					align-items: center;
					.c_h_lxr {
						.name {
							color: #2F3927;
							font-size: .28rem;
							margin-bottom: .02rem;
						}
						.mc {
							display: inline-block;
							line-height: .28rem;
							height: .26rem;
							color: white;
							font-size: .2rem;
							color: white;
							background: #018BE6;
							border-radius: .06rem;
							padding: 0 .1rem;
						}
					}
				}
				.c_h_tel {
					display: flex;
					align-items: center;
					&:before {
						display: inline-block;
						content: '';
						width: .24rem;
						height: .24rem;
						background: url(../../assets/firstImgs/ddxq_icon-phone@2x.png) no-repeat;
						background-size: contain;
						margin-right: .13rem;
					}
				}
			}
			.spxx_name {
				font-size: .28rem;
				color: #2F3927;
				padding: .46rem .2rem .27rem .2rem;
				border-bottom: 3px double #D6D6D6;
			}
			.goods_list {
				margin-top: .2rem;
				.list {
					margin-bottom: .2rem;
					.list_children {
						display: flex;
						padding: .1rem 0.2rem .16rem 0.2rem;
						.list_img {
							width: .6rem;
							height: .6rem;
							margin-right: .17rem;
							flex-grow: 0;
						}
						.right_top {
							color: #989E92;
							text-decoration: line-through;
							font-weight: 500;
							text-align: right;
						}
						.right_bottom {
							color: #2F3927;
							font-weight: 500;
							text-align: right;
						}
						.list_right_1 {
							width: 3rem;
							flex-grow: 1;
							.right_top {
								color: #2F3927;
								text-decoration: none;
								text-align: left;
							}
							.right_bottom {
								color: #989E92;
								text-align: left;
							}
						}
						.list_right_2 {
							width: 1.5rem;
							flex-grow: 0;
							margin: 0 .15rem;
							.right_top {
								font-weight: bold;
							}
							.right_bottom {
								font-weight: bold;
							}
						}
						.list_right_3 {
							width: 1.5rem;
							flex-grow: 0;
						}
					}
					.list_beizhu {
						width: 100%;
						color: #989E92;
						line-height: .4rem;
						padding: .1rem .2rem;
						background: #FFEDBD;
					}
				}
			}
			.all_goods {
				width: 100%;
				color: #797D77;
				font-size: .24rem;
				line-height: .4rem;
				text-align: center;
				background: rgba(239, 239, 243, 1);
				border-radius: 4px;
			}
			.all_money {
				height: .96rem;
				display: flex;
				justify-content: space-between;
				margin-bottom: .2rem solid #F5F5F9;
				align-items: center;
				.all_money_tel {
					font-weight: bold;
					color: #4D7BFE;
					&:before {
						display: inline-block;
						content: '';
						width: .24rem;
						height: .24rem;
						background: url(../../assets/firstImgs/ddxq_icon-phone@2x.png) no-repeat;
						background-size: contain;
						margin-right: .13rem;
					}
				}
				.all_money_bottom {
					font-size: .24rem;
					color: #989E92;
					.all_money_bottom_1 {
						margin-top: .2rem;
						font-size: .36rem;
						font-weight: bold;
						color: #2F3927;
						span {
							color: #2F3927;
							font-size: .24rem;
							font-weight: normal;
						}
					}
					.all_money_bottom_2 {
						text-decoration: line-through;
						text-align: right;
					}
				}
			}
		}
		.message {
			font-size: .24rem;
			color: #797D77;
			border-bottom: .2rem solid #F5F5F9;
			.message_title {
				color: #2F3927;
				font-size: .28rem;
				padding: .3rem 0;
				font-weight: bold;
			}
			.message_list {
				display: flex;
				justify-content: space-between;
				padding: .3rem 0 .24rem 0;
				border-bottom: 1px solid #DDDDDD;
				.list_name {
					width: 2rem;
					flex-grow: 0;
					font-size: .28rem;
					color: #2F3927;
					font-weight: 500;
				}
				.list_content {
					width: 3rem;
					flex-grow: 1;
				}
			}
		}
		.message {
			.message_list:last-child {
				border-bottom: none;
			}
		}
		.base_money {
			text-decoration: line-through;
		}
	}
</style>