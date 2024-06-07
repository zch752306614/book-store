<template>
  <view class="page-read" :style="paddingTop">
    <scroll-view scroll-y="true" class="content-average" :scroll-into-view="scrollIntoView" @scroll="scroll" @click="showCatalogue">
      <view v-for="item in activeContentList" :key="item.id">
        <view class="content-text" :id="childItem.id" v-for="(childItem, childIndex) in item.contentList" :key="childIndex">
          <rich-text :nodes="childItem.content" />
        </view>
      </view>
    </scroll-view>
    <u-popup :show="catalogueShow" mode="left" :closeOnClickOverlay="true" @open="popupOpen" @close="popupClose">
      <scroll-view :scroll-top="titleScrollTop" scroll-y="true" class="book-title-content">
        <view :id="'title'+item.id" v-for="(item, index) in allTitle" :key="index" :class="nowChapterId===item.id?'active-book-title':'book-title'"
          @click="changeChapter(item)">
          {{item.chapterName}}
        </view>
      </scroll-view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data () {
    return {
      adjacentNumber: 10, // 预获取相邻多少章
      paddingTop: '',
      pageObj: {
        page: 1,
        size: 3
      },
      pageListObj: {
        page: 1,
        size: 999999
      },
      allTitle: [],
      catalogueShow: false,
      scrollIntoView: "", // 滚动位置的id
      canClose: false,
      activeContentList: [], // 相邻的章节数组
      titleScrollTop: 0, // 标题滚动
      titleAllHeight: 0, // 全部标题可视高度
      novelInfoId: "", // 当前小说ID
      nowChapter: "", // 当前章节
      nowChapterId: "", // 当前章节ID
      stopScroll: false // 禁止滚动（节流）
    }
  },
  onLoad (e) {
    this.paddingTop = `pwadding-top:${this.StatusBar * 2 + 14}rpx;`;
    this.novelInfoId = e.novelInfoId
    this.getBookChapter(e)
    try {
      const data = uni.getStorageSync(e.novelInfoId.toString());
      if (!data) {
        this.getBookContent(e)
      }
    } catch (e) { }
  },
  watch: {
    nowChapter (val) {
      let data = {
        chapterNumber: val,
        id: this.nowChapterId
      }
      uni.setStorageSync(this.novelInfoId.toString(), JSON.stringify(data));
    }
  },
  methods: {
    showCatalogue () {
      this.catalogueShow = true
    },
    // 获取章节
    getBookContent (item) {
      this.$Api.default.getBook({
        novelInfoId: item.novelInfoId,
        contentFlag: '1',
        ...this.pageObj
      }, false, false).then(res => {
        if (res.data.rows && res.data.rows.length > 0) {
          let contentList = []
          res.data.rows.forEach(item => {
            let newList = []
            let splitList = []
            if (item.chapterContent) {
              splitList = item.chapterContent.split('<p>')
            }
            if (splitList.length > 0) {
              splitList.shift()
              splitList.forEach((e, index) => {
                const obj = {
                  id: `chapter${item.id}${index}`,
                  content: e = '<p>' + e
                }
                newList.push(obj)
              })
            }
            const titleObj = {
              id: `chapter${item.id}`,
              content: `<h1 class="chapterContent chapter${item.id}">${item.chapterName}</h1>`
            }
            newList.unshift(titleObj)
            contentList.push({
              id: item.id,
              chapterNumber: item.chapterNumber,
              contentList: newList
            })
          })
          const newContentList = [...this.activeContentList, ...contentList]
          const map = new Map()
          const result = newContentList.filter(item => !map.has(item.chapterNumber) && map.set(item.chapterNumber, 1))
          this.activeContentList = result.sort((a, b) => {
            return a.chapterNumber - b.chapterNumber
          })
        }
      })
    },
    // 获取前后及当前的章节
    async getAroundChapterByNumber (chapterNumber) {
      const adjacentNumbers = this.getAdjacentNumbers(chapterNumber, this.adjacentNumber)
      let existenceList = []
      let getChapterList = []
      if (this.activeContentList && this.activeContentList.length > 0 && adjacentNumbers.length > 0) {
        this.activeContentList.forEach(item => {
          adjacentNumbers.forEach(numberItem => {
            if (numberItem === item.chapterNumber) {
              existenceList.push(numberItem)
            }
          })
        })
      }
      getChapterList = adjacentNumbers.filter(item => existenceList.indexOf(item) === -1)
      if (getChapterList.length > 0) {
        await this.getAroundChapter(getChapterList)
      }
    },
    // 获取相邻数字
    getAdjacentNumbers (chapterNumber, n) {
      let adjacentNumbers = []
      // 获取前n个数字
      for (var i = chapterNumber - n; i <= chapterNumber; i++) {
        if (i >= 0) {
          adjacentNumbers.push(i)
        }
      }
      // 获取后n个数字
      for (var j = chapterNumber + 1; j <= chapterNumber + n; j++) {
        adjacentNumbers.push(j)
      }
      return adjacentNumbers
    },
    // 获取前后的章节
    async getAroundChapter (list) {
      await this.$Api.default.getBookByChapterNumber({
        novelInfoId: this.novelInfoId,
        contentFlag: '1',
        chapterNumberList: list.join(',')
      }, false, true).then(res => {
        let contentList = []
        if (res.data.length > 0) {
          res.data.forEach(item => {
            let newList = []
            let splitList = []
            if (item.chapterContent) {
              splitList = item.chapterContent.split('<p>')
            }
            if (splitList.length > 0) {
              splitList.shift()
              splitList.forEach((e, index) => {
                let obj = {
                  id: `chapter${item.id}${index}`,
                  content: e = '<p>' + e
                }
                newList.push(obj)
              })
            }
            const titleObj = {
              id: `chapter${item.id}`,
              content: `<h1 class="chapterContent chapter${item.id}">${item.chapterName}</h1>`
            }
            newList.unshift(titleObj)
            contentList.push({
              id: item.id,
              chapterNumber: item.chapterNumber,
              contentList: newList
            })
          })
          const newContentList = [...this.activeContentList, ...contentList]
          const map = new Map()
          const result = newContentList.filter(item => !map.has(item.chapterNumber) && map.set(item.chapterNumber, 1))
          this.activeContentList = result.sort((a, b) => {
            return a.chapterNumber - b.chapterNumber
          })
        }
      })
    },
    // 获取章节
    getBookChapter (item) {
      this.$Api.default.getBook({
        novelInfoId: item.novelInfoId,
        contentFlag: '0',
        ...this.pageListObj
      }, false, false).then(async res => {
        this.allTitle = res.data.rows || []
        if (this.allTitle.length > 0) {
          try {
            const data = uni.getStorageSync(item.novelInfoId.toString());
            if (data) {
              await this.changeChapter(JSON.parse(data), true)
            }
          } catch (e) { }
          if (!this.nowChapter) {
            this.nowChapterId = this.allTitle[0].id
            this.nowChapter = this.allTitle[0].chapterNumber
          }
        }
      })
    },
    // 打开目录
    popupOpen () {
      this.canClose = false
      this.titleSetPosition()
      const time = setTimeout(() => {
        clearTimeout(time)
        this.canClose = true
      }, 600)
    },
    // 设置目录位置
    titleSetPosition () {
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
    // 关闭目录
    popupClose () {
      if (this.canClose) {
        this.canClose = false
        this.catalogueShow = false
      }
    },
    // 切换章节
    async changeChapter (item, changeTitleList) {
      this.nowChapterId = item.id
      this.nowChapter = item.chapterNumber
      await this.getAroundChapterByNumber(item.chapterNumber)
      this.stopScroll = true
      this.$nextTick(() => {
        this.scrollIntoView = `chapter${item.id}`
        if (!changeTitleList) {
          this.titleSetPosition()
          this.canClose = false
          this.catalogueShow = false
        }
        this.stopScroll = false
      })
    },
    // 滚动加载
    scroll () {
      if (this.stopScroll) {
        return
      }
      const that = this;
      const query = uni.createSelectorQuery().in(that);
      query.selectAll('.chapterContent').boundingClientRect(res => {
        if (res && res.length > 0) {
          let smallDistance = null
          let nowIndex = 0
          res.forEach((item, index) => {
            if (item.top < 60) {
              if (smallDistance === null) {
                smallDistance = item.top
              } else {
                if (smallDistance < item.top && item.top <= 0) {
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
      padding: 100rpx 0;
    }

    p {
      text-indent: 68rpx;
      font-size: 34rpx;
      font-weight: 500;
      color: #333;
      line-height: 68rpx;
      letter-spacing: 6rpx;
    }

    .content-text + .content-text {
      margin-bottom: 30rpx;
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