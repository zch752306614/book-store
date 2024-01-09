<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	import Vue from 'vue'
	export default {
		// methods: {
		// 	...mapMutations(["changeStatusHeight", "changeScrollHeight"])
		// },
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.windowWidth = e.windowWidth
					Vue.prototype.windowHeight = e.windowHeight
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif       
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
		},
		onShow: function() {

		},
		onHide: function() {

		},
		// beforeMount: function() {
		// 	uni.getSystemInfo({
		// 		success: (res) => {
		// 			this.changeStatusHeight(res.statusBarHeight);
		// 			this.changeScrollHeight(res.windowHeight);
		// 		}
		// 	})
		// }
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>