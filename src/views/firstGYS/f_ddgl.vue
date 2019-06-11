<template>
	<yd-layout id='fDdgl'>
		<div class="header_f" slot='top'>
			<div class="header">
				<div @click='goFindex' class="header_left">
					首页
				</div>
				<ul class="header_right">
					<li :class='{nav_active:navActiveNum==0}' @click='look_list("0")'>全部</li>
					<li :class='{nav_active:navActiveNum==1}' @click='look_list("1")'>待收款</li>
					<li :class='{nav_active:navActiveNum==5}' @click='look_list("5")'>已完成</li>
					<!--<li :class='{nav_active:navActiveNum==5}' @click='look_list("5")'>搜索</li>-->
				</ul>
			</div>
			<div class="search_bottom">
				<div class="search_bottom_list">
					<div class="div" @click='openCar("code")'>
						<span :style="{color:carCode?'#018BE6':'#848484'}">订单编号</span>
						<img src="../../assets/firstImgs/icon_up.png" alt="" />
					</div>
				</div>
				<div class="search_bottom_list">
					<div class="div" @click='openCar("goodsName")'>
						<span :style="{color:goodsName?'#018BE6':'#848484'}">采购商</span>
						<img src="../../assets/firstImgs/icon_up.png" alt="" />
					</div>
				</div>
				<div class="search_bottom_list">
					<div class="div">
						<span v-if='dateTime' class="get_date" @click='selectTime'>{{dateTime}}</span>
						<span v-else @click='selectTime'>选择时间</span>
						<yd-icon class='clear_date' @click.native='clearDate' v-if='dateTime' size='.2rem' name="error-outline"></yd-icon>
						<yd-datetime :init-emit='false' :placeholder='dateplaceholder' :callback='callbackDate' v-show='openDateTime' ref="datetime" type="date" v-model="selectDateTime" slot="right"></yd-datetime>
						<img src="../../assets/firstImgs/icon_up.png" alt="" />
					</div>
				</div>
			</div>
		</div>
		<div class="content">
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div class="list" slot='list'>

					<div @click='goFddxq(item)' v-for='item in dataList' class="goods_list">
						<img v-if='item.orderSkuPicUrl&&item.orderSkuPicUrl!=null' class="goods_img" :src="$root.imgURL+item.orderSkuPicUrl" alt="" />
						<img  v-else-if='item.orderProductPicUrl&&item.orderProductPicUrl!=null' class="goods_img" :src="$root.imgURL+item.orderProductPicUrl" alt="" />
						<img  v-else class="goods_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
						<div class="list">
							<div class="list_top">
								<div class="list_top_left">订单号：<span>{{item.orderUmber.indexOf('ON-')>=0?item.orderUmber.slice(0,12):item.orderUmber.slice(0,9)}}</span><span  style="color: #FF3D15;font-weight: bold;font-size: 15px;">{{item.orderUmber.indexOf('ON-')>=0?item.orderUmber.slice(12,16):item.orderUmber.slice(9,13)}}</span></span></div>
								<!--<div class="list_top_right">{{item.payStatusName=='已支付'?'已完成':'待收款'}}</div>-->
								<div class="list_top_right">{{item.orderStatusName=='新建'?'待收款':item.orderStatusName}}</div>
							</div>
							<div class="list_bottom">
								<div class="l_b_left">
									<div class="l_b_left_top">
										<div class="list_shr_father">
											<!--收货人-->
											<div class="list_shr">采购商</div>
										</div>
										<!--<div class="list_name">{{item.contacts?item.contacts:item.buyerName?item.buyerName:'临时客户'}}</div>-->
										<!--<div class="list_name">{{item.buyerName?item.buyerName:'临时客户'}}</div>-->
										<div v-if='item.distributionType==1' class="list_name">{{item.contacts?item.contacts:'临时客户'}}</div>
										<div v-else class="list_name">{{item.buyerName?item.buyerName:'临时客户'}}</div>
									</div>
									<div class="list_time">
										{{item.createdDate}}
									</div>
								</div>
								<div class="l_b_right">
									<img src="../../assets/imgs/list_icon_right.png" alt="" />

								</div>
							</div>
						</div>
					</div>

				</div>

				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>

				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />

			</yd-infinitescroll>

		</div>
		
		
		<yd-popup v-model="carShow" position="bottom" height="30%">
			<div class='car_show'>
				<div class="car_show_title">{{isCarPopup?'请输入订单编号':'请输入采购商'}}</div>
				<div style="position: relative;">
					<input class="car_show_input" v-model='carInput' :placeholder="isCarPopup?'请输入订单编号':'请输入采购商'" type="text" />
					<yd-icon class='clear_input' @click.native='clearInput' v-if='carInput' size='.2rem' name="error-outline"></yd-icon>
				</div>
				<div class="car_show_btn" @click='carBtn'>确认</div>
			</div>
		</yd-popup>
		
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				navActive: '',
				navActiveNum: 0,
				dataList: [],
				pageNum:1,
				pageSize:12,
				
				isCarPopup: false,
				isGoodsPopup: false,
				openDateTime: false,
				dateplaceholder: '请选择时间',
				noTime: true,
				num: 1,
				fnishDataList:false,
				dateTime: "",
				carCode: '',
				goodsName: '',
				carInput: '',
				selectDateTime: '',
				carShow:false,
			}
		},
		created() {
			
			this.$store.dispatch('changeNavBarTitle', '订单管理')
		},
		watch: {
			carShow(val) {
				if(val) {
					this.isCarPopup ? this.carInput = this.carCode : this.carInput = this.goodsName
				} else {
					this.isGoodsPopup = false;
					this.isCarPopup = false
				}
			},
		},
		computed: {

		},
		mounted() {
			this.dateTime = this.selectDateTime = this.$root.yugi(0)
			
			this.loadList()
		},
		methods: {
			clearDate() {
				this.dateTime = ''
				this.selectDateTime = this.$root.yugi(0)
				this.noTime = false
				this.pageNum = 1;
				this.pageSize = 12;
				this.fnishDataList=false;
				this.dataList = []
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.loadList()
			},
			clearInput() {
				this.carInput = ''
			},
			callbackDate() {
				if(this.noTime) {
					this.dateTime = this.selectDateTime
					this.pageNum = 1;
					this.pageSize = 12;
					this.fnishDataList=false;
					this.dataList = []
					this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
					//防止第一次进来多加载一次
					this.num > 1 ? this.loadList() : this.num++

				}
			},
			selectTime() {
				if(!this.dateTime) {
					this.selectDateTime = this.$root.yugi(0)
				}
				this.noTime = true
				this.$refs.datetime.open();

			},
			carBtn() {
				this.isCarPopup ? this.carCode = this.carInput : this.goodsName = this.carInput
				this.carShow = false;
				this.pageNum = 1;
				this.pageSize = 12;
				this.fnishDataList=false;
				this.dataList = []
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.loadList()
			},
			openCar(str) {
				str == 'code' ? this.isCarPopup = true : this.isGoodsPopup = true
				this.carShow = true;
			},
			loadList() {
				this.$dialog.loading.open('数据加载中...');
				var params={
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					sellerId:this.$root.userInfo.typeCode,
					orderUmber:this.carCode,
					buyerName:this.goodsName,
					distributionTimeBegin:this.dateTime,
					distributionTimeEnd: this.dateTime,
					
				}
				if(this.navActiveNum!=0){
					if(this.navActiveNum==1){
						//params.paymentStatusId=0
						params.orderStatusId=0
					}else{
						params.orderStatusId=this.navActiveNum
					}
				}
				//order/list   order/listByUser  //order/wxqkOrderList //order/sellerOrderList
				this.postRequest('order/sellerOrderList',params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data && resp.data.state == 0) {
						console.log(this.dataList)
						this.dataList = [...this.dataList, ...resp.data.aaData];
						if(this.dataList.length >= resp.data.dataCount) {
							/* 所有数据加载完毕 */
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
							this.fnishDataList = true
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
			look_list(num) {
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.dataList=[];
				this.navActiveNum = num
				this.pageNum=1;
				this.pageSize=12
				this.fnishDataList=false
				this.$dialog.loading.open('数据加载中...');
				this.loadList()
			},
			goFindex() {
				this.$router.push({
					name: 'f_index'
				})
			},
			goFddxq(item) {
				this.$router.push({ 
					name: 'f_ddxq',
					query:{
						orderId:item.id,
						orderUmber:item.orderUmber
					}
				})
			}
		}
	}
</script>
<style lang='scss'>
	#fDdgl {
		background: white;
		.header_f {
			.header{
				background: white;
				padding: 0rem .3rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: .32rem;
				height: .9rem;
				border-bottom: 1px solid #D5D5D5;
				.header_left {
					color: #018BE6;
					display: flex;
					align-items: center;
					font-weight: 700;
					&:before {
						content: '';
						display: inline-block;
						width: .32rem;
						height: .32rem;
						border: 2px solid #018BE6;
						transform: rotate(45deg);
						border-top: none;
						border-right: none;
					}
				}
				.header_right {
					display: flex;
					justify-content: space-between;
					width: 3.65rem;
					/*width: 4.2rem;*/
					font-weight: bold;
					li {
						line-height: .9rem;
						display: flex;
						align-items: center;
					}
				}
				.nav_active {
					color: #018BE6;
					border-bottom: .04rem solid #018BE6;
				}
			}
			
			.search_bottom {
				background: #F5F5F9;
				display: flex;
				padding: .31rem .34rem;
				color: #848484;
				justify-content: space-between;
				.search_bottom_list {
					width: 33.33%;
					align-items: center;
					justify-content: flex-start;
					font-size: .28rem;
					display: flex;
					img {
						width: .16rem;
						height: .12rem;
						margin-left: .11rem;
					}
					.div {
						display: flex;
						align-items: center;
					}
				}
				.search_bottom_list:nth-child(3) {
					height: .46rem;
					position: relative;
					justify-content: flex-end;
					.get_date {
						border: 1px solid #D5D5D5;
						padding: .0rem .08rem;
						border-radius: .04rem;
						color: rgb(1, 139, 230);
					}
					.clear_date {
						position: absolute;
						top: -.03rem;
						color: #018BE6;
						right: .17rem;
						font-size: .2rem;
						z-index: 100;
					}
				}
				.search_bottom_list:nth-child(2) {
					justify-content: space-around;
				}
			}
		}
		.goods_list {
			display: flex;
			padding: .4rem .4rem 0.4rem 0;
			margin: 0rem 0 0rem .4rem;
			background: white;
			border-bottom: 1px solid #E1E1E1;
			align-items: center;
			.goods_img {
				width: 1.6rem;
				height: 1.6rem;
				flex-grow: 0;
				margin-right: .2rem;
			}
			.list {
				width: 5rem;
				flex-grow: 1;
				color: #848484;
				font-size: .24rem;
				.list_top {
					display: flex;
					justify-content: space-between;
					.list_top_left {
						color: #343434;
						font-size: .26rem;
						font-weight: 600;
					}
				}
				.list_bottom {
					display: flex;
					justify-content: space-between;
					.l_b_left {
						flex-grow: 1;
						width: 3.2rem;
						.l_b_left_top {
							margin: 0rem 0 .45rem 0;
							display: flex;
							.list_shr_father {
								flex-grow: 0;
								width: .94rem;
								display: flex;
								align-items: flex-end;
							}
							.list_shr {
								font-size: .2rem;
								height: .26rem;
								line-height: .28rem;
								color: white;
								background: #018BE6;
								border-radius: .06rem;
								padding: 0 .11rem;
								margin-bottom: .07rem;
							}
							.list_name {
								flex-grow: 1;
								width: 3.6rem;
								font-size: .36rem;
								margin-left: .2rem;
								color: #211E1D;
								font-weight: bold;
								/*如果写了flex，下面的超出隐藏不起作用*/
								/*display: flex;*/  
								align-items: flex-end;
								overflow: hidden;
							    text-overflow: ellipsis;
							    white-space: nowrap;
							}
						}
						.list_time {
							color: #848484;
							font-size: .26rem;
							font-family: 'PingFang-SC';
						}
					}
					.l_b_right {
						width: .11rem;
						flex-grow: 0;
						align-items: center;
						display: flex;
						img {
							width: .11rem;
							height: .2rem;
						}
					}
				}
			}
		}
		.car_show {
			position: relative;
			padding: .3rem .25rem .25rem .25rem;
			.car_show_title {
				color: #343434;
				font-size: .32rem;
				font-weight: bold;
			}
			.car_show_input {
				border: 1px solid #BFBFBF;
				height: .72rem;
				width: 100%;
				margin: .25rem 0 .5rem 0;
				padding: 0 .45rem 0 .25rem;
				font-size: .28rem;
			}
			.clear_input {
				position: absolute;
				top: .48rem;
				right: .2rem;
				z-index: 1502;
			}
			.car_show_btn {
				color: white;
				background: #018BE6;
				height: .8rem;
				text-align: center;
				line-height: .8rem;
				border-radius: .1rem;
			}
		}
	}
</style>