<template>
	<yd-layout id='fJcxq'>
		<div class="header">
			<div>
				<a class="header_left" href="#/f_jcgl">进场管理</a>
			</div>
			<div>进场详情</div>
			<div style="text-align: right;">
				<a v-if='inmarketdetail.statusId==1' @click='goXzjcXz' href="javascript:;">编辑</a>
			</div>
			<div class="ddzt">
				
				<ul ref='message' v-if='$root.userInfo.typeId=="merchant"' class="ddzt_children">
					<li>{{inmarketdetail.wholesaleMarketName}}</li>
					<li class="ddzt_time">进场时间：{{inmarketdetail.inDate}}</li>
					<li style="margin-top: .0rem;" v-if='inmarketdetail.uploadDate' class="ddzt_time">编辑时间：{{inmarketdetail.uploadDate}}</li>
				</ul>
				<ul ref='message' v-else class="ddzt_children">
					<li>{{inmarketdetail.wholesalerName}}&nbsp;<span class="car_code">{{inmarketdetail.transporterId}}</span></li>
					<li class="ddzt_time">进场时间：{{inmarketdetail.inDate}}</li>
					<li style="margin-top: 0rem;" v-if='inmarketdetail.uploadDate' class="ddzt_time">编辑时间：{{inmarketdetail.uploadDate}}</li>
				</ul>
				<img v-if='inmarketdetail.statusId==2' class="list_cczf" src="../../assets/firstImgs/img_yichuc@2x.png" alt="" />
				<img v-else-if='inmarketdetail.statusId==3' class="list_cczf" src="../../assets/firstImgs/img_yizuofei@2x.png" alt="" />
			</div>
		</div>
		<div class="content">
			<div class="kong" :style="kongStyle"></div>
			<div class="content_name">进场商品明细</div>
			<div class="goods_list">
				<div class="list" v-for='item in detailArr'>
					<img v-if='item.productPicUrl&&item.productPicUrl!=null' class="list_left_img" :src="$root.imgURL+item.productPicUrl" alt="" />
					<img v-else class="list_left_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
					<div class="list_right">
						<div class="list_right_top">
							<div class="name">{{item.productName}}<span v-if='item.skuName&&item.skuName!=null'> - {{item.skuName}}</span></div>
							<div class="money">
								<span class="money_1">￥{{item.price}}</span>
								<span class="money_2">元</span>
								<span class="money_3">/&nbsp;千克<!--{{item.measureMethodName}}--></span>
							</div>
						</div>
						<div class="list_content">
							<div>追溯码:{{item.traceId}}</div>
							<div>批次号:{{item.batchId}}</div>
						</div>
						<div class="list_right_bottom">

							<div>编码:{{item.goodsCode}}</div>
							<div>数量:{{item.weight}}&nbsp;千克<!--{{item.measureMethodName}}--></div>
						</div>
					</div>
				</div>
				<div class="list_fotter">共&nbsp;{{detailArr.length}}&nbsp;件商品</div>
			</div>
			<div class="message">
				<div class="message_name">进场主信息</div>
				<div class="message_list">
					<div class="list_name">供应商</div>
					<div class="list_content">{{inmarketdetail.wholesalerName}}</div>
				</div>
				<div class="message_list">
					<div class="list_name">上游供应商</div>
					<div class="list_content">{{inmarketdetail.supplierName}}</div>
				</div>
				
				<div v-if='inmarketdetail.voucherType=="001"' class="message_list message_list_img">
					<div class="message_list_children">
						<div class="list_name">交易凭证号</div>
						<div class="list_content">{{inmarketdetail.tranId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />

				</div>
				<div v-if='inmarketdetail.voucherType=="002"' class="message_list message_list_img">
					<div class="message_list_children">
						<div class="list_name">动物产品检验合格证号</div>
						<div class="list_content">{{inmarketdetail.animalQuarantineId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />

				</div>
				<div v-if='inmarketdetail.voucherType=="003"' class="message_list message_list_img">

					<div class="message_list_children">
						<div class="list_name">肉品品质检验合格证号</div>
						<div class="list_content">{{inmarketdetail.meatInspectionId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />
				</div>
				<div v-if='inmarketdetail.voucherType=="004"' class="message_list message_list_img">
					<div class="message_list_children">
						<div class="list_name">产地证明号</div>
						<div class="list_content">{{inmarketdetail.provId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />
				</div>
				<div v-if='inmarketdetail.voucherType=="005"' class="message_list message_list_img">
					<div class="message_list_children">
						<div class="list_name">检测合格证号</div>
						<div class="list_content">{{inmarketdetail.vegInspectionId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />

				</div>
				<div class="message_list">
					<div class="list_name">运输车牌号</div>
					<div class="list_content">{{inmarketdetail.transporterId}}</div>
				</div>
				<div class="message_list">
					<div class="list_name">产地名称</div>
					<div class="list_content">{{inmarketdetail.areaName}}</div>
				</div>
				<div class="message_list">
					<div class="list_name">生产基地(种植户)</div>
					<div class="list_content">{{inmarketdetail.baseName}}</div>
				</div>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				inmarketdetail: {},
				detailArr: [],
				kongStyle:{
					width:'100%',
					height:'1.51rem'
				}
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '进场详情')
			sessionStorage.setItem('mainId', '')
			
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.$dialog.loading.open('数据加载中...');
			this.init()
		},
		methods: {
			init() {
				this.postRequest('inmarketdetail/mainAndDetail', {
					mainId: this.$route.query.mainId
				}).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0 && resp.data.aaData) {
						console.log(resp.data)
						this.inmarketdetail = resp.data.aaData.main
						this.$nextTick(()=>{
							console.log(this.$refs.message.offsetHeight)
							this.kongStyle={
								width:'100%',
								height:this.$refs.message.offsetHeight/100*2+'rem'
							}
						})		
						this.detailArr = resp.data.aaData.detail
						console.log(this.inmarketdetail)
					}

				})
			},
			goXzjcXz() {
				sessionStorage.setItem('XZJC_isEdit', true)
				sessionStorage.setItem('XZJC_isJcgl', false)
				this.$router.push({
					name: 'f_xzjc_xxlr', //f_xzjc_xz 老的
					query: {
						mainId: this.$route.query.mainId,
//						url: 'jcxq'
					}
				})
			}
		}
	}
</script>
<style lang='scss'>
	#fJcxq {
		background: white;
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
			}
			div:nth-child(2) {
				text-align: center;
			}
			div:nth-child(3) {
				text-align: right;
			}
			.ddzt {
				position: absolute;
				top: .9rem;
				left: 0;
				width: 100%;
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
					.car_code{
						font-size: .3rem;
						color: #211E1D;
						border:1px solid rgba(112,112,112,1);
						padding: 0 .15rem;
						font-family:'PingFang-SC-Bold';
						border-radius: 2px;
					}
					.ddzt_time {
						font-weight: 500;
						font-size: .24rem;
						margin-top: .23rem;
						color: #848484;
					}
				}
				.list_cczf{
					width: 1.54rem;
					height: 1.17rem;
					position: absolute;
					top: .2rem;
					right: 0rem;
					transform: rotate(50deg);
				}
			}
			.header_left {
				display: flex;
				width: 1.8rem;
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
			.kong{
				background: white;
			}
			/*padding: 1.51rem 0rem .2rem 0rem;*/
			padding: 0rem 0rem .2rem 0rem;
			background: white;
			font-size: .24rem;
			line-height: .4rem;
			color: #989E92;
			.content_name {
				color: #2F3927;
				font-size: .28rem;
				padding-bottom: .27rem;
				border-bottom: 3px double #D6D6D6;
				margin: 0 0 0.46rem .2rem;
				font-weight: bold;
			}
			.goods_list {
				background: white;
				padding: 0 .2rem;
				border-bottom: .2rem solid #efeff3;
				.list {
					align-items: center;
					padding-bottom: .2rem;
					margin-bottom: .25rem;
					border-bottom: 1px solid #D6D6D6;
					display: flex;
					.list_left_img {
						width: 1.3rem;
						height: 1.3rem;
						margin-right: .2rem;
						flex-grow: 0;
					}
					.list_right {
						flex-grow: 1;
						width: 5rem;
					}
					.list_right_top {
						display: flex;
						margin-bottom: .03rem;
						justify-content: space-between;
						.name {
							color: #2F3927;
							font-weight: 500;
							flex-grow: 1;
							width: 3rem;
						}
						.money {
							width: 2.2rem;
							flex-grow: 0;
							/*display: flex;
							align-items: center;
							justify-content: flex-end;*/
							text-align: right;
						}
					}
					.danwei {
						color: #2F3927;
						font-weight: 500;
					}
					.money_1 {
						color: #FF5000;
						font-size: .28rem;
						font-weight: bold;
					}
					.money_2 {
						font-size: .2rem;
					}
					.list_right_bottom {
						display: flex;
						justify-content: space-between;
						.money_1 {
							span {
								font-size: .25rem;
							}
						}
					}
				}
				.list_fotter {
					text-align: center;
					line-height: .8rem;
					color: #797D77;
					font-weight: 500;
				}
				.list:last-child {
					margin-bottom: 0 !important;
				}
			}
			.message {
				color: #2F3927;
				background: white;
				padding: 0 0 .3rem .2rem;
				font-size: .28rem;
				.message_name {
					font-weight: bold;
					padding: .3rem 0 .3rem 0rem;
				}
				.message_list {
					display: flex;
					padding: .2rem 0;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #DDDDDD;
					margin-bottom: 1px solid;
					font-weight: 500;
					.list_name{
						width: 2.3rem;
						flex-grow: 0;
					}
					.list_content {
						text-align: right;
						/*width: 4rem;*/
						color: #797D77;
						font-weight: normal;
						flex: 1;
						padding-right: .2rem;
					}
				}
				.message_list_img {
					display: block;
					.message_list_children {
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-weight: 500;
						.list_content {
							color: #797D77;
							font-weight: normal;
							padding-right: .2rem;
						}
					}
					.message_img {
						max-width: 5rem;
						height: 2rem;
						margin: .1rem auto 0;
					}
				}
			}
		}
	}
</style>