import configs from '../configs'
import mixin_shop from './mixin_shop'
import mixin_category from './mixin_category'

export default {
	//mixins: [mixin_shop,mixin_category],
	data() {
		return {
			imgURL: configs.imgURL,
			userInfo: JSON.parse(localStorage.getItem('quickUserInfo')),
			// 物流方式
			logisticsType: [{
				type: 0,
				name: '自提',
				selected: false
			}, {
				type: 1,
				name: '物流配送',
				selected: true
			}],
			// 支付方式
			payType: [{
				type: 0,
				name: '现金支付',
				selected: true
			}, {
				type: 1,
				name: 'POS刷卡',
				selected: false
			}, {
				type: 2,
				name: '微信支付',
				selected: false
			}, {
				type: 3,
				name: '支付宝支付',
				selected: false
			}],
			// 配送方式
			distributionType: [{
				distributionType: 0,
				name: '次日配送',
				selected: true
			}, {
				distributionType: 1,
				name: '当日配送',
				selected: false
			}],
		}
	},
	mounted() {},
	methods: {
		/**
		 * 数组去重
		 * @param arr 
		 */
		uniqueArr(arr) {
			var res = [];
			var obj = {};
			for(var v of arr) {
				if(!obj[v]) {
					res.push(v);
					obj[v] = 1;
				}
			}
			return res
		},
		/**
		 * 获取不同的日期
		 * @param AddDayCount 目标天数与当天的差
		 * @returns {string}
		 * @constructor
		 */
		GetDateStr(AddDayCount) {
			var dd = new Date();
			dd.setDate(dd.getDate() + AddDayCount);
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1;
			var d = dd.getDate();
			var w = dd.getDay();
			const wstr = '日一二三四五六'
			if(m < 10) {
				m = `0${m}`
			}
			if(d < 10) {
				d = `0${d}`
			}
			return {
				date: `${y}-${m}-${d}`,
				week: `星期${wstr.charAt(w)}`
			};
		}
	},
}