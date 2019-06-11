<template>
	<yd-layout id='fTjfx'>
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="#/f_index" class="header_left" style="color: #018BE6;">首页</a>
				<div v-else></div>
			</div>
			<div class="name">统计分析</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="javascript:;"></a>
				<div v-else></div>
			</div>
		</div>
		<div class="header_t">
			<div class="header_content">
				<img class="img" id='customerHeadPic' :src="$root.imgURL+customerObj.customerHeadPic" alt="" />
				<div class="header_right">
					<div class="header_right_name"><span id='customerInfoName'>{{customerObj.customerInfo?customerObj.customerInfo.name:''}}</span></div>
					<div class="header_right_sc">收藏 &nbsp;<span id='productcollectionCount'>{{customerObj.productcollectionCount}}</span></div>
				</div>
			</div>
			<div class="header_thr">
				<ul>
					<li>有效订单</li>
					<li id='orderCount7Days'>{{customerObj.orderCount7Days?customerObj.orderCount7Days:'0'}}</li>
					<li>7日</li>
				</ul>
				<ul>
					<li>支付金额(元)</li>
					<li id='orderTotalAmount7Days'>{{customerObj.orderTotalAmount7Days?customerObj.orderTotalAmount7Days.toFixed(2):'0'}}</li>
					<li>7日</li>
				</ul>
				<ul>
					<li>成交转化率</li>
					<li id='orderSubmitRadio7Days'>{{customerObj.orderSubmitRadio7Days&&customerObj.orderSubmitRadio7Days!='NaN'?customerObj.orderSubmitRadio7Days.toFixed(2)+'%':'0'}}</li>
					<li>7日</li>
				</ul>
			</div>
			<div class="header_pj">
				<div class="header_pj_list" v-for='item in customerObj.storeScore'><span id='reviewName_0'>{{item.reviewName}}</span>&nbsp;&nbsp;<span class="span" id='typeScore_0'>{{item.typeScore}}</span></div>
				<!--<div class="header_pj_list"><span id='reviewName_1'>商品质量</span>&nbsp;&nbsp;<span class="span" id='typeScore_1'></span></div>
				<div class="header_pj_list"><span id='reviewName_2'>服务态度</span>&nbsp;&nbsp;<span class="span" id='typeScore_2'></span></div>-->
			</div>
		</div>
		<div class="order">
			<div class="order_header">
				<div class="title_name">订单销量走势</div>
				<ul>
					<li @click='searchBtn(6)' :class="{active:btnNum==6}">近一周</li>
					<li @click='searchBtn(14)' :class="{active:btnNum==14}">近半月</li>
					<li @click='searchBtn(29)' :class="{active:btnNum==29}">近一月</li>
				</ul>
			</div>
			<div class="order_chart" id='orderChart'>ggg</div>
		</div>
		<div class="merchandise">
			<div class="title_name">商品</div>
			<div class="content">
				<ul>
					<li>在售商品数&nbsp;(件)</li>
					<li id='saleSKUAllCount'>{{customerObj.saleSKUAllCount}}</li>
				</ul>
				<ul>
					<li>近30日下单商品占比</li>
					<li><span id='saleSKURadio30Days'>{{customerObj.saleSKURadio30Days?parseFloat(customerObj.saleSKURadio30Days).toFixed(2):"0"}}</span>%</li>
				</ul>
			</div>
		</div>
		<!--v-if='dataList.length>0'-->
		<div id='weekList' v-if='customerObj.salesSKUSortForWeek&&customerObj.salesSKUSortForWeek.length>0' class="week_list">
			<div class="title_name">周热销榜</div>
			<div id='salesSKUSortForWeek'>
				<div class="content" v-for='(item,index) in customerObj.salesSKUSortForWeek'>
					<ul>
						<li>第{{index+1}}：<span>{{item.productName}}&nbsp;({{item.skuName}})</span></li>
						<li>{{item.saleTotal?item.saleTotal:'0'}}&nbsp;<span class='unit'>{{item.measureName}}</span></li>
					</ul>
					<ul>
						<li>销售金额占比</li>
						<li>{{(item.saleAmountTotal/customerObj.orderTotalAmount7Days*100).toFixed(2)}}%</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="merchandise">
			<div class="title_name">订单与金额</div>
			<div class="content">
				<ul>
					<li>昨日有效订单&nbsp;(笔)</li>
					<li id='yestodayOrderCount'>{{orderSellCountYesterday.orderCount}}</li>
				</ul>
				<ul>
					<li>昨日销售金额&nbsp;(元)</li>
					<li id='yestodayOrderTotalAmount'>{{orderSellAmountYesterday.orderAmount?orderSellAmountYesterday.orderAmount.toFixed(2):'0'}}</li>
				</ul>
			</div>
		</div>
		<div class="merchandise">
			<div class="zf_money_header">
				<div class="title_name">支付类型与收款金额</div>
				<ul>
					<li @click='orderSearch(1)' :class="{active:orderBtnNum==1}">昨日</li>
					<li @click='orderSearch(7)' :class="{active:orderBtnNum==7}">近7日</li>
					<li @click='orderSearch(30)' :class="{active:orderBtnNum==30}">近30日</li>
				</ul>
			</div>
			<div class=" zf_money">
				<ul class="zf_money_top">
					<li>支付类型</li>
					<li>订单数&nbsp;(单)</li>
					<li>金额&nbsp;(元)</li>
				</ul>
				<ul v-for='item in orderList'>
					<li>{{item.payType}}</li>
					<li>{{item.orderCount}}</li>
					<li>{{item.orderTotalAmount}}</li>
				</ul>
			</div>
			<!--<div class="notice">*注：该表的统计范围为截止昨日22点30分已支付的订单。</div>-->
		</div>
	</yd-layout>
</template>

<script>
	let e = require('../../utils/zd_echarts.min.js')
	let echarts = e.echarts
	export default {
		data() {
			return {
				startTime: '',
				endTime: '',
				dataList: [],
				myChart: {},
				btnNum: 6,
				customerObj: {},
				orderList: [],
				orderBtnNum: 1,
				orderSellCountYesterday:{},
				orderSellAmountYesterday:{},
			}
		},
		created() {
			this.disposeDate();
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.myChart = echarts.init(document.getElementById('orderChart'))
			this.$dialog.loading.open('数据加载中...');
			this.init()

			this.endTime = this.$root.yugi(0)
			this.startTime = this.$root.yugi(6)
			this.searchDate();
			this.getOrderSellCountYesterday();
			this.getOrderSellAmountYesterday();
		},
		methods: {
			getOrderSellCountYesterday() {
				this.postRequest('orderStatistic/orderSellCountYesterday', {
					sellerId: this.$root.userInfo.typeCode
				}).then(resp => {
					if(resp.data.state == 0) {
						this.orderSellCountYesterday=resp.data.aaData
					}else{
						this.$dialog.toast({
		                    mes: resp.data.msg,
		                    timeout: 1500
		                });
					}

				})
			},
			getOrderSellAmountYesterday() {
				this.postRequest('orderStatistic/orderSellAmountYesterday', {
					sellerId: this.$root.userInfo.typeCode
				}).then(resp => {
					if(resp.data.state == 0) {
						this.orderSellAmountYesterday=resp.data.aaData
					}else{
						this.$dialog.toast({
		                    mes: resp.data.msg,
		                    timeout: 1500
		                });
					}
				})
			},
			disposeDate() {
				this.postRequest('customer/queryStatisticalAnalysisByCustomerId', {})
					.then(resp => {
						resp.data.aaData.salesSKUSortForWeek = resp.data.aaData.salesSKUSortForWeek.splice(0, 3)
						this.customerObj = resp.data.aaData
						this.orderList = this.customerObj.OrderTotalByPayTypeLastDay.aaData
						console.log(this.orderList)
					})
			},
			searchBtn(num) {
				this.startTime = this.$root.yugi(num)
				this.btnNum = num
				this.searchDate()
			},
			orderSearch(num) {
				this.orderBtnNum = num
				if(num == 1) {
					this.orderList = this.customerObj.OrderTotalByPayTypeLastDay.aaData
				} else if(num == 7) {
					this.orderList = this.customerObj.OrderTotalByPayTypeLastWeek.aaData
				} else if(num == 30) {
					this.orderList = this.customerObj.OrderTotalByPayTypeLastMonth.aaData
				}
			},
			searchDate(startTime, endTime) {
				this.postRequest('order/getOrderSum', {
					startTime: this.startTime,
					endTime: this.endTime,
					sellerId: this.$root.userInfo.typeCode,
				}).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.aaData.length > 0) {
						this.lineChart(resp.data.aaData)
					}
				})
			},
			lineChart(d) {
				var orderDate = [],
					orderCount = [],
					orderTotal = [];
				for(let a = 0; a < d.length; a++) {
					var arr = d[a].orderDate.split('-')
					if(arr[1][0] == 0) {
						arr[1] = arr[1][1]
					}
					if(arr[2][0] == 0) {
						arr[2] = arr[2][1]
					}
					orderDate.push(arr[1] + '/' + arr[2])
					orderCount.push(d[a].orderCount)
					orderTotal.push(d[a].orderTotal)
				}
				this.myChart.setOption({
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						data: orderDate
					},
					series: [{
						name: '数量',
						// 根据名字对应到相应的系列
						data: orderCount,
					}, {
						name: '金额',
						// 根据名字对应到相应的系列
						data: orderTotal,
					}]
				})
			},
			init() {
				var option = {
					title: {
						text: ''
					},
					legend: {
						data: [{
							name: '数量'
						}, {
							name: '金额'
						}],
						x: 'center',
						show: true,
					},
					grid: {
						bottom: '3%',
					},
					xAxis: {
						boundaryGap: false,
						data: []
					},
					yAxis: [{
							type: 'value',
							position: 'right',
							name: '数量(单)',
						},
						{
							type: 'value',
							name: '金额(元)',
							position: 'left',
							axisLabel: {
								formatter: '{value}'
							},
							splitLine: {
								show: false //不显示Y轴的横线
							},
							axisTick: {
								show: true, //这里是要不要下面的juju
							},
						},
					],
					series: [{
							name: '数量',
							type: 'line',
							data: [],
							//			smooth: true,
						},
						{
							name: '金额',
							type: 'line',
							yAxisIndex: 1,
							//			smooth: true,
							data: [],
							itemStyle: {
								normal: {
									color: 'rgb(255,162,38)'
								}
							},
						}
					]
				};
				// 使用刚指定的配置项和数据显示图表。 
				this.myChart.setOption(option);
			}
		},

	}
</script>

<style lang='scss'>
	#fTjfx {
		background: white;
		a {
			text-decoration: none;
			color: black;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			-moz-tap-highlight-color: rgba(0, 0, 0, 0);
			-ms-tap-highlight-color: rgba(0, 0, 0, 0);
			-o-tap-highlight-color: rgba(0, 0, 0, 0);
			tap-highlight-color: rgba(0, 0, 0, 0);
		}
		input {
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			border-radius: 0;
		}
		li {
			list-style: none;
		}
		body {
			font-family: Arial, "Microsoft YaHei", sans-serif, "Helvetica Neue", Helvetica, Arial;
		}
		p,
		span {
			word-wrap: break-word;
			word-break: break-all;
			overflow: hidden;
		}
		.title_name {
			margin: .02rem 0 .32rem 0;
			font-size: 0.3rem;
			color: #211E1D;
			font-weight: 700;
			padding-left: .08rem;
			&:before {
				width: 0.06rem;
				height: 0.2rem;
				content: '';
				display: inline-block;
				background: #C5092C;
				margin: 0 .11rem 0 0;
				border-radius: 20px;
			}
		}
		.order_header {
			margin: .02rem 0 .32rem 0;
			.title_name {
				margin: 0;
			}
		}
		.header_t {
			width: 100%;
			overflow: hidden;
			padding: 0.25rem;
			box-sizing: border-box;
			border-bottom: 0.2rem solid #EEEEEE;
			font-size: 0.24rem;
			color: #848484;
			.header_content {
				display: flex;
				.img {
					flex-grow: 0;
					display: inline-block;
					width: 0.9rem;
					height: 0.9rem;
					margin: 0 0.25rem 0 0;
					border-radius: 50%;
					border: 1px solid;
				}
				.header_right {
					flex-grow: 1;
					/*//这里width随便写，不写就会扯拐*/
					width: 6rem;
					.header_right_name {
						font-size: 0.3rem;
						color: #211E1D;
						font-weight: 700;
						line-height: 0.35rem;
						margin: 0.07rem 0 0.15rem;
					}
				}
			}
			.header_pj {
				width: 100%;
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				line-height: .4rem;
				.header_pj_list {
					width: 33%;
					text-align: center;
				}
				.span {
					color: #C5092C;
				}
			}
			.header_thr {
				margin: 0.67rem 0 0.28rem;
				display: flex;
				justify-content: space-around;
				ul {
					li {
						font-size: 0.26rem;
						color: #211E1D;
						margin-bottom: 0.17rem;
						text-align: center;
					}
					li:nth-child(2) {
						font-size: 0.32rem;
						font-weight: 700;
					}
					li:nth-child(3) {
						font-size: 0.24rem;
						color: #848484;
					}
				}
			}
		}
		.order {
			padding: 0.25rem;
			border-bottom: 0.2rem solid #EEEEEE;
			.order_header {
				display: flex;
				justify-content: space-between;
				ul {
					display: flex;
					li {
						font-size: .24rem;
						color: #848484;
						margin-left: .29rem;
					}
					.active {
						color: #018BE6;
						border-bottom: .04rem solid #018BE6;
					}
				}
			}
			.order_chart {
				width: 100%;
				height: 5.92rem;
				margin: 0rem 0 0 0;
			}
		}
		.merchandise,
		.week_list {
			padding: .25rem 0 0 0;
			border-bottom: 0.2rem solid #EEEEEE;
			.title_name {
				padding-left: .25rem;
			}
			.content {
				display: flex;
				border-top: 1px solid #E1E1E1;
				ul {
					width: 50%;
					li {
						color: #848484;
						font-size: .26rem;
						padding-left: .33rem;
						.unit {
							font-size: .24rem;
							color: #848484;
						}
					}
					li:nth-child(2) {
						font-size: .4rem;
						color: #211E1D;
						margin: .18rem 0;
						padding-bottom: .22rem;
					}
					li:nth-child(1) {
						padding-top: .25rem;
					}
				}
				ul:nth-child(2) {
					box-sizing: border-box;
					border-left: 1px solid #E1E1E1;
					li {
						padding-left: .34rem;
					}
				}
			}
			.zf_money_header {
				display: flex;
				justify-content: space-between;
				margin: .02rem 0 .32rem 0;
				.title_name {
					margin: 0;
				}
				ul {
					display: flex;
					li {
						margin-right: .3rem;
					}
					.active {
						color: #018BE6;
						border-bottom: .04rem solid #018BE6;
					}
				}
			}
			.zf_money {
				ul {
					display: flex;
					li {
						box-sizing: border-box;
						font-size: .26rem;
						color: #848484;
						width: 33.3%;
						border-right: 1px solid #E1E1E1;
						border-bottom: 1px solid #E1E1E1;
						padding: .3rem .2rem;
					}
					li:nth-child(3) {
						border-right: none;
					}
				}
				.zf_money_top {
					border-top: 1px solid #E1E1E1;
					li {
						color: #211E1D;
						font-size: .3rem;
						font-weight: 700;
					}
				}
			}
			.notice {
				text-align: center;
				color: red;
				padding: .2rem;
			}
		}
	}
</style>