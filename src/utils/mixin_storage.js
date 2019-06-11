export default{
	data(){
		return{
			isEdit:null,
		}
	},
	watch:{
		
	},
	computed:{
		
	},
	created(){
		this.judgeEdit();
	},
	mounted(){
		
	},
	methods:{
		judgeEdit(){
			if(sessionStorage.getItem('XZJC_isEdit')){
				this.isEdit=JSON.parse(sessionStorage.getItem('XZJC_isEdit'));
			}else{
				//其实这个作用不大。后期看怎么优化,一直刷新就会有问题，手机
//				this.$dialog.confirm({
//                  title: '提示：',
//                  mes: '请按步骤操作！',
//                  opts: [
//                      {
//                          txt: '确定',
//                          color: true,
//                          callback: () => {
//                             this.$router.push({
//                             		name:'f_jcgl'
//                             })
//                          }
//                      }
//                  ]
//              });
			}
		},
	},
	
}
