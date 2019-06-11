<template>
	<yd-layout id='fSpgl'>
		<div class="header" slot='top'>
			<div style="width: 33%;">
				<div @click='goFindex' class="header_left">
					首页
				</div>
			</div>
			<ul class="header_right">
				<li :class='{nav_active:navActiveNum==1}' @click='look_list("1")'>出售中</li>
				<li :class='{nav_active:navActiveNum==2}' @click='look_list("2")'>已下架</li>
			</ul>
			<div class="header_plcc">
				<div @click='goFplcz'>批量操作</div>
				<div v-if='false'></div>
				<img @click='add' class="plcc_img" src="../../assets/firstImgs/spgl_icon_add@2x.png" alt="" />
			</div>
		</div>
		<div class="search_input" slot='top'>
			<div class="search_input_input_f">
				<input class="search_input_input" v-model="keyWord" placeholder="输入关键字搜索" type="text" />
				<yd-icon @click.native='clearKeyWord' v-show='showIcon' class='search_input_input_icon' name="error-outline" size=".3rem"></yd-icon>
			</div>
			<div class="search_input_btn" @click="submitHandler">
				<yd-icon size=".3rem" color="#ffffff" name="search"></yd-icon>
				<div style="margin-left: .1rem;">搜索</div>
			</div>
		</div>
		<div class="content">
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div class="list" slot='list'>
					<div class="content_list" v-for='(item,index) in dataList'>

						<div class="goods_list">
							<img v-if='item.skuPicUrl&&item.skuPicUrl!=null' class="list_img" :src="$root.imgURL+item.skuPicUrl" alt="" />
							<img v-else-if='item.productPicUrl&&item.productPicUrl!=null' class="list_img" :src="$root.imgURL+item.productPicUrl" alt="" />
							<img v-else class="list_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
							<div class="list_right">
								<div class="time">
									<div>添加时间:<span v-if='item.createdDate&&item.createdDate!=null'>{{item.createdDate.split(' ')[0]}}</span></div>
									<div class="time_right">库存{{item.skuStockQuantity?(item.skuStockQuantity/100).toFixed(2):'0'}}{{item.skuMeasureName}}</div>
								</div>
								<div class="left_name">
									<!--<span v-if='item.isEdit'>
										<input @blur='blurInput(item,"oldName")' @input='changeInput(item,"oldName")' v-model.trim='item.oldName' class="num_input" type="text" />
									</span>
									<span v-else>
										{{item.name}}
									</span>-->
									{{item.name}}
									<div class="updateGgmc" v-if='item.isEdit'>
										<span>规格:</span>
										<input @blur='blurInput(item,"oldSkuName")' @input='changeInput(item,"oldSkuName")' v-model.trim='item.oldSkuName' class="num_input" type="text" />
									</div>
									<span v-else-if='item.skuName&&item.skuName!=null'>
										{{' - '+item.skuName}}
									</span>

								</div>
								<div class="money_father">
									<div class="money">
										<div class="money_name">
											<div class="money_name_c">单价</div>
										</div>
										<div v-if='item.isEdit' class="num_input_father">
											<strong>￥</strong>
											<input @blur='blurInput(item)' @input='changeInput(item)' v-model.trim='item.oldSkuPrice' class="num_input" type="text" />
										</div>
										<div v-else class="num">￥{{item.skuPrice}}</div>
										<div class="unit"><span>/</span>{{item.skuMeasureName}}</div>
									</div>
									<div @click='moneyYes(item,index)' v-if='item.isEdit' class="money_yes">
										确认
									</div>
								</div>
							</div>
						</div>
						<ul class="caozuo">
							<li v-if='false' @click='del(item,index)'>
								<img class="caozuo_img_1" src="../../assets/firstImgs/spgl_icon_delete@2x.png" alt="" /> 删除
							</li>
							<li></li>
							<li @click='soldOut(item,index)'>
								<img class="caozuo_img_2" src="../../assets/firstImgs/spgl_icon_xiajia@2x.png" alt="" /> {{item.skuPublished==1?"下架":'上架'}}
							</li>
							<template v-if='item.skuPublished==1'>
								<li @click='edit(item)' :style='{color: item.isEdit?"#018BE6":"#343434"}'>
									<img v-if='item.isEdit' class="caozuo_img_3" src="../../assets/firstImgs/spgl_icon_edita@2x.png" alt="" />
									<img v-else class="caozuo_img_3" src="../../assets/firstImgs/spgl_icon_edit@2x.png" alt="" /> {{item.isEdit?'取消':'编辑'}}
								</li>
							</template>
						</ul>

					</div>
				</div>

				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>

				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />

			</yd-infinitescroll>
		</div>
	</yd-layout>
</template>

<script>
	import mixin_f_goods from '../../utils/mixin_f_goods.js'
	export default {
		mixins: [mixin_f_goods],
		data() {
			return {
				navActiveNum: 1,
				searchInput:'',
				showIcon:false,
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '商品管理')
		},
		watch: {
			dataList: {
				handler(newValue) {　
					//					console.log(newValue)
				},
				deep: true
			},
			keyWord:function(val){
				if(val){
					this.showIcon=true;
				}else{
					this.showIcon=false;
				}
			}
		},
		computed: {

		},
		mounted() {
			this.$dialog.loading.open('数据加载中...');
			this.loadList()
		},
		methods: {
			clearKeyWord(){
				this.keyWord=''
			},
			submitHandler(){
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.dataList = [];
				this.pageNum = 1;
				this.pageSize = 12
				this.fnishDataList = false
				this.$dialog.loading.open('数据加载中...');
				this.loadList()
			},
			look_list(num) {
				this.keyWord=''
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.dataList = [];
				this.navActiveNum = num
				this.pageNum = 1;
				this.pageSize = 12
				this.fnishDataList = false
				this.$dialog.loading.open('数据加载中...');
				this.loadList()
			},
			//批量操作
			goFplcz() {
				if(this.dataList.length > 0) {
					this.$router.push({
						name: 'f_plcz',
						query: {
							navActiveNum: this.navActiveNum
						}
					})
				} else {
					this.$dialog.toast({
						mes: '没有可操作的数据啦^_^！',
						timeout: 1500
					});
				}

			},
			//增加
			add() {
				if(localStorage.getItem('TJSP_add')) {
					this.$dialog.confirm({
						title: '提示：',
						mes: '你尚有未完成的添加商品，是否前往？',
						opts: [{
								txt: '取消',
								color: false,
								callback: () => {

								}
							},
							{
								txt: '新建添加商品',
								color: '#018BE6',
								callback: () => {
									sessionStorage.setItem('TJSP_search', '')
									localStorage.setItem('TJSP_add', '')
									this.$router.push({
										name: 'f_tjsp_xz',
									})
								}
							},
							{
								txt: '前往',
								color: true,
								callback: () => {
									var name = 'f_tjsp_xz'
									if(JSON.parse(localStorage.getItem('TJSP_add')).step == 2) {
										name = 'f_tjsp_xg'
									}
									this.$router.push({
										name: name,
									})
								}
							}
						]
					});
				} else {
					this.$router.push({
						name: 'f_tjsp_xz',
					})
				}
			},
			//删除
			del(item, index) {
				this.$dialog.confirm({
					title: '提示',
					mes: `立即删除${item.name}?`,
					opts: () => {
						var mes = '删除成功~~'
						var params = {
							id: item.skuId,
							deleted: 1
						}
						this.productskuFun(params, index, mes)
					}
				});

			},
			//下架
			soldOut(item, index) {
				//商品状态：1在售2下架
				var mes = '上架成功~~';
				var published = item.skuPublished; //防止watch监听
				if(published == 1) {
					published = 2
					mes = '下架成功~~'
				} else {
					published = 1
				}
				var params = {
					id: item.skuId,
					published: published,
				}
				this.productskuFun(params, index, mes)
			},
			moneyYes(item) {
				var mes = '编辑成功~~';
				var params = {
					id: item.skuId,
					price: item.oldSkuPrice,
					name: item.oldSkuName,
//					basePrice: ((item.oldSkuPrice * 100).toFixed(2) / (item.skuWeight * 100).toFixed(2)).toFixed(2),
					isActualPrice: item.oldSkuPrice == 0 ? 1 : 0, //0不是时价，1是时价
				}
				this.productskuFun(params, -1, mes).then((flg) => {
					if(flg) {
						item.isEdit = false;
						item.skuPrice = item.oldSkuPrice;
						item.skuName = item.oldSkuName;
						console.log(item)
					}
				})
			},
			//编辑
			edit(item) {
				item.oldSkuPrice = item.skuPrice
				item.isEdit = !item.isEdit
			},

			goFindex() {
				this.$router.push({ name: 'f_index' })
			}
		}
	}
</script>
<style lang='scss'>
	#fSpgl {
		line-height: .4rem;
		background: white;
		img {
			display: inline-block;
		}
		.header {
			background: white;
			padding: 0rem .3rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: .32rem;
			height: .9rem;
			font-weight: bold;
			border-bottom: 1px solid #D5D5D5;
			.header_left {
				width: 1.2rem;
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
				width: 33%;
				display: flex;
				/*justify-content: space-between;
				justify-content: space-around;*/
				width: 3.65rem;
				font-weight: bold;
				li {
					line-height: .9rem;
					display: flex;
					align-items: center;
				}
				li:nth-child(1) {
					margin-right: .36rem;
				}
			}
			.header_plcc {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 33%;
				color: #018BE6;
				.plcc_img {
					width: .36rem;
					height: .36rem;
				}
			}
			.nav_active {
				color: #018BE6;
				border-bottom: .04rem solid #018BE6;
			}
		}
		.search_input{
			background: #efeff4;
			padding: .1rem 0rem ;
			align-items: center;
			display: flex;
			.search_input_input_f{
				flex: 1;
				position: relative;
				.search_input_input{
					width: 100%;
					background: white;
					border: 1px solid #D6D6D6;
					border-left: none;
					padding: .16rem .3rem;
					font-size: .28rem;
				}
				.search_input_input_icon{
					position: absolute;
					right: .25rem;
					top: .18rem;
				}
			}
				
			.search_input_btn{
				width: 1.3rem;
				height: 100%;
				border: 1px solid #D6D6D6;
				background: #018BE6;
				color: white;
				display: flex;
				align-items: center;
				border-left: none;
				justify-content: center;
			}
		}
		.content {
			.content_list {
				border-bottom: .2rem solid #F5F5F9;
			}
			.goods_list {
				align-items: center;
				border-bottom: .2rem solid #F5F5F9;
				font-size: .24rem;
				color: #848484;
				padding: .31rem .31rem 0.31rem 0rem;
				margin: 0 0 0 .31rem;
				border-bottom: 1px solid #E1E1E1;
				display: flex;
				.list_img {
					width: 1.48rem;
					height: 1.48rem;
					margin-right: .3rem;
					flex-grow: 0;
				}
				.list_right {
					width: 5rem;
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
						.updateGgmc {
							margin: .1rem 0;
							display: flex;
							align-items: center;
							span {
								font-size: .3rem;
							}
						}
						.num_input {
							flex-grow: 1;
							font-family: 'PingFang-SC-Bold';
							height: .56rem;
							border: 1px solid rgba(4, 0, 0, 0.23);
							background: #EFEFEF;
							margin: 0 .1rem 0 .16rem;
							border-radius: 2px;
							padding: 0 .1rem 0 0.3rem;
							width: 60%;
							font-weight: bold;
							color: #211E1D;
						}
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
			.caozuo {
				display: flex;
				font-size: .28rem;
				justify-content: space-between;
				align-items: center;
				height: .8rem;
				padding: 0 .56rem;
				li {
					display: flex;
					align-items: center;
				}
				img {
					margin-right: .13rem;
				}
				.caozuo_img_1 {
					width: .26rem;
					height: .3rem;
				}
				.caozuo_img_3,
				.caozuo_img_2 {
					width: .28rem;
					height: .28rem;
				}
			}
		}
	}
</style>