import Vue from 'vue'
// #ifdef H5
let baseUrl = "/dev-api"
// #endif
// #ifndef H5
let baseUrl = "http://121.4.69.234:8001"
// #endif
let timeout = 0
let requestTimes = 0

// POST请求封装
function postRequest(url, data, nohide, noloading) {
	if (requestTimes === 0 && !noloading) {
		uni.showLoading({
			title: '加载中...', //提示的内容,
			mask: true, //显示透明蒙层，防止触摸穿透,
		});
		timeout = setTimeout(() => {
			uni.hideLoading();
			uni.stopPullDownRefresh();
			uni.showModal({
				title: '提示',
				content: '请求超时',
				showCancel: false, //是否显示取消按钮,
				cancelText: '取消',
				cancelColor: "#000000",
				confirmText: '确定',
				confirmColor: "#45B7FF",
				success: res => {
					if (res.confirm) {}
				},
			})
			clearTimeout(timeout)
			requestTimes = 0
		}, 30000);
	}
	requestTimes++
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		uni.uploadFile({
			url: baseUrl + url,
			filePath: data,
			name: 'imageFile',
			formData: {},
			header: {
				'auth-type': '2',
				accessToken: uni.getStorageSync("token"),
				nameSpace: uni.getStorageSync("nameSpace")
			},
			success: function(res) {
				if (res && res.data) {
					res.data = JSON.parse(res.data)
				}
				requestTimes--;
				if (requestTimes === 0 && !nohide) {
					clearTimeout(timeout)
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
				let header = res.header;


				//设置服务器返回token
				if (header && (header["setToken"] || header["settoken"])) {
					uni.setStorageSync("token", (header["setToken"] || header["settoken"]));
					console.log(uni.getStorageSync("token"))
				}
				if (res.data.code == 0) {
					resolve(res.data);
				} else {
					if (res.data.code == 4003) {
						if (!uni.getStorageSync("canTo")) {
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}, 400)
							uni.setStorageSync("canTo", true)
						}
					} else {
						if (res.data.errInfo) {
							uni.showToast({
								title: res.data.errInfo,
								icon: 'none',
								mask: true,
								duration: 2000
							})
						}
					}
					resolve(res.data);
				}
			},
			fail: function(e) {
				requestTimes--;
				uni.hideLoading();
				uni.stopPullDownRefresh();
				reject("网络出错");
			}
		});
	});
	return promise;
}

// POSTM请求封装
function postMRequest(url, data, nohide, noloading) {
	if (requestTimes === 0 && !noloading) {
		uni.showLoading({
			title: '加载中...', //提示的内容,
			mask: true, //显示透明蒙层，防止触摸穿透,
		});
		timeout = setTimeout(() => {
			uni.hideLoading();
			uni.stopPullDownRefresh();
			uni.showModal({
				title: '提示',
				content: '请求超时',
				showCancel: false, //是否显示取消按钮,
				cancelText: '取消',
				cancelColor: "#000000",
				confirmText: '确定',
				confirmColor: "#45B7FF",
				success: res => {
					if (res.confirm) {}
				},
			})
			clearTimeout(timeout)
			requestTimes = 0
		}, 30000);
	}
	requestTimes++
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		uni.request({
			url: baseUrl + url,
			data: postData,
			method: "POST",
			header: {
				'auth-type': '2',
				"content-type": "application/json",
				accessToken: uni.getStorageSync("token"),
				nameSpace: uni.getStorageSync("nameSpace")
			},
			success: function(res) {
				//返回什么就相应的做调整
				requestTimes--;
				if (requestTimes === 0 && !nohide) {
					clearTimeout(timeout)
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
				let header = res.header;

				//设置服务器返回token
				if (header && (header["setToken"] || header["settoken"])) {
					uni.setStorageSync("token", (header["setToken"] || header["settoken"]));
					console.log(uni.getStorageSync("token"))
				}
				if (res.data.code == 0) {
					resolve(res.data);
				} else {
					if (res.data.code == 4003) {
						if (!uni.getStorageSync("canTo")) {
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}, 400)
							uni.setStorageSync("canTo", true)
						}
					} else {
						if (res.data.errInfo) {
							uni.showToast({
								title: res.data.errInfo,
								icon: 'none',
								mask: true,
								duration: 2000
							})
						}
					}
					reject(res.data);
				}
			},
			fail: function(e) {
				requestTimes--;
				clearTimeout(timeout)
				uni.hideLoading();
				uni.stopPullDownRefresh();
				reject("网络出错");
			}
		});
	});
	return promise;
}

// PUT请求封装
function putRequest(url, data, nohide, noloading) {
	if (requestTimes === 0 && !noloading) {
		uni.showLoading({
			title: '加载中...', //提示的内容,
			mask: true, //显示透明蒙层，防止触摸穿透,
		});
		timeout = setTimeout(() => {
			uni.hideLoading();
			uni.stopPullDownRefresh();
			uni.showModal({
				title: '提示',
				content: '请求超时',
				showCancel: false, //是否显示取消按钮,
				cancelText: '取消',
				cancelColor: "#000000",
				confirmText: '确定',
				confirmColor: "#45B7FF",
				success: res => {
					if (res.confirm) {}
				},
			})
			clearTimeout(timeout)
			requestTimes = 0
		}, 30000);
	}
	requestTimes++
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		uni.request({
			url: baseUrl + url,
			data: postData,
			method: "PUT",
			header: {
				'auth-type': '2',
				"content-type": "application/json",
				accessToken: uni.getStorageSync("token"),
				nameSpace: uni.getStorageSync("nameSpace")
			},
			success: function(res) {
				//返回什么就相应的做调整
				requestTimes--;
				if (requestTimes === 0 && !nohide) {
					clearTimeout(timeout)
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
				let header = res.header;

				//设置服务器返回token
				if (header && (header["setToken"] || header["settoken"])) {
					uni.setStorageSync("token", (header["setToken"] || header["settoken"]));
					console.log(uni.getStorageSync("token"))
				}
				if (res.data.code == 0) {
					resolve(res.data);
				} else {
					if (res.data.code == 4003) {
						if (!uni.getStorageSync("canTo")) {
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}, 400)
							uni.setStorageSync("canTo", true)
						}
					} else {
						if (res.data.errInfo) {
							uni.showToast({
								title: res.data.errInfo,
								icon: 'none',
								mask: true,
								duration: 2000
							})
						}
					}
					reject(res.data);
				}
			},
			fail: function(e) {
				requestTimes--;
				clearTimeout(timeout)
				uni.hideLoading();
				uni.stopPullDownRefresh();
				reject("网络出错");
			}
		});
	});
	return promise;
}

// GET请求封装
function getRequest(url, data, nohide, noloading) {
	if (requestTimes === 0 && !noloading) {
		uni.showLoading({
			title: '加载中...', //提示的内容,
			mask: true, //显示透明蒙层，防止触摸穿透,
		});
		timeout = setTimeout(() => {
			uni.hideLoading();
			uni.stopPullDownRefresh();
			uni.showModal({
				title: '提示',
				content: '请求超时',
				showCancel: false, //是否显示取消按钮,
				cancelText: '取消',
				cancelColor: "#000000",
				confirmText: '确定',
				confirmColor: "#45B7FF",
				success: res => {
					if (res.confirm) {}
				},
			})
			clearTimeout(timeout)
			requestTimes = 0
		}, 300000);
	}
	requestTimes++
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		uni.request({
			url: baseUrl + url,
			data: postData,
			method: "GET",
			dataType: "json",
			header: {
				'auth-type': '2',
				"content-type": "application/json",
				accessToken: uni.getStorageSync("token"),
				nameSpace: uni.getStorageSync("nameSpace")
			},
			responseType: 'blob',
			success: function(res) {
				requestTimes--;
				if (requestTimes === 0 && !nohide) {
					clearTimeout(timeout)
					uni.hideLoading();
					uni.stopPullDownRefresh();
				}
				let header = res.header;
				//设置服务器返回token
				if (header && (header["setToken"] || header["settoken"])) {
					uni.setStorageSync("token", (header["setToken"] || header["settoken"]));
				}
				if (res.data.code == 0) {
					resolve(res.data);
				} else {
					if (res.data.code == 4003) {
						if (!uni.getStorageSync("canTo")) {
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}, 400)
							uni.setStorageSync("canTo", true)
						}
					} else {
						if (res.data.errInfo) {
							uni.showToast({
								title: res.data.errInfo,
								icon: 'none',
								mask: true,
								duration: 2000
							})
						}
					}
					reject(res.data);
				}
			},
			fail: function(e) {
				requestTimes--;
				clearTimeout(timeout)
				uni.hideLoading();
				uni.stopPullDownRefresh();
				reject("网络出错");
			}
		});
	});
	return promise;
}

module.exports = {
	POST: postRequest,
	POSTM: postMRequest,
	PUT: putRequest,
	GET: getRequest
};
