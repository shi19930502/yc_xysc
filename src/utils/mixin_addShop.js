export default {
	data() {
		return {
			pageNum: 1,
			queryGrouplist: [],
			shopCar: {
				shopNum: 0,
				commodityNum: 0,
				shopMoney: "0.00",
			},
		}
	},
	created() {

	},
	mounted() {

	},
	methods: {
		/**
		 * 添加和减少商品数量
		 */
		//0为减，1为加
		countQuantity(d, index, flgNum, allFlg) {
			if(parseFloat(d.quantity) > 9999) {
				if(d.skuMethodType == 1) {
					d.quantity = '9999.00'
				} else {
					d.quantity = 9999
				}
			}
			var param = {};
			var url = '';
			param = {
				buyerId: this.$root.userInfo.typeCode,
				productId: d.productId,
				productName: d.productName,
				skuId: d.skuId ? d.skuId : d.id,
				skuName: d.skuName,
				quantity: 1,
				comment: '',
				sellerId: allFlg ? d.supplierId : d.sellerId,
			}

			if(d.quantity && d.quantity >= 0) {
				//					其实可以直接先转， d.quantity = parseFloat(d.quantity).toFixed(2)，后面都不用写那么多了的。。
				url = 'shippingcar/update'
				d.skuMethodType == 1 ? d.quantity = parseFloat(d.quantity).toFixed(2) : this.$set(d, 'quantity', parseInt(parseFloat(d.quantity)))
				if(flgNum == 1 && d.quantity < 9999) {
					d.quantity = d.skuMethodType == 1 ? (parseFloat(d.quantity) + 1).toFixed(2) : parseInt(d.quantity + 1);
				} else if(flgNum == 0) {
					d.quantity = d.skuMethodType == 1 ? (parseFloat(d.quantity) - 1).toFixed(2) : parseInt(d.quantity - 1);
				}
				d.quantity <= 0 ? d.quantity = null : d.quantity = d.quantity
				if(d.quantity == null) {
					url = 'shippingcar/delete'
				}
				param.quantity = d.quantity
				Object.assign(param, { id: d.id })
			} else if(flgNum == 2) {
				d.skuMethodType == 1 ? d.quantity = d.quantity : this.$set(d, 'quantity', parseInt(parseFloat(d.quantity)))
				param.quantity = d.quantity
				Object.assign(param, { id: d.id })
				url = 'shippingcar/delete'
			} else {
				this.$set(d, 'quantity', param.quantity)
				url = 'shippingcar/create'
			}
			this.postRequest(url, param).then((resp) => {
				if(resp.data.state == 0 && resp.data.msg == 'success') {
					if(url == 'shippingcar/delete') {
						d.quantity = null
					}
					this.getQueryGrouplist(true)
				}else{
					this.$dialog.toast({
	                    mes: resp.data.msg,
	                    timeout: 1500
	                });
	                if(flgNum==0){
						d.quantity = d.skuMethodType == 1 ? (parseFloat(d.quantity) + 1).toFixed(2) : parseInt(d.quantity + 1);
	                }else if(flgNum==1){
	                	if(url == 'shippingcar/create'){
	                		d.quantity =null
	                	}else{
	                		d.quantity=d.oldquantity
//							d.quantity = d.skuMethodType == 1 ? (parseFloat(d.quantity) - 1).toFixed(2) : parseInt(d.quantity - 1);
	                	}
	                }else{
	                	d.quantity=d.oldquantity
	                }
				}
			})
		},
		getProductcollection() {
			var url='productsku/getSkuByOftenBuyOverChannel';
			var pamars={
				pageNum: this.pageNum,
				pageSize: 10,
				keyWord: this.searchInputVal,
				purchaserId:this.$root.userInfo.typeCode
			};
//			if(CITY=='临沂'){
				url='productsku/getSkuOverStore'
//			}
			this.postRequest(url, pamars).then((resp) => {
				if(resp.data && resp.data.state == 0) {
					this.addQuantity(resp.data.aaData, this.queryGrouplist)
					this.productcollection = [...this.productcollection, ...resp.data.aaData];
					if(this.productcollection.length >= resp.data.dataCount) {
						/* 所有数据加载完毕 */
						this.$refs.searchAllGoods.$emit('ydui.infinitescroll.loadedDone');
						return;
					}
					/* 单次请求数据完毕 */
					if(resp.data.aaData.length > 0) {
						this.$refs.searchAllGoods.$emit('ydui.infinitescroll.finishLoad');
					}
					this.pageNum++;
				}
			})
		},
		/**
		 * 请求购物车数据
		 */
		getQueryGrouplist(flg) {
			this.postRequest('shippingcar/queryGrouplist', {
				buyerId: this.$root.userInfo.typeCode,
			}).then(resp => {
				if(resp.data && resp.data.state == 0) {
					var shopNum = 0;
					this.queryGrouplist = [];
					this.shopCar.shopMoney = '0.00'
					for(var key in resp.data.aaData) {
						shopNum++
						this.queryGrouplist = this.queryGrouplist.concat(resp.data.aaData[key])
					}
					//footer购物车 店铺数量，总价格，商品数量
					this.shopCar.shopNum = shopNum
					this.shopCar.commodityNum = this.queryGrouplist.length
					for(let a = 0; a < this.queryGrouplist.length; a++) {
						var money = parseFloat(this.queryGrouplist[a].promotionPrice) * parseFloat(this.queryGrouplist[a].quantity)
						this.shopCar.shopMoney = (parseFloat(this.shopCar.shopMoney) + money).toFixed(2)
					}
					if(flg) {
						this.addQuantity(this.productcollection, this.queryGrouplist)
					} else {
						this.getProductcollection(true)
					}

				}
			})
		},
		goShopCar() {
			if(this.shopCar.commodityNum > 0) {
				this.$router.push({ name: 'ShopCar' })

			} else {
				this.$dialog.toast({
					mes: '购物车还没有数据哟~~',
					timeout: 1500
				});
			}
		},
		/**
		 * 给productcollection加quantity参数和update的id
		 */
		addQuantity(productcollectionArr, queryGrouplistArr) {
			for(let m = 0; m < productcollectionArr.length; m++) {
				for(let n = 0; n < queryGrouplistArr.length; n++) {
					if(productcollectionArr[m].skuId == queryGrouplistArr[n].skuId) {
						if(queryGrouplistArr[n].quantity != null && queryGrouplistArr[n].quantity) {
							if(productcollectionArr[m].skuMethodType == 1) {
								productcollectionArr[m].quantity = queryGrouplistArr[n].quantity.toFixed(2)
								productcollectionArr[m].oldquantity = queryGrouplistArr[n].quantity.toFixed(2)
							} else if(productcollectionArr[m].skuMethodType == 2) {
								productcollectionArr[m].quantity = queryGrouplistArr[n].quantity
								productcollectionArr[m].oldquantity = queryGrouplistArr[n].quantity
							}
						}
						productcollectionArr[m].gwcId = queryGrouplistArr[n].id
						productcollectionArr[m].id = queryGrouplistArr[n].id
					}
				}
			}
		},
		name_4Style(flg) {
			if(flg) {
				return {
					textDecoration: ' line-through',
					color: 'rgb(121, 125, 119)',
					fontSize: '.24rem'
				}
			}
			return {}
		},
		//进入选中所有
		focusSelectAll(t) {
			t.target.select();
		},
	}
}