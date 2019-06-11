<template>
	<yd-layout>
		<yd-scrolltab>
			<div id="UserNewAddress">
				<yd-cell-group>
					<!--<yd-cell-item arrow>
						<span slot="left">
				          <div class="lable">
				            <strong>行政区</strong>
				          </div>
				        </span>
						
						<div  v-if='form.provinceName||form.cityName||form.districName' class="select_addr" @click='selectAddr(form)' slot="right">{{form.provinceName}}{{form.cityName?'/'+form.cityName:form.cityName}}{{form.districName?'/'+form.districName:form.districName}}</div>
						<div v-else class="select_addr" @click='selectAddr(form)' slot="right">请优先选择您的区域地址</div>
					</yd-cell-item>-->
					<yd-cell-item arrow>
						<span slot="left">
				          <div class="lable">
				            <strong>省/市</strong>
				          </div>
				       </span>
						<select v-model="form.provinceCode" slot="right" @change="changeProvinceList(form.provinceCode)">
							<option value="" disabled selected>请选择省/市</option>
							<option :value="d.areaCode" v-for="d in ProvinceList">{{d.areaName}}</option>
						</select>
					</yd-cell-item>
					<yd-cell-item arrow>
						<span slot="left">
				          <div class="lable">
				            <strong>市辖区/市/县</strong>
				          </div>
				        </span>
						<select v-model="form.cityCode" slot="right" @change="changeCityList(form.cityCode)">
							<option value="" disabled selected>请选择市辖区/市/县</option>
							<option :value="d.areaCode" v-for="d in CityList">{{d.areaName}}</option>
						</select>
					</yd-cell-item>
					<yd-cell-item arrow>
						<span slot="left">
				          <div class="lable">
				            <strong>区/县</strong>
				          </div>
				        </span>
						<select v-model="form.districCode" slot="right" @change='changeDistricList(form.districCode)'>
							<option value="" disabled selected>请选择区/县</option>
							<option :value="d.areaCode" v-for="d in DistricList">{{d.areaName}}</option>
						</select>
					</yd-cell-item>
					<yd-cell-item >
						<span slot="left">
				          <div class="lable">
				            <strong>联系人</strong>
				          </div>
						</span>
						<yd-input slot="right" v-model="form.contacts" max="20" placeholder="请输入联系人" :show-success-icon="false"></yd-input>
					</yd-cell-item>
					<!--  <yd-cell-item>
				        <span slot="left">
				          <div class="lable"></div>
				        </span>
				        <span slot="left">
				          <yd-badge shape="square" type="hollow">先生</yd-badge>
				          <yd-badge shape="square" type="hollow">女士</yd-badge>
				        </span>
				     </yd-cell-item> -->
					<yd-cell-item >
						<span slot="left">
				          <div class="lable">
				            <strong>电话</strong>
				          </div>
				       </span>
						<yd-input ref='telNum' slot="right" type="number" regex="mobile" v-model.number="form.phoneNumber" max="20" placeholder="请输入联系电话" :show-success-icon="false"></yd-input>
					</yd-cell-item>

					<yd-cell-item >
						<span slot="left">
				          <div class="lable">
				            <strong>详细地址</strong>
				          </div>
				        </span>
						<yd-input slot="right" v-model="form.detailedAddress" max="20" placeholder="例：XX街道XX号" :show-success-icon="false"></yd-input>
					</yd-cell-item>
					<yd-cell-item class="textarea" >
						<span slot="left">
				          <div class="lable">
				            <strong>完整信息</strong>
				          </div>
				        </span>
						<!--<span slot="left">{{form.completeAddress}}</span>-->
						<yd-textarea slot="right" readonly placeholder="" v-model="form.completeAddress" maxlength="100"></yd-textarea>
					</yd-cell-item>
					<yd-cell-item class="textarea" >
						<span slot="left">
				          <div class="lable">
				            <strong>备注</strong>
				          </div>
				        </span>
						<yd-textarea slot="right" placeholder="请输入备注信息" v-model="form.comment" maxlength="100" :show-success-icon="false"></yd-textarea>
					</yd-cell-item>
				</yd-cell-group>
			</div>
		</yd-scrolltab>

		<!--<div class="flex flex-x-center" style="padding: 0 0.24rem;position: absolute;bottom: 0;width: 100%;">
			<div @click="save" class="loginbtn flex flex-y-center flex-x-center">
				<span>保存</span>
			</div>
		</div>-->
		<yd-button  @click.native="save" size="large" bgcolor="#6FB138" color="#fff" style="padding: 0 0.24rem;position: absolute;bottom: 0;width: 100%;">确定</yd-button>
	</yd-layout>
</template>
<script>
	import mixin from '../../utils/mixin.js';
	export default {
		mixins: [mixin],
		data() {
			return {
				type: 'add',
				form: {
					id: '',
					districName: '',
					detailedAddress: '',
					completeAddress: '',
					contacts: '',
					phoneNumber: '',
					customerId: '',

					provinceCode: '',
					cityCode: '',
					districCode: '',
					comment: '',
					getAddr: {},
				},
				ProvinceList: [],
				CityList: [],
				DistricList: [],
			}
		},
		watch: {
			"form.detailedAddress": function(val, oldVal) {
				this.form.completeAddress = this.form.provinceName +' '+ this.form.cityName +' '+ this.form.districName + val
			}
		},
		created() {
			//			
			this.$store.dispatch('changeNavBarTitle', '')
			if(sessionStorage.getItem('getAddr')) {
				this.getAddr = JSON.parse(sessionStorage.getItem('getAddr'))
				console.log(this.getAddr)
				sessionStorage.setItem('getAddr', '')
			}

			this.init()

			this.postRequest('address/queryByCustomerId', {
				customerId: this.$root.userInfo.typeCode,
			}).then(res => {
				console.log(res.data.aaData)
				if(res.data.aaData) {
					this.type = 'edit'
				}
				if(this.type == 'add') {
					this.$store.dispatch('changeNavBarTitle', '新增地址')
				} else {
					this.$store.dispatch('changeNavBarTitle', '编辑地址')
					this.form = res.data.aaData

					this.getCityList()
					this.getDistricList()
				}
				if(this.getAddr) {
					console.log('getAddr', this.getAddr)
					this.form.provinceName = this.getAddr.pname
					this.form.provinceCode = this.getAddr.pcode
					this.form.cityName = this.getAddr.cityname
					this.form.cityCode = this.getAddr.pcode
					this.form.districName = this.getAddr.adname
					this.form.latitude = this.getAddr.location.lat
					this.form.longitude = this.getAddr.location.lng
					this.form.districCode = this.getAddr.adcode //zhanhuan
					this.form.detailedAddress = this.getAddr.address + this.getAddr.name
					this.form.completeAddress = this.getAddr.pname +
						'/' + this.getAddr.cityname +
						'/' + this.getAddr.adname + '，'
					this.getAddr.name + '，' +
						this.getAddr.address
					this.postRequest('comArea/list', {
						parentAreaCode: this.form.provinceCode,
						level: 2
					}).then(d => {
						if(d.data && d.data.state == 0) {
							for(let a = 0; a < d.data.aaData.length; a++) {
								if(d.data.aaData[a].areaName == this.form.cityName) {
									this.form.cityCode = d.data.aaData[a].areaCode
									break
								}
							}
						}
					})
				}
				console.log(this.form)
			})
		},
		mounted() {
			
		},
		methods: {
			selectAddr(form) {
				console.log(form)
				if(form.provinceName || form.cityName || form.districName) {
					this.$dialog.confirm({
						title: '提示：',
						mes: '离开此页面，系统可能不会保存你做的修改。',
						opts: () => {
							this.$router.push({
								name: 'selectAddr'
							})
						}
					});
				} else {
					this.$router.push({
						name: 'selectAddr'
					})
				}

			},
			/**
			 * 初始化
			 */
			init() {
				this.getProvinceList()
			},
			/**
			 * 获取省列表
			 */
			getProvinceList() {
				this.postRequest('comArea/list', {
					level: 1
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.ProvinceList = d.data.aaData
					}
				})
			},
			getName(arr, code) {
				var name = ''
				for(let a = 0; a < arr.length; a++) {
					if(arr[a].areaCode == code) {
						name = arr[a].areaName
						break
					}
				}
				return name
			},
			changeProvinceList(val) {
				this.form.cityCode = ''
				this.form.districCode = ''
				this.form.provinceName = this.getName(this.ProvinceList, val);
				this.form.cityName = ''
				this.form.districName = ''
				this.form.completeAddress = ''
				this.DistricList = []
				this.getCityList()
			},
			/**
			 * 获取市列表
			 */
			getCityList() {
				this.postRequest('comArea/list', {
					parentAreaCode: this.form.provinceCode,
					level: 2
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.CityList = d.data.aaData
					}
				})
			},
			changeCityList(val) {
				this.form.districCode = ''
				this.form.cityName = this.getName(this.CityList, val);
				this.form.districName = ''
				this.form.completeAddress = ''
				this.getDistricList()
			},
			/**
			 * 获取县区列表
			 */
			getDistricList() {
				this.postRequest('comArea/list', {
					parentAreaCode: this.form.cityCode,
					level: 3
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.DistricList = d.data.aaData
					}
				})
			},
			changeDistricList(val) {
				this.form.districName = this.getName(this.DistricList, val);
				this.form.completeAddress = this.form.provinceName +' '+ this.form.cityName +' '+ this.form.districName + this.form.detailedAddress
			},
			/**
			 * 保存
			 */
			save() {
				var param = {
					id: this.form.id,
					provinceCode: this.form.provinceCode,
					cityCode: this.form.cityCode,
					districCode: this.form.districCode,
					detailedAddress: this.form.detailedAddress,
					contacts: this.form.contacts,
					phoneNumber: this.form.phoneNumber,
					customerId: this.form.customerId,
					comment: this.form.comment,
					latitude: this.form.latitude,
					longitude: this.form.longitude,
				}
				if(param.provinceCode == '') {
					this.$dialog.alert({
						mes: '请选择省/市~~'
					});

				}
				if(param.cityCode == '') {
					this.$dialog.alert({
						mes: '请选择市辖区/市/县~~'
					});
					return
				}
				if(param.districCode == '') {
					this.$dialog.alert({
						mes: '请选择区/县~~'
					});
					return
				}
				if(param.contacts == '') {
					this.$dialog.alert({
						mes: '请填写联系人~~'
					});
					return
				}
				if(param.phoneNumber == '') {
					this.$dialog.alert({
						mes: '请填写联系电话~~'
					});
					return
				} else {
					var phoneNum = this.$refs.telNum;
					if(!phoneNum.valid) {
						this.$dialog.alert({
							mes: '请输入正确的手机号码~~'
						});
						return
					}
				}
				
				if(param.detailedAddress == '') {
					this.$dialog.alert({
						mes: '请填写详细地址~~'
					});
					return
				}

				var url = 'address/create'

				if(this.type == 'edit') {
					url = 'address/update'
				} else {
					param.customerId = this.userInfo.typeCode
				}
				this.postRequest(url, param).then(d => {
					if(d.data && d.data.state == 0) {
						this.$dialog.toast({
							mes: '保存成功',
							timeout: 1200,
							icon: 'success',
							callback: function() {
								this.$router.push({
									name: 'UserAddress'
								})
							}.bind(this)
						});
					} else {
						this.$dialog.alert({
							mes: d.data.msg
						})
					}
				})

			}
		}
	};
</script>
<style lang="scss">
	/**重写scrolltab*/
	
	.yd-scrolltab-content {
		padding: 0 0 0 0;
	}
	
	.yd-scrolltab {
		top: 0rem;
		bottom: 1rem;
	}
	
	.loginbtn {
		width: 100%;
		height: 0.78rem;
		background: #6FB138;
		border-radius: 0.39rem;
		color: #fff;
		font-size: 0.31rem;
		text-align: center;
	}
	
	#UserNewAddress {
		height: 100%;
		overflow: auto;
		textarea {
			font-family: 'PingFang-SC-Medium';
		}
		.textarea {
			.yd-cell-left {
				-webkit-box-align: start;
				-moz-align-items: start;
				-webkit-align-items: start;
				align-items: start;
				padding: .2rem 0;
			}
		}
		select {
			color: #333;
			padding-left: 5px;
			font-family: 'PingFang-SC-Medium';
		}
		.lable {
			width: 1.8rem;
			font-size: 0.3rem;
		}
		.yd-cell-right.yd-cell-arrow {
			justify-content: flex-start;
			&:after {
				position: absolute;
				right: .3rem;
			}
		}
		.select_addr {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
		}
	}
	
	#UserNewAddress::-webkit-scrollbar {
		display: none;
	}
</style>