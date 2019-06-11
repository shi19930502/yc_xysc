<template>
	<yd-layout id='fSearch'>
		<div slot='top' class="search_input search_input_popup gradient search_input_children_fixed">
			<input oninput="if(value.length>20)value=value.slice(0,20)" class="search_input_children " ref='searchRef' type="text" placeholder="搜索" v-model='searchInput' />
			<div class="close_popup" @click="submit">确认</div>
			<yd-icon @click.native='clearInput' v-show='flgError' size=".32rem" class='yd-icon-error-c' color='#989E92' name="error"></yd-icon>

		</div>
		<yd-checklist v-model="checklist">
			<div class="goods_list">
				<yd-checklist-item :change='radioChange' @click.native='radioClick' v-for='(item ,index) in dataList' :key="item.f_id" :val="item.f_id">
					<div v-if='$route.query.url=="xzjc"' style="height: 50px;line-height: 50px;">{{item.productName}}<span v-if='item.f_name&&item.f_name'> - {{item.f_name}}</span></div>
					<div v-else style="height: 50px;line-height: 50px;"><span v-if='item.f_name&&item.f_name'>{{item.f_name}}</span></div>
				</yd-checklist-item>
			</div>
		</yd-checklist>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				checklist: [],
				oldChecklist: [],
				TJSP_sessionObj: {},
				XZJC_sessionObj: {},
				searchInput: '',
				flgError: false,
				count: 0,
			}
		},
		created() {
			if(this.$route.query.url == 'tjsp') {
				if(sessionStorage.getItem('TJSP_search')) {
					this.TJSP_sessionObj = JSON.parse(sessionStorage.getItem('TJSP_search'))
					this.checklist = this.TJSP_sessionObj.checklist;
					this.oldChecklist = this.TJSP_sessionObj.checklist
					this.searchInput = this.TJSP_sessionObj.val
					var obj = {
						val: '',
						checklist: this.checklist
					}
					sessionStorage.setItem('TJSP_search', JSON.stringify(obj))
				}
			} else if(this.$route.query.url == 'xzjc') {
				if(sessionStorage.getItem('XZJC_search')) {
					this.XZJC_sessionObj = JSON.parse(sessionStorage.getItem('XZJC_search'))
					console.log(this.XZJC_sessionObj)
					this.checklist = this.XZJC_sessionObj.checklist
					this.oldChecklist = this.XZJC_sessionObj.checklist
					this.searchInput = this.XZJC_sessionObj.val
					var obj = {
						val: '',
						checklist: this.checklist
					}
					sessionStorage.setItem('XZJC_search', JSON.stringify(obj))
				}
			} else {
				this.$router.back();
			}

		},
		watch: {
			searchInput: function(val, oldVal) {
				console.log(val, oldVal)
				if(val.length > 0) {
					this.flgError = true
				} else {
					this.flgError = false
				}
				var params={
					firstCharStr: '',
					keyWord: val,
				}
				var url='Category/queryCategorylistByfirstChar'
				if(this.$route.query.url=='xzjc'){
					url='productsku/querySkuFirstCharByCustomerId'
					params.sellerId=this.$root.userInfo.typeCode
				}
				this.$dialog.loading.open('数据加载中...');
				this.init(url,params);
			} 
		},
		computed: {

		},
		mounted() {
			
		},
		methods: {
			radioChange(val, flg) {
				this.isSelectFlg = flg
				this.isSelectId = val
			},
			radioClick() {
				if(this.isSelectFlg) {
					this.oldChecklist.push(this.isSelectId)
				} else {
					for(let a = 0; a < this.oldChecklist.length; a++) {
						if( this.oldChecklist[a]==this.isSelectId){
							this.oldChecklist.splice(a,1)
						}
					}
				}

			},
			clearInput() {
				this.searchInput = ''
			},
			init(url,params) {
				this.postRequest(url, params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state==0&&resp.data.aaData){
						this.dataList = resp.data.aaData
						console.log(this.dataList)
					}else{
						this.$dialog.toast({
		                    mes: resp.data.msg,
		                    timeout: 1500
		                });
					}
				})
			},
			submit() {
				var obj = {
					val: '',
					checklist: this.oldChecklist
				}
				if(this.$route.query.url == 'tjsp') {
					sessionStorage.setItem('TJSP_search', JSON.stringify(obj))
					this.$router.push({
						name: "f_tjsp_xz",
						query: {
							url: 'tjsp'
						}
					})
				} else if(this.$route.query.url == 'xzjc') {
					sessionStorage.setItem('XZJC_search', JSON.stringify(obj))
					this.$router.push({
						name: "f_xzjc_xz",
						query: {
							url: 'xzjc',
							mainId:this.$route.query.mainId
						}
					})
				}
			},
		}
	}
</script>

<style lang='scss'>
	#fSearch {
		.yd-icon-error-c {
			position: absolute;
			right: 1.15rem;
			top: .25rem;
		}
		.search_input {
			width: 100%;
			position: relative;
			box-sizing: border-box;
			padding: .08rem .25rem;
			/*background: #80C551;*/
			.search_input_children {
				border-radius: .08rem;
				border: 1px solid white;
				width: 100%;
				padding: .15rem;
				font-size: .28rem;
				color: #2F3927;
				text-indent: .5rem;
				width: 100%;
				background-color: white;
				background-image: url(../../assets/imgs/fangdajing.png);
				background-repeat: no-repeat;
				background-size: contain;
				background-size: .4rem .4rem;
				background-position: .1rem .12rem;
			}
		}
		.search_input_popup {
			/*position: fixed;*/
			z-index: 9999;
			top: 0;
			display: flex;
			align-items: center;
			padding: .08rem 0 .08rem .25rem;
			.search_input_children {
				width: 5rem;
				flex-grow: 1;
			}
			.close_popup {
				font-size: .32rem;
				text-align: center;
				color: white;
				width: 1rem;
				flex-grow: 0;
			}
		}
		.gradient{
			background: -webkit-linear-gradient(180deg, #018BE6, #a7d6f6);
			/* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(180deg, #018BE6, #a7d6f6);
			/* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(180deg, #018BE6, #a7d6f6);
			/* Firefox 3.6 - 15 */
			background: linear-gradient( 180deg, #018BE6, #a7d6f6);
			background: #018BE6;
		}
	}
</style>