<template>
	<view class="page-read" :style="paddingTop">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="content-average" @scroll="scroll"
			@click="showCatalogue">
			<rich-text v-for="(item, index) in activeContentList" :key="index" :nodes="item.content"></rich-text>
		</scroll-view>
		<u-popup :show="catalogueShow" mode="left" :closeOnClickOverlay="true" @open="popupOpen"
			@close="catalogueShow = false">
			<scroll-view :scroll-top="titleScrollTop" scroll-y="true" class="book-title-content">
				<view :id="'title'+item.id" v-for="(item, index) in allTitle" :key="index"
					:class="nowChapterId===item.id?'active-book-title':'book-title'" @click="changeChapter(item)">
					{{item.chapterName}}
				</view>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				paddingTop: '',
				pageObj: {
					page: 1,
					size: 3
				},
				pageListObj: {
					page: 1,
					size: 99999
				},
				allTitle: [],
				catalogueShow: false,
				scrollTop: 0,
				activeContentList: [], // 全部的章节数组
				contentObj: {}, // 全部的章节
				titleScrollTop: 0, // 标题滚动
				titleAllHeight: 0, // 全部标题可视高度
				novelInfoId: "", // 当前小说ID
				nowChapter: "", // 当前章节
				nowChapterId: "", // 当前章节ID
				stopScroll: false // 禁止滚动（节流）
			}
		},
		onLoad(e) {
			this.paddingTop = `pwadding-top:${this.StatusBar * 2 + 14}rpx;`;
			this.novelInfoId = e.novelInfoId
			this.getBookChapter(e)
			this.getBookContent(e)
		},
		watch: {
			nowChapter(val) {
				let data = {
					chapterNumber: val,
					id: this.nowChapterId
				}
				uni.setStorageSync(this.novelInfoId.toString(), JSON.stringify(data));
			}
		},
		methods: {
			showCatalogue() {
				this.catalogueShow = true
			},
			// 获取章节
			getBookContent(item) {
				this.$Api.default.getBook({
					novelInfoId: item.novelInfoId,
					contentFlag: '1',
					...this.pageObj
				}, false, false).then(res => {
					if (res.data.rows && res.data.rows.length > 0) {
						let contentList = []
						res.data.rows.forEach((item, index) => {
							const str =
								`<h1 class='chapterContent chapter${item.id}'>${item.chapterName}</h1>` +
								item.chapterContent
							contentList.push({
								id: item.id,
								chapterNumber: item.chapterNumber,
								content: str
							})
						})
						const newList = [...this.activeContentList, ...contentList]
						const map = new Map()
						const result = newList.filter(item => !map.has(item.chapterNumber) && map.set(item
							.chapterNumber, 1))
						this.activeContentList = result.sort((a, b) => {
							return a.chapterNumber - b.chapterNumber
						})
					}
				})
			},
			// 获取前后及当前的章节
			async getAroundChapterByNumber(chapterNumber) {
				let getChapterList = []
				let frontId = ""
				let nowId = ""
				let afterId = ""
				let getNow = false
				for (let key in this.contentObj) {
					if (getNow && !afterId) {
						afterId = this.contentObj[key]
					}
					if (key.toString() === chapterNumber.toString()) {
						nowId = this.contentObj[key]
						getNow = true
					}
					if (!getNow) {
						frontId = this.contentObj[key]
					}
				}
				console.log(afterId, nowId, frontId);
				let isFront = false
				let isNow = false
				let isAfter = false
				if (this.activeContentList && this.activeContentList.length > 0) {
					this.activeContentList.forEach(item => {
						if (frontId === item.id) {
							isFront = true
						}
						if (nowId === item.id) {
							isNow = true
						}
						if (afterId === item.id) {
							isAfter = true
						}
					})
				}
				if (!isFront && frontId) {
					getChapterList.push(frontId)
				}
				if (!isNow && nowId) {
					getChapterList.push(nowId)
				}
				if (!isAfter && afterId) {
					getChapterList.push(afterId)
				}
				console.log(getChapterList);
				if (getChapterList.length > 0) {
					await this.getAroundChapter(getChapterList)
				}
			},
			// 获取前后的章节
			async getAroundChapter(list) {
				await this.$Api.default.getBookById({
					idList: list.join(',')
				}, false, true).then(res => {
					let contentList = []
					if (res.data.length > 0) {
						res.data.forEach((item, index) => {
							const str =
								`<h1 class='chapterContent chapter${item.id}'>${item.chapterName}</h1>` +
								item.chapterContent
							contentList.push({
								id: item.id,
								chapterNumber: item.chapterNumber,
								content: str
							})
						})
						const newList = [...this.activeContentList, ...contentList]
						const map = new Map()
						const result = newList.filter(item => !map.has(item.chapterNumber) && map.set(item
							.chapterNumber, 1))
						this.activeContentList = result.sort((a, b) => {
							return a.chapterNumber - b.chapterNumber
						})
					}
				})
			},
			// 获取章节
			getBookChapter(item) {
				this.$Api.default.getBook({
					novelInfoId: item.novelInfoId,
					contentFlag: '0',
					...this.pageListObj
				}, false, false).then(async res => {
					this.allTitle = res.data.rows || []
					if (this.allTitle.length > 0) {
						this.allTitle.forEach(item => {
							this.contentObj[item.chapterNumber] = item.id
						})
						try {
							const data = uni.getStorageSync(item.novelInfoId.toString());
							if (data) {
								await this.changeChapter(JSON.parse(data), true)
							}
						} catch (e) {}
						if (!this.nowChapter) {
							this.nowChapterId = this.allTitle[0].id
							this.nowChapter = this.allTitle[0].chapterNumber
						}
					}
				})
			},
			popupOpen() {
				const that = this;
				if (!that.titleAllHeight) {
					const queryAllTitle = uni.createSelectorQuery().in(that);
					queryAllTitle.select(".book-title-content").boundingClientRect(res => {
						that.titleAllHeight = res.height
					}).exec();
				}
				const queryTitle = uni.createSelectorQuery().in(that);
				queryTitle.select(`#title${that.nowChapterId}`).boundingClientRect(res => {
					that.titleScrollTop = that.titleScrollTop - (that.titleAllHeight / 2 - res.top)
				}).exec();
			},
			// 切换章节
			async changeChapter(item, changeTitleList) {
				this.nowChapterId = item.id
				this.nowChapter = item.chapterNumber
				await this.getAroundChapterByNumber(item.chapterNumber)
				this.$nextTick(() => {
					this.stopScroll = true
					const that = this;
					const query = uni.createSelectorQuery().in(that);
					query.select(`.chapter${item.id}`).boundingClientRect(res => {
						let scrollTop = that.scrollTop + res.top - 55
						if (scrollTop < 0) {
							that.scrollTop = 0
						} else {
							that.scrollTop = scrollTop
						}
						const time = setTimeout(() => {
							clearTimeout(time)
							this.stopScroll = false
						}, 100)
					}).exec();
					if (!changeTitleList) {
						if (!that.titleAllHeight) {
							const queryAllTitle = uni.createSelectorQuery().in(that);
							queryAllTitle.select(".book-title-content").boundingClientRect(res => {
								that.titleAllHeight = res.height
							}).exec();
						}
						const queryTitle = uni.createSelectorQuery().in(that);
						queryTitle.select(`#title${item.id}`).boundingClientRect(res => {
							that.titleScrollTop = that.titleScrollTop - (that.titleAllHeight / 2 - res
								.top)
							that.catalogueShow = false
						}).exec();
					}
				})
			},
			// 滚动加载
			scroll(e) {
				if (this.stopScroll) {
					return
				}
				const that = this;
				const query = uni.createSelectorQuery().in(that);
				query.selectAll('.chapterContent').boundingClientRect(res => {
					if (res && res.length > 0) {
						let smallDistance = 0
						let nowIndex = 0
						res.forEach((item, index) => {
							if (item.top < 60) {
								if (!smallDistance) {
									smallDistance = item.top
								} else {
									if (smallDistance < item.top) {
										smallDistance = item.top
										nowIndex = index
									}
								}
							}
						})
						if (that.activeContentList[nowIndex].id !== that.nowChapterId) {
							that.nowChapterId = that.activeContentList[nowIndex].id
							that.nowChapter = that.activeContentList[nowIndex].chapterNumber
							that.getAroundChapterByNumber(that.nowChapter)
						}
					}
				}).exec();
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
	}

	.page-read {
		width: 100%;
		height: 100%;
		background-image: url("../../static/images/read-bg.jpg");
		background-size: 100% 100%;
		box-sizing: border-box;
		overflow: auto;

		.content-average {
			width: 100%;
			height: 100%;
			padding: 0 20rpx;
			box-sizing: border-box;

			h1 {
				font-size: 50rpx;
				font-weight: bold;
				color: #333;
				text-align: center;
				margin: 100rpx 0;
			}

			p {
				text-indent: 68rpx;
				font-size: 34rpx;
				font-weight: 500;
				color: #333;
				line-height: 68rpx;
				letter-spacing: 6rpx;
			}

			p+p {
				margin-top: 30rpx;
			}
		}

		.book-title-content {
			width: 66vw;
			height: 100vh;
			display: flex;
			flex-direction: column;
			padding: 28rpx;
			background-color: #555555;

			.book-title {
				width: 100%;
				font-size: 32rpx;
				padding-bottom: 50rpx;
				color: #fff;
			}

			.active-book-title {
				width: 100%;
				font-size: 32rpx;
				padding-bottom: 50rpx;
				color: #ffaa00;
			}
		}
	}
</style>