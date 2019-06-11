<template>
	<yd-layout id='fPlcz'>
		<div slot='top' class="header">
			<div>
				<a @click='goBack' class="header_left" href="javascript:;">上一步</a>
			</div>
			<div class="name">({{navActiveNum==1?'下架':'上架'}})批量操作</div>
			<div>
				<a v-if='false' @click='goNext' href="javascript:;">完成</a>
			</div>
		</div>
		<div class="content">
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div class="list" slot='list'>

					<yd-checklist v-model="checklist" :label="false">
						<yd-checklist-item :val="item.skuId" v-for='(item,index) in dataList' :key='item.skuId'>
							<yd-flexbox style="padding: 15px 0;">
								<div class="goods_list">
									<img v-if='item.skuPicUrl&&item.skuPicUrl!=null' class="list_img" :src="$root.imgURL+item.skuPicUrl" alt="" />
									<img v-else-if='item.productPicUrl&&item.productPicUrl!=null' class="list_img" :src="$root.imgURL+item.productPicUrl" alt="" />
									<img v-else class="list_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
									<div class="list_right">
										<div class="time">
											<div>添加时间:<span v-if='item.createdDate&&item.createdDate!=null'>{{item.createdDate.split(' ')[0]}}</span></div>
											<div class="time_right">库存{{item.stockQuantity}}{{item.skuMeasureName}}</div>
										</div>
										<div class="left_name">{{item.name}}<span v-if='item.skuName&&item.skuName!=null'>{{' - '+item.skuName}}</span></div>
										<div class="money_father">
											<div class="money">
												<div class="money_name">
													<div class="money_name_c">单价</div>
												</div>
												<div v-if='false' class="num_input_father">
													<strong>￥</strong>
													<input @input='changeInput(item)' v-model.trim='item.skuPrice' @blur='blurInput(item)' class="num_input" type="text" />
												</div>
												<div v-else class="num">￥{{item.skuPrice}}</div>
												<div class="unit"><span>/</span>{{item.skuMeasureName}}</div>
											</div>
										</div>
									</div>
								</div>
							</yd-flexbox>
						</yd-checklist-item>
					</yd-checklist>
				</div>

				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>

				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />

			</yd-infinitescroll>
		</div>
		<div slot='bottom' class="footer">
			<div v-if='false' @click='del' class="footer_list_f">
				<div class="footer_list">
					<img src="../../assets/firstImgs/spgl_icon_delete@2x.png" alt="" />
					<div>删除</div>
				</div>
			</div>
			<div @click='soldOut' class="footer_list_f">
				<div class="footer_list">
					<img src="../../assets/firstImgs/spgl_icon_xiajia@2x.png" alt="" />
					<div>{{navActiveNum==1?'下架':'上架'}}</div>
				</div>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	import mixin_f_goods from '../../utils/mixin_f_goods.js'
	export default {
		mixins: [mixin_f_goods],
		data() {
			return {
				checklist: [],
				navActiveNum: null,
			}
		},
		created() {
			this.navActiveNum = this.$route.query.navActiveNum
			if(!(this.navActiveNum == 1 || this.navActiveNum == 2)) {
				this.$router.push({ name: 'f_spgl' })
			}
			this.$store.dispatch('changeNavBarTitle', '批量操作')
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.$dialog.loading.open('数据加载中...');
			this.loadList()
		},
		methods: {
			look_list() {
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.dataList = [];
				this.pageNum = 1;
				this.pageSize = 12
				this.fnishDataList = false
				this.loadList()
			},
			soldOut() {
				if(this.checklist.length > 0) {
					var mes = '上架'
					if(this.navActiveNum == 1) {
						mes = '下架'
					}
//					var arr = []
//					arr = this.delDataList(true, 'soldOut')
					var objArr = {}
					objArr = this.delDataList(true, 'soldOut')
					this.$dialog.confirm({
						title: '提示',
						mes: `是否立即${mes}?`,
						opts: () => {
							var params = {
//								productList: '[]',
//								productSkuList: JSON.stringify(arr)
								productSkuList: JSON.stringify(objArr.arr)
							}
							if(this.navActiveNum != 1){
								params.productList=JSON.stringify(objArr.proArr)
							}
							mes += '成功~~'
							this.productskuFun(params, 'url', mes)
						}
					});
				} else {
					this.$dialog.toast({
	                    mes: '请选择商品！',
	                    timeout: 1500
	                });
				}

			},
			del() {
				if(this.checklist.length > 0) {
					var arr = []
					arr = this.delDataList(true)
					this.$dialog.confirm({
						title: '提示',
						mes: `是否立即删除?`,
						opts: () => {
							var params = {
								productList: '[]',
								productSkuList: JSON.stringify(arr)
							}
							var mes = '删除成功~~';
							this.productskuFun(params, 'url', mes)
						}
					});
				} else {
					this.$dialog.toast({
	                    mes: '请选择商品！',
	                    timeout: 1500
	                });
				}

			},
//			delDataList(flg, str) {
//				var arr = []
//				for(let a = 0; a < this.dataList.length; a++) {
//					for(let b = 0; b < this.checklist.length; b++) {
//						if(this.dataList[a].skuId == this.checklist[b]) {
//							if(flg) {
//								var o = {};
//								o.deleted = 1
//								if(str == 'soldOut') {
//									o.deleted = 0;
//									o.published = 1
//									if(this.navActiveNum == 1) {
//										o.published = 2
//									}
//								}
//								o.id = this.dataList[a].skuId
//								arr.push(o);
//							} else {
//								this.dataList.splice(a, 1)
//							}
//
//						}
//					}
//				}
//				console.log(arr)
//				return arr
//			},
			delDataList(flg, str) {
				var arr = [] , proArr = [] ; 
				for(let a = 0; a < this.dataList.length; a++) {
					for(let b = 0; b < this.checklist.length; b++) {
						if(this.dataList[a].skuId == this.checklist[b]) {
							if(flg) {
								var o = {},proObj = {};
								o.deleted = 1
								if(str == 'soldOut') {
									o.deleted = 0;
									o.published = 1
									if(this.navActiveNum == 1) {
										o.published = 2
									}
									proObj.published=o.published
								}
								proObj.id=this.dataList[a].id
								o.id = this.dataList[a].skuId
								arr.push(o);
								proArr.push(proObj)
							} else {
								this.dataList.splice(a, 1)
							}

						}
					}
				}
				return {arr,proArr}
			},
			goBack() {
				this.$router.go(-1)
			},
			goNext() {
				this.$router.push({
					name: 'f_spgl'
				})
			},
		}
	}
</script>
<style lang='scss'>
	#fPlcz {
		background: white;
		line-height: .4rem;
		img {
			display: inline-block;
		}
		.content {
			.yd-checklist-item-icon {
				padding: 0 .31rem 0 0;
			}
			.yd-flexbox-horizontal {
				padding: 0 !important;
			}
			.yd-checklist-content {
				padding-right: 0;
			}
			padding-left: .26rem;
			.goods_list {
				align-items: center;
				border-bottom: .2rem solid #F5F5F9;
				font-size: .24rem;
				color: #848484;
				padding: .31rem .31rem 0.31rem 0rem;
				border-bottom: 1px solid #E1E1E1;
				flex-grow: 1;
				display: flex;
				.list_img {
					width: 1.48rem;
					height: 1.48rem;
					margin-right: .3rem;
					flex-grow: 0;
				}
				.list_right {
					width: 2rem;
					flex-grow: 1;
					.time {
						display: flex;
						justify-content: space-between;
						color: #343434;
						font-family: 'PingFang-SC-Medium';
						.time_right {
							color: #848484;
							font-family: 'NotoSansCJKsc-Regular';
						}
					}
					.left_name {
						font-size: .32rem;
						color: #211E1D;
						font-weight: bold;
						margin: .04rem 0 .1rem 0;
						word-wrap: break-word;
						word-break: break-all;
						overflow: hidden;
					}
					.money_father {
						display: flex;
						justify-content: space-between;
						.money_yes {
							width: 1.2rem;
							height: .56rem;
							background: rgba(249, 11, 65, 1);
							border-radius: .04rem;
							color: white;
							text-align: center;
							font-size: .32rem;
							line-height: .56rem;
						}
					}
					.money {
						height: .56rem;
						display: flex;
						.money_name {
							align-items: flex-end;
							display: flex;
							.money_name_c {
								padding: .03rem .1rem;
								border-radius: .06rem;
								line-height: .24rem;
								font-size: .2rem;
								color: white;
								background: #018BE6;
							}
						}
						.num_input_father {
							position: relative;
							font-weight: bold;
							color: #FF5000;
							font-size: .28rem;
							strong {
								height: .56rem;
								display: flex;
								align-items: center;
								position: absolute;
								top: 0.02rem;
								left: .2rem;
							}
						}
						.num_input {
							font-family: 'PingFang-SC-Bold';
							height: .56rem;
							border: 1px solid rgba(4, 0, 0, 0.23);
							background: #EFEFEF;
							margin: 0 .1rem 0 .16rem;
							border-radius: 2px;
							padding: 0 .1rem 0 0.3rem;
							width: 2rem;
							font-weight: bold;
							color: #FF5000;
						}
						.num {
							font-weight: bold;
							display: flex;
							align-items: flex-end;
							line-height: .36rem;
							font-size: .36rem;
							color: #FF5000;
							font-family: 'PingFang-SC-Bold';
							margin: 0 .1rem 0 .15rem;
						}
						.unit {
							span {
								font-size: .32rem;
								line-height: .3rem;
							}
							line-height: .28rem;
							display: flex;
							align-items: flex-end;
							justify-content: flex-end;
						}
					}
				}
			}
		}
		.footer {
			font-size: .28rem;
			display: flex;
			justify-content: space-between;
			justify-content: space-around;
			align-items: center;
			height: .9rem;
			background: rgba(245, 245, 249, 1);
			color: #343434;
			.footer_list_f {
				display: flex;
				justify-content: center;
				/*width: 50%;*/
				width:100%;
				.footer_list {
					display: flex;
					align-items: center;
					img {
						width: .28rem;
						height: .28rem;
						margin-right: .13rem;
					}
				}
			}
			.footer_list_f:nth-child(1) {
				box-sizing: border-box;
				/*border-right: 1px solid #666666;*/
				.footer_list {
					img {
						width: .26rem;
						height: .3rem;
					}
				}
			}
		}
		.yd-scrollview:after {
			display: none;
		}
	}
</style>