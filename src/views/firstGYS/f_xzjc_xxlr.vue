<template>
	<yd-layout id='fXzjcXxlr'>
		<div slot='top' class="header">
			<div>
				<a @click='goBack' class="header_left" href="javascript:;">上一步</a>
			</div>
			<div class="name">信息录入{{isEdit?'(编辑)':'(新增)'}}</div>
			<div @click='goNext'>
				<a href="javascript:;">完成</a>
			</div>
		</div>
		<div class="form">
			<div v-if='!$root.config.isTowGYS&&$root.config.ssbhbgimg' class="form_car" :class='{form_car_market:$root.userInfo.typeId=="merchant"}'>
				<div>{{form.transporterId}}</div>
				<div v-if='$root.userInfo.typeId!="merchant"' class="gys_name">{{form.wholesalerName}}</div>
			</div>
			<div class="goods_list">
				<div v-for='(item,index) in dataList' class="list">
					<div class="list_name">{{item.productName}}<span v-if='item.skuName&&item.skuName!=null'> - {{item.skuName}}</span></div>
					<div class="list_right">
						<input @input='changeInput(item,"weight")' @blur='blurInput(item,"weight")' class="list_input" v-model='item.weight' type="text" placeholder="请输入进场重量" />
						<div class="list_unit">千克
							<!--{{item.measureMethodName}}-->
						</div>
						<img class="list_img" @click='delGoods(item,index)' src="../../assets/firstImgs/spgl_icon_delete@2x.png" alt="" />
					</div>
				</div>
				<div class="list_add" @click='addGoods'>
					添加商品
				</div>
			</div>
			<div style="width: 100%;height: .2rem;background: #F5F5F9;"></div>
			<div class="form_item time" v-if='form.inDate'>
				<div class="title">进场时间</div>
				<div class="item_right ces">
					<!--<input v-if='!isTel' placeholder="请选择时间" class="select_date" @blur='blurInput(form.inDate)' type="datetime-local" name="" id="" v-model='form.inDate' value="" />
					<yd-datetime v-else type="datetime" v-model="form.inDate" slot="right"></yd-datetime>-->
					<div class="pfsc">{{form.inDate}}</div>
				</div>
			</div>
			<div v-if='dataList.length>0&&form.uploadDate' class="form_item time">
				<div class="title">编辑时间</div>
				<div class="item_right ces">
					<div class="pfsc">{{form.uploadDate}}</div>
				</div>
			</div>
			<!--<div class="form_item ">
				<div class="title ">批发市场</div>
				<div class="item_right pfsc">{{form.wholesaleMarketName}}({{form.wholesaleMarketId}})</div>
			</div>-->
			<div class="form_item ">
				<div class="title ">供应商</div>
				<div class="item_right pfsc" v-if='customer'>
					{{form.wholesalerName?form.wholesalerName:customer.name}}
				</div>
				<div class="item_right pfsc" v-else>
					{{form.wholesalerName?form.wholesalerName:'空'}}
				</div>
			</div>
			<div style="width: 100%;height: .2rem;background: #F5F5F9;"></div>

			<div v-if='dataList.length>0'>
				<div class="form_item ">
					<div class="title ">上游供应商</div>
					<div class="item_right ">
						<select @change='selectUpStreamList(upListId)' class="item_select" name="" v-model="upListId" id="">
							<option value="" disabled selected>请选择上游供应商(必选)</option>
							<option v-for='item in upstreamList' :value="item.id">{{item.name}}</option>
						</select>
						<i class="icon"></i>
					</div>
				</div>
				<div class="form_item ">
					<div class="title ">凭证</div>
					<div class="item_right ">
						<select @change='selectListType(form.voucherType)' class="item_select" name="" v-model="form.voucherType" id="">
							<option value="" disabled selected>请选择凭证类型(必选)</option>
							<option v-for='item in listType' :value="item.key">{{item.value}}</option>
						</select>
						<i class="icon"></i>
					</div>
				</div>
				<div v-if='form.voucherType' class="form_item ">
					<div class="title ">证号/编号</div>
					<div class="item_right ">
						<input maxlength="20" v-if='form.voucherType=="001"' type="text" v-model='form.tranId' placeholder="请输入详细号码(必填)" />
						<input maxlength="20" v-if='form.voucherType=="002"' type="text" v-model='form.animalQuarantineId' placeholder="请输入详细号码(必填)" />
						<input maxlength="20" v-if='form.voucherType=="003"' type="text" v-model='form.meatInspectionId' placeholder="请输入详细号码(必填)" />
						<input maxlength="20" v-if='form.voucherType=="004"' type="text" v-model='form.provId' placeholder="请输入详细号码(必填)" />
						<input maxlength="20" v-if='form.voucherType=="005"' type="text" v-model='form.vegInspectionId' placeholder="请输入详细号码(必填)" />
					</div>
				</div>
				<div v-if='form.voucherType' class="form_item item_img">
					<div class="title ">凭证图片</div>
					<!--voucherPic-->
					<div class="item_right upload_width_father">
						<div class="upload_width">

							<el-upload ref="upload" :data='{savePath: "productOnline"}' :file-list="fileList" :limit='1' :on-error='onError' :on-success='onSuccess' :on-change='imgChange' :accept='acceptImg' :action="imgAction" :auto-upload='autoUpload' list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
								<i class="el-icon-plus"></i>
							</el-upload>
						</div>
						<div v-if='isUpload' @click='uploadImg' class="upload_btn">上传图片</div>
						<el-dialog :fullscreen='true' :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt>
						</el-dialog>
					</div>
				</div>

				<div style="width: 100%;height: .2rem;background: #F5F5F9;"></div>
				<div v-if='upListId'>
					<div class="form_item " style="border-bottom: none;">
						<div class="title ">选择产地名称</div>
					</div>
					<div class="form_item ">
						<div class="title ">省/市</div>
						<div class="item_right ">
							<select @change='selectChange1(form.provinceCode)' class="item_select" name="" v-model="form.provinceCode" id="">
								<option value="" disabled selected>请选择省/市</option>
								<option v-for='item in provinceList' :value="item.areaCode">{{item.areaName}}</option>
							</select>
							<i class="icon"></i>
						</div>
					</div>
					<div class="form_item ">
						<div class="title ">市/区</div>
						<div class="item_right ">
							<select @change='selectChange2(form.cityCode)' class="item_select" name="" v-model="form.cityCode" id="">
								<option value="" disabled selected>请选择市/区</option>
								<option v-for='item in cityList' :value="item.areaCode">{{item.areaName}}</option>
							</select>
							<i class="icon"></i>
						</div>
					</div>
					<div class="form_item ">
						<div class="title ">区/县</div>
						<div class="item_right ">
							<select @change='selectChange3(form.districCode)' class="item_select" name="" v-model="form.districCode" id="">
								<option value="" disabled selected>请选择区/县</option>
								<option v-for='item in districList' :value="item.areaCode">{{item.areaName}}</option>
							</select>
							<i class="icon"></i>
						</div>
					</div>
					<!--cd_name-->
					<div v-show='form.areaName' class="form_item ">
						<div class="title ">产地名称</div>
						<div class="item_right pfsc">
							<div>{{form.areaName?form.areaName:'请先选择完整的行政区'}}</div>
						</div>
					</div>
					<div v-show='form.areaId' class="form_item ">
						<div class="title ">产地编码</div>
						<div class="item_right pfsc">
							<div>{{form.areaId?form.areaId:'请先选择完整的行政区'}}</div>
						</div>
					</div>
					<div class="form_item ">
						<div class="title ">生产基地(种植户)</div>
						<div class="item_right ">
							<input maxlength="50" v-model='form.baseName' type="text" placeholder="请输入(必填)" />
						</div>
					</div>
					<div v-if='$root.config.isTowGYS' class="form_item ">
						<div class="title ">运输车牌号</div>
						<div class="item_right ">
							<input maxlength="20" type="text" v-model='form.transporterId' placeholder="请输入(必填)" />
						</div>
					</div>
				</div>
					
			</div>

		</div>
	</yd-layout>
</template>

<script>
	import mixin_storage from '../../utils/mixin_storage.js'
	import { Upload, Dialog } from 'element-ui';
	import Vue from 'vue'
	import axios from 'axios'
	Vue.use(Upload)
	Vue.use(Dialog)

	export default {
		mixins: [mixin_storage],
		data() {
			return {
				acceptImg: 'image/*',
				imgAction: '',
				autoUpload: false,
				fileList: [],
				dialogVisible: false,
				dialogImageUrl: '',
				isUpload: false,
				successUpload: false,
				form: {
					//					wholesaleMarketName: '北环批发市场',
					//					"wholesaleMarketId": "510100002", //批发市场编号
					inDate: '',
					uploadDate: '',
					id: '',
					wholesalerName: '', //供应商名称
					wholesalerId: '', //供应商id
					voucherType: '', //凭证code
					voucherPic: '',
					provinceCode: '', //省、市
					cityCode: '', //市、区
					districCode: '', //区、县
					baseName: '', //生产基地
					areaId: '', //地址code
					areaName: '', //地址
					transporterId: '', //车牌号
					//五个凭证号
					meatInspectionId: null, //003
					provId: null, //004
					animalQuarantineId: null, //002
					tranId: null, //001
					vegInspectionId: null, //005
					supplierId:'',
					supplierName:'',
				},
				customer: {},
				isTel: false,
				listType: [],
				dataList: [],
				//省市区县
				provinceList: [],
				cityList: [],
				districList: [],
				upstreamList: [], //上游供应商
				upListId:'',

			}
		},
		created() {
			sessionStorage.setItem('XZJC_search', '')
			this.imgAction = ROOT_API + '/api/comm/fileUpload/file/imgUpload?token=' + this.$root.userInfo.token
		},
		watch: {
			dataList: {
				handler(val) {
					if(val.length <= 0) {
						//							wholesaleMarketName: '北环批发市场',
						//							"wholesaleMarketId": "510100002", //批发市场编号
						//							inDate: '',
						//							uploadDate: '',
						this.form.id = ''
						//							this.form.wholesalerName= '' //供应商名称
						this.form.wholesalerId = '' //供应商id
						this.form.voucherType = '' //凭证code
						this.form.voucherPic = ''
						this.form.provinceCode = '' //省、市
						this.form.cityCode = '' //市、区
						this.form.districCode = '' //区、县
						this.form.baseName = '' //生产基地
						this.form.areaId = '' //地址code
						this.form.areaName = '' //地址
						//							this.form.transporterId= '' //车牌号
						//五个凭证号
						this.form.meatInspectionId = null //003
						this.form.provId = null //004
						this.form.animalQuarantineId = null //002
						this.form.tranId = null //001
						this.form.vegInspectionId = null //005
						this.form.supplierId=''
						this.form.supplierName=''
						this.upListId=''
					}
				},
				deep: true
			}
		},
		computed: {

		},
		mounted() {
			this.$dialog.loading.open('数据加载中...');
			this.init()
			this.getUpstreamList();
		},
		methods: {
			selectUpStreamList(id){
				var item=this.upstreamList.find(i=>{return id==i.id})
				var arrId=item.areaId.split('-')
				this.form.provinceCode=arrId[0]
				this.getcityList(arrId[0]);
				this.form.cityCode=arrId[1]
				this.getdistricList(arrId[1]);
				this.form.districCode=arrId[2]
				this.form.areaId=item.areaId
				this.form.areaName=item.areaName
				this.form.transporterId=item.transporterId
				this.form.baseName=item.baseName
				this.form.supplierId=item.id
				this.form.supplierName=item.name
				
			},
			//请求上游供应商
			getUpstreamList() {
				this.postRequest('supplier/list', {
					enabled: 1
				}).then(resp => {
					if(resp.data.state == 0) {
						this.upstreamList = resp.data.aaData
					}
				})
			},
			addGoods() {
				var arr = []
				if(!this.dataList) {
					this.dataList = []
				}
				for(let a = 0; a < this.dataList.length; a++) {
					arr.push(this.dataList[a].skuId)
				}
				var o = {
					checklist: arr,
					step: 2,
					checkGoods: this.dataList
				}
				sessionStorage.setItem('XZJC_edit', JSON.stringify(o))
				sessionStorage.setItem('XZJC_search', '')
				this.$router.push({
					name: 'f_xzjc_xz',
					query: {
						mainId: this.$route.query.mainId,
						code: this.form.wholesalerId
					}
				})

			},
			delGoods(item, index) {
				console.log(index)
				this.dataList.splice(index, 1)
			},
			onError(err, file, fileList) {
				this.$dialog.loading.close();
				this.$dialog.toast({
					mes: '上传图片失败，请点击重新上传',
					timeout: 1500
				});
			},
			onSuccess(resp, file, fileList) {
				this.$dialog.loading.close();
				if(resp.state == 0) {
					this.$nextTick(() => {
						this.form.voucherPic = resp.aaData.path
						this.isUpload = false
						this.successUpload = true
						console.log(this.fileList)
					})
				} else {
					this.$nextTick(() => {
						this.$dialog.toast({
							mes: '图片上传失败,请重新选择！！',
							timeout: 1500
						});
						this.fileList = []
						this.isUpload = false
						document.getElementsByClassName('el-upload')[0].style = 'display:inline-block'
					})
				}
			},
			imgChange(file, fileList) {
				const isLt2M = file.size / 1024 / 1024 < 4;
				if(!isLt2M) {
					this.$dialog.toast({
						mes: '图片大小不能超过4M~~',
						timeout: 1500
					});
					this.fileList = []
				} else {
					this.fileList = fileList;
					this.isUpload = true;
					if(fileList.length == 1) {
						document.getElementsByClassName('el-upload')[0].style = 'display:none'
					}
				}
				return isLt2M;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//移除图片
			handleRemove(file, fileList) {
				this.isUpload = false;
				this.successUpload = false;
				this.successUpload = false;
				this.fileList = [];
				this.form.voucherPic = ''
				console.log(this.fileList)
				if(fileList.length < 1) {
					document.getElementsByClassName('el-upload')[0].style = 'display:inline-block'
				}
			},
			uploadImg() {
				this.$dialog.loading.open('图片上传中...');
				this.$refs.upload.submit();
			},
			init() {
				//获取凭证类型
				this.getDatadic()

				//判断端
				this.isTel = this.$root.isPcOS()
				//判断是新增进来还是编辑进来
				console.log(this.isEdit)
				if(this.isEdit) {
					this.$store.dispatch('changeNavBarTitle', '编辑进场')
					//this.dataList = JSON.parse(sessionStorage.getItem('XZJC_edit')).checkGoods
					this.getMainAndDetail()
				} else {
					this.$store.dispatch('changeNavBarTitle', '新增进场')
					//					this.dataList = JSON.parse(localStorage.getItem('XZJC_add')).checkGoods
				}
				//二批供应商
				if(this.$route.query.url == 'xz' && this.$root.config.isTowGYS) {
					if(sessionStorage.getItem('XZJC_edit')) {
						this.dataList = JSON.parse(sessionStorage.getItem('XZJC_edit')).checkGoods
					}
				}
				//请求地址
				this.getprovinceList();
				//请求。。。只有二批的时候这个才有用
				if(this.$root.config.isTowGYS) {
					this.getCustomer();
				}

			},
			getCustomer() {
				this.postRequest('customer/queryById', {
					id: this.$root.userInfo.typeCode
				}).then(resp => {
					if(resp.data.state == 0) {
						this.customer = resp.data.aaData
					}
				})
			},
			blurInput(val) {
				if(!val) {
					this.form.inDate = this.$root.getDate().split(' ')[0] + 'T' + this.$root.getDate().split(' ')[1]
				}
			},

			goBack() {
				//真通过进场页面的编辑进去，假表示
				if(this.$route.query.mainId) {
					if(JSON.parse(sessionStorage.getItem('XZJC_isJcgl'))) {
						this.$router.push({
							name: 'f_jcgl',
							query: {
								mainId: this.$route.query.mainId
							}
						})
					} else {
						this.$router.push({
							name: 'f_jcxq',
							query: {
								mainId: this.$route.query.mainId
							}
						})
					}
				} else {
					this.$router.push({
						name: 'f_jcgl',
					})
				}
			},
			goNext() {
				if(this.dataList.length <= 0) {
					this.$dialog.toast({
						mes: '请至少添加一样商品~_~',
						timeout: 1500
					});
					return
				}
				if(!this.upListId) {
					this.$dialog.toast({
						mes: '请选择上游供应商~_~',
						timeout: 1500
					});
					return
				}
				if(!this.form.voucherType) {
					this.$dialog.toast({
						mes: '请选择凭证类型~_~',
						timeout: 1500
					});
					return
				}
				var str = 'tranId';
				if(this.form.voucherType == "001") {
					str = 'tranId'
				} else if(this.form.voucherType == "002") {
					str = 'animalQuarantineId'
				} else if(this.form.voucherType == "003") {
					str = 'meatInspectionId'
				} else if(this.form.voucherType == "004") {
					str = 'provId'
				} else if(this.form.voucherType == "005") {
					str = 'vegInspectionId'
				}

				if(!this.form[str] || this.form[str] == null) {
					this.$dialog.toast({
						mes: '请输入证号/编号~_~',
						timeout: 1500
					});
					return
				}
				if(!this.form.provinceCode) {
					this.$dialog.toast({
						mes: '请选择省/市~_~',
						timeout: 1500
					});
					return
				}
				if(!this.form.cityCode) {
					this.$dialog.toast({
						mes: '请选择市/区~_~',
						timeout: 1500
					});
					return
				}
				if(!this.form.districCode) {
					this.$dialog.toast({
						mes: '请选择区/县~_~',
						timeout: 1500
					});
					return
				}
				if(!this.form.baseName) {
					this.$dialog.toast({
						mes: '请输入生产基地(种植户)~_~',
						timeout: 1500
					});
					return
				}
				if(!this.form.transporterId) {
					this.$dialog.toast({
						mes: '请输入车牌号~_~',
						timeout: 1500
					});
					return
				}
				if(!this.$root.carReg(this.form.transporterId)) {
					this.$dialog.toast({
						mes: '请输正确的车牌号-_-!',
						timeout: 1500
					});
					return
				}
				if(this.fileList.length > 0 && !this.successUpload) {
					this.$dialog.confirm({
						title: '提示：',
						mes: '你还有图片尚未上传，是否上传过后在保存？',
						opts: [{
								txt: '跳过直接保存',
								color: false,
								callback: () => {
									this.save()
								}
							},
							{
								txt: '去上传',
								color: true,
								callback: () => {

								}
							}
						]
					});
				} else {
					this.save()
				}

			},
			save() {
				var arr = [];
				var date = ''

				console.log(this.dataList.length)
				for(let a = 0; a < this.dataList.length; a++) {
					var o = {};

					o.tranId = this.form.tranId
					o.animalQuarantineId = this.form.animalQuarantineId
					o.meatInspectionId = this.form.meatInspectionId
					o.provId = this.form.provId
					o.vegInspectionId = this.form.vegInspectionId

					o.areaNameProvince = this.form.provinceCode
					o.areaNameCity = this.form.cityCode
					o.areaNameCountry = this.form.districCode

					o.areaName = this.form.areaName
					o.areaId = this.form.areaId
					o.baseName = this.form.baseName
					o.wsSupplierId = this.$root.config.isTowGYS ? this.customer.code : this.form.wholesalerId
					o.wsSupplierName = this.$root.config.isTowGYS ? this.customer.name : this.form.wholesalerName

					o.inDate = date ? date : this.form.inDate

					o.channelCode = this.$root.userInfo.typeCode

					o.weight = this.dataList[a].weight
					o.price = this.dataList[a].price ? this.dataList[a].price : 1
					o.productName = this.dataList[a].productName
					o.productId = this.dataList[a].productId
					o.skuId = this.dataList[a].skuId
					o.skuName = this.dataList[a].skuName
					if(this.$root.config.isTowGYS) {
						o.statusId = 1
					}
					arr.push(o)
				}
				var obj = {};
				obj.channelCode = this.$root.userInfo.typeCode
				obj.inDate = this.form.inDate
				if(this.form.id) {
					obj.id = this.form.id
				}
				obj.supplierId=this.form.supplierId;
				obj.supplierName=this.form.supplierName;
				obj.tranId = this.form.tranId
				obj.animalQuarantineId = this.form.animalQuarantineId
				obj.meatInspectionId = this.form.meatInspectionId
				obj.provId = this.form.provId
				obj.vegInspectionId = this.form.vegInspectionId

				obj.areaName = this.form.areaName
				obj.areaId = this.form.areaId
				obj.baseName = this.form.baseName
				//				obj.wholesaleMarketName = this.form.wholesaleMarketName
				//				obj.wholesaleMarketId = this.form.wholesaleMarketId
				obj.wholesalerId = this.$root.config.isTowGYS ? this.customer.code : this.form.wholesalerId
				obj.wholesalerName = this.$root.config.isTowGYS ? this.customer.name : this.form.wholesalerName
				obj.voucherType = this.form.voucherType
				obj.voucherPic = this.form.voucherPic
				if(this.$root.config.isTowGYS) {
					obj.statusId = 1
				}
				var str = 'tranId';
				if(this.form.voucherType == "001") { //"交易凭证号"
					str = 'tranId'
				} else if(this.form.voucherType == "002") { //"动物产品检疫合格证号"
					//					str = 'animalQuarantineId'  //animalQuarantineId
					str = 'animalQuarantineId'
				} else if(this.form.voucherType == "003") { //"肉品品质检验合格证号"
					str = 'meatInspectionId'
				} else if(this.form.voucherType == "004") { //产地证明编号
					str = 'provId'
				} else if(this.form.voucherType == "005") { //"检测合格证号"
					str = 'vegInspectionId'
				}
				obj[str] = this.form[str]
				obj.transporterId = this.form.transporterId
				obj.inmarketdetailList = JSON.stringify(arr);
				this.$dialog.loading.open('数据保存中...');
				this.postRequest('inmarketmain/save', obj).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0) {
						if(this.isEdit) {
							sessionStorage.setItem('XZJC_isEdit', '')
							sessionStorage.setItem('XZJC_edit', '')
						} else {
							localStorage.setItem('XZJC_add', '')
						}
						this.$router.push({
							name: 'f_jcgl'
						})
					} else {
						this.$dialog.toast({
							mes: '保存失败',
							timeout: 1500,
							icon: 'error',
							callback: () => {

							}
						});
					}

				})

			},
			selectListType() {
				this.form.tranId = ''
				this.form.animalQuarantineId = ''
				this.form.meatInspectionId = ''
				this.form.provId = ''
				this.form.vegInspectionId = ''
				this.fileList = [];
				this.form.voucherPic = ''
				this.isUpload = false
				this.$nextTick(() => {
					document.getElementsByClassName('el-upload')[0].style = 'display:inline-block'

				})
			},
			selectChange1(code) {
				this.form.cityCode = '';
				this.form.districCode = '';
				this.form.areaId = ''
				this.form.areaName = ''
				this.cityList = [];
				this.getcityList(code)
			},
			selectChange2(code) {
				this.form.districCode = '';
				this.form.areaId = ''
				this.form.areaName = ''
				this.districList = [];
				this.getdistricList(code)
			},
			selectChange3() {
				this.form.areaId = this.form.provinceCode + '-' + this.form.cityCode + '-' + this.form.districCode

				this.form.areaName = this.getArea(this.form.provinceCode, this.provinceList) +
					'-' + this.getArea(this.form.cityCode, this.cityList) +
					'-' + this.getArea(this.form.districCode, this.districList)
			},
			getArea(code, arr) {
				var areaName = ''
				for(let a = 0; a < arr.length; a++) {
					if(code == arr[a].areaCode) {
						areaName = arr[a].areaName
						break
					}
				}
				return areaName
			},
			//如果是编辑信息
			getMainAndDetail() {
				if(this.$route.query.mainId) {
					this.postRequest('inmarketdetail/mainAndDetail', {
						mainId: this.$route.query.mainId
					}).then(resp => {
						if(resp.data.aaData.main.statusId != 1) {
							this.$dialog.confirm({
								title: '提示：',
								mes: '该条进场信息不能编辑，请查看其状态',
								opts: [{
									txt: '确定',
									color: true,
									callback: () => {
										this.$router.push({
											name: 'f_jcgl'
										})
									}
								}]
							});
						} else {
							var o = resp.data.aaData.main
							console.log(resp.data)
							if(this.$route.query.url == 'xz') {
								this.dataList = JSON.parse(sessionStorage.getItem('XZJC_edit')).checkGoods
							} else {
								this.dataList = resp.data.aaData.detail
							}

							console.log('this.dataList', this.dataList)
							this.$nextTick(() => {
								this.form.inDate = o.inDate
								this.form.uploadDate = o.uploadDate
								this.form.voucherType = o.voucherType
								this.form.voucherPic = o.voucherPic
								if(o.voucherPic) {
									this.fileList = [{
										name: 'o.voucherPic',
										url: this.$root.imgURL + o.voucherPic
									}]
									this.$nextTick(() => {
										document.getElementsByClassName('el-upload')[0].style = 'display:none'
										this.successUpload = true;
									})
								}
								this.form.wholesaleMarketId = o.wholesaleMarketId
								this.form.baseName = o.baseName
								this.form.areaId = o.areaId
								this.form.areaName = o.areaName
								this.form.id = o.id
								this.form.wholesalerName = o.wholesalerName
								this.form.wholesalerId = o.wholesalerId
								this.form.transporterId = o.transporterId
								this.form.supplierId = o.supplierId
								this.form.supplierName = o.supplierName
								
								this.upListId=o.supplierId

								this.form.meatInspectionId = o.meatInspectionId
								this.form.provId = o.provId
								this.form.animalQuarantineId = o.animalQuarantineId
								this.form.tranId = o.tranId
								this.form.vegInspectionId = o.vegInspectionId
								if(o.areaId) {
									this.form.provinceCode = o.areaId.split('-')[0]
									this.getcityList(this.form.provinceCode)
									this.form.cityCode = o.areaId.split('-')[1]
									this.getdistricList(this.form.cityCode)
									this.form.districCode = o.areaId.split('-')[2]
								}
							})
						}

					})
				}

			},
			//获取凭证号
			getDatadic() {
				this.postRequest('datadic/list', {
					dataType: 'VOUCHER_TYPE'
				}).then(resp => {
					this.$dialog.loading.close();
					this.listType = resp.data.aaData
				})

			},
			/**
			 * 获取省列表
			 */
			getprovinceList() {
				this.postRequest('comArea/list', {
					level: 1
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.provinceList = d.data.aaData
					}
				})
			},
			/**
			 * 获取市列表
			 */
			getcityList(provinceCode) {
				this.postRequest('comArea/list', {
					parentAreaCode: provinceCode,
					level: 2
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.cityList = d.data.aaData
					}
				})
			},
			/**
			 * 获取县区列表
			 */
			getdistricList(cityCode) {
				this.postRequest('comArea/list', {
					parentAreaCode: cityCode,
					level: 3
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.districList = d.data.aaData
					}
				})
			},
			changeInput(item, str) {
				if(item[str]) {
					if(item[str].length > 9) {
						item[str] = item[str].slice(0, 9)
					}
					var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
						reg_2 = /^[0-9]{1,}$/;
					if(reg_1.test(item[str]) || reg_2.test(item[str])) {
						if(item[str] > 99999.99) {
							item[str] = '99999.99'
						}
					} else {
						if(item[str]) {
							item[str] = item[str].slice(0, item[str].length - 1)
							if(item[str] > 0) {

							} else {
								item[str] = ''
							}
						}
					}
				}
			},
			blurInput(item, str) {
				if(item[str] > 0) {
					item[str] = parseFloat(item[str]).toFixed(2)
				} else {
					item[str] = '1.00'
				}
			},
		}
	}
</script>
<style lang='scss'>
	#fXzjcXxlr {
		background: white;
		.form {
			font-size: .28rem;
			color: #848484;
			.form_car {
				/*height: 1.2rem;*/
				padding: .15rem .2rem;
				color: #018BE6;
				font-size: 'PingFang-SC-Heavy';
				/*display: flex;*/
				/*align-items: center;*/
				/*justify-content: space-around;*/
				text-align: center;
				font-size: .4rem;
				border-bottom: 1px solid #DDDDDD;
				.gys_name {
					color: #848484;
					font-size: .32rem;
				}
			}
			.form_car_market {
				height: 1.2rem;
				padding: .15rem .2rem;
				color: #018BE6;
				font-size: 'PingFang-SC-Heavy';
				display: flex;
				align-items: center;
				justify-content: space-around;
				text-align: center;
				font-size: .4rem;
				border-bottom: 1px solid #DDDDDD;
			}
			.goods_list {
				.list {
					font-size: .28rem;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #DDDDDD;
					margin-left: .2rem;
					padding: .26rem .2rem .26rem 0;
					color: #2F3927;
					.list_name {
						font-weight: bold;
						width: 3rem;
						/*width: 2.3rem;*/
						color: #2F3927;
						flex-grow: 1;
					}
					.list_right {
						display: flex;
						align-items: center;
						flex-grow: 0;
						width: 3.66rem;
						img {
							margin-left: .2rem;
						}
					}
					.list_input {
						text-align: center;
						width: 2.2rem;
						margin: 0 .15rem;
						outline: none;
						border: 1px solid #DDDDDD;
						padding: 0 .2rem;
					}
					.list_unit {
						width: 1rem;
						color: #848484;
					}
					.list_img {
						display: block;
						width: .26rem;
						height: .3rem;
					}
				}
				.list_add {
					display: flex;
					align-items: center;
					height: .9rem;
					border-bottom: 1px solid #DDDDDD;
					margin-left: .2rem;
					font-size: .28rem;
					color: #018BE6;
					&:before {
						width: .38rem;
						height: .38rem;
						display: inline-block;
						content: '';
						background: url(../../assets/firstImgs/icon-add@2x.png) no-repeat;
						background-size: contain;
						margin-right: .12rem;
					}
				}
			}
			.form_item {
				padding: 0 .31rem 0 0rem;
				margin-left: .2rem;
				line-height: .88rem;
				display: flex;
				border-bottom: 1px solid #DDDDDD;
				.title {
					width: 2.3rem;
					margin-right: .07rem;
					color: #2F3927;
					font-weight: bold;
					flex-grow: 0;
				}
				.item_right {
					width: 4rem;
					display: flex;
					align-items: center;
					position: relative;
					flex-grow: 1;
					input {
						width: 100%;
						border: none;
						font-size: .28rem;
						color: #848484;
					}
					.item_select {
						width: 100%;
						line-height: .88rem;
						border: none;
					}
					.icon {
						width: .11rem;
						height: .2rem;
						display: inline-block;
						background: url(../../assets/imgs/list_icon_right.png) no-repeat;
						background-size: contain;
						/*position: absolute;
						right: 0;
						top: .34rem;*/
						display: flex;
						align-items: center;
					}
				}
				.upload_width_father {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.upload_btn {
						line-height: .4rem;
						background: #018BE6;
						color: white;
						padding: .1rem;
						border-radius: .1rem;
					}
				}
				.pfsc {
					color: #848484;
					opacity: .5;
				}
			}
			.item_img {
				line-height: 1;
				padding: .2rem;
			}
			.time {
				.item_right {
					display: flex;
					justify-content: space-between;
					font-family: 'PingFang-SC-Medium';
				}
			}
			.ces {
				.select_date::-webkit-outer-spin-button,
				.select_date::-webkit-inner-spin-button,
				.select_date::-webkit-clear-button {
					/*-webkit-appearance:none;*/
					/*margin:0;*/
					width: .4rem;
					height: .4rem;
				}
				input:invalid+span:after {
					content: '✖';
					padding-left: 5px;
				}
				input:valid+span:after {
					content: '✓';
					padding-left: 5px;
				}
			}
			.select_date {
				width: 100%;
				height: .4rem;
			}
			.select_time {
				color: #018BE6;
				input {
					/*width: ;*/
				}
			}
			.cd_name {
				border-bottom: none;
				.title {
					font-size: .3rem;
				}
			}
			.select_area {
				height: .88rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #DDDDDD;
				padding: 0 .2rem;
				select {
					width: 30%;
				}
			}
		}
		.el-dialog__body {
			img {
				position: relative;
				z-index: 9999;
			}
		}
		.el-dialog__wrapper {
			z-index: 9999;
		}
		.el-dialog__wrapper {
			top: 1rem;
		}
	}
	
	.v-modal {
		z-index: 2 !important;
		display: none;
	}
</style>