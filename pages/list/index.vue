<template>
  <view class="page-list" :style="paddingTop">
    <view class="index-read">
      <view class="read-top">
        <view class="top-left">
          <text class="top-title">精选好书</text>
        </view>
      </view>
      <u-search v-model="searchName" :showAction="true" bgColor="#fff" actionText="搜索" placeholder="书名/作者名" :animation="true" @search="hanlerSearch"
        @custom="hanlerSearch" />
      <view v-if="historyList.length > 0" class="history-content">
        <view class="history-content-top">
          <view class="history-content-top-left">
            <u-icon name="clock" color="#666" size="28rpx" />
            <text class="top-title">历史搜索</text>
          </view>
          <u-icon name="trash" color="#666" size="34rpx" @click="clearHistory" />
        </view>
        <view class="history-main">
          <view class="history-text" v-for="(item,index) in historyList" :key="index" @click="getHistoryToSearch(item)">{{ item }}</view>
        </view>
      </view>
      <scroll-view scroll-y class="book-list-content" refresher-background="#eee" @scrolltolower="getBookList">
        <view v-for="(item, index) in list" :key="index" class="list-one" @click="toBookread(item)">
          <view class="read-one-main">
            <view class="read-one-left">
              <image class="one-book" :src="item.novelCover?item.novelCover:'../../static/images/frxxz-cover.jpg'" />
              <view class="book-light" />
            </view>
            <view class="read-one-right">
              <view class="book-name-right">{{item.novelName}}</view>
              <view class="read-one-introduce">{{item.novelIntroduction}}</view>
              <view class="book-author-content">
                <text class="book-author">{{item.novelAuthor}}</text>
                <text class="book-author">{{dayjs(item.updateTime).format("YYYY-MM-DD HH:mm:ss")}}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
export default {
  data () {
    return {
      dayjs: dayjs,
      paddingTop: '',
      historyList: [],
      pageObj: {
        page: 1,
        size: 10
      },
      searchName: "",
      list: []
    }
  },
  onLoad (e) {
    this.paddingTop = `padding-top:${this.StatusBar * 2 + 14}rpx;`;
    if(e.recode){
      this.getBookList('new','recode')
    }else{
      this.getBookList('new')
    }
    try {
      const historyList = uni.getStorageSync("historyList")
      if (historyList) {
        this.historyList = JSON.parse(historyList)
      }
    } catch (e) { }
  },
  methods: {
    clearHistory() {
      this.historyList = []
      uni.setStorageSync("historyList", JSON.stringify([]))
    },
    getHistoryToSearch(searchName) {
      this.searchName = searchName
      this.pageObj.page = 1
      this.getBookList('new')
    },
    hanlerSearch () {
      this.pageObj.page = 1
      this.getBookList('new')
      const historyList = [...this.historyList]
      historyList.unshift(this.searchName)
      if (historyList && historyList.length === 6) {
        historyList.pop()
      }
      uni.setStorageSync("historyList", JSON.stringify(historyList))
      this.historyList = [...historyList]
    },
    getBookList (isNew, isRecode) {
      if (isNew !== 'new') {
        this.pageObj.page = this.pageObj.page + 1
      }
      let idList = []
      if(isRecode) {
        try {
          idList = uni.getStorageSync("idList")
        if (idList) {
          idList = JSON.parse(idList)
        }
      } catch (e) { }
      }
      this.$Api.default.getBookList({ searchName: this.searchName, ...this.pageObj, idList }, false, false).then(res => {
        if (isNew === 'new') {
          this.list = res.data.rows || []
        } else {
          if (res.data.rows.length <= 0) {
            this.pageObj.page = this.pageObj.page - 1
          } else {
            this.list = [...this.list, ...res.data.rows]
          }
        }
      })
    },
    toBookread (item) {
      uni.navigateTo({
        url: `/pages/read/index?novelInfoId=${item.id}&title=${item.novelName}`,
      });
    }
  }
}
</script>

<style lang="scss">
page {
  width: 100%;
  height: 100%;
}

.page-list {
  width: 100%;
  height: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #eee;

  .bookshelf-top,
  .read-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .top-left {
      display: flex;
      align-items: center;

      .top-title {
        color: #333;
        font-weight: bold;
        font-size: 36rpx;
        margin-right: 10rpx;
        margin-bottom: 20rpx;
      }
    }

    .top-more {
      color: #666;
      font-weight: 500;
      font-size: 28rpx;
    }
  }

  .book-light {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.8) 13%,
      rgba(255, 255, 255, 0) 25%
    );
  }

  .index-bookshelf {
    width: 100%;
    padding: 20rpx 50rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .bookshelf-list {
      width: calc(100% + 30rpx);
      display: flex;
      align-items: flex-start;
      margin-top: 30rpx;
      overflow-x: auto;

      .list-one {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-right: 30rpx;

        .list-one-top {
          width: 170rpx;
          height: 240rpx;
          position: relative;

          .one-book {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
            border: #bebebe 1rpx solid;
          }
        }

        .book-name {
          color: #666;
          font-weight: 500;
          font-size: 28rpx;
          margin-top: 20rpx;
        }
      }
    }
  }

  .index-read {
    width: 100%;
    padding: 30rpx 20rpx;
    box-sizing: border-box;

    .read-top {
      box-sizing: border-box;
    }

    .book-list-content {
      width: 100%;
      height: calc(100vh - 240rpx);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border-radius: 30rpx;
      margin-top: 30rpx;

      .list-one {
        width: 100%;
        padding: 10rpx 20rpx;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 30rpx;
        display: flex;
        position: relative;
        margin-bottom: 30rpx;

        .read-one-main {
          width: 100%;
          display: flex;
          align-items: center;
          z-index: 2;
          bottom: 0rpx;
          background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 1) 20%
          );
          padding: 20rpx 0;

          .read-one-left {
            width: 130rpx;
            height: 182rpx;
            position: relative;

            .one-book {
              width: 100%;
              height: 100%;
              border-radius: 10rpx;
              border: #bebebe 1rpx solid;
            }
          }

          .read-one-right {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            margin-left: 20rpx;
            justify-content: space-between;

            .book-name-right {
              color: #333;
              font-weight: 600;
              font-size: 30rpx;
            }

            .read-one-introduce {
              width: 100%;
              color: #888;
              font-weight: 500;
              font-size: 24rpx;
              line-height: 48rpx;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .book-author-content {
              width: 100%;
              display: flex;
              align-content: center;
              justify-content: space-between;
            }

            .book-author {
              color: #aaa;
              font-weight: 400;
              font-size: 24rpx;
            }
          }
        }
      }
    }
  }

  .history-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 12rpx 16rpx;
    border-radius: 18rpx;
    box-sizing: border-box;
    margin-top: 20rpx;

    .history-content-top {
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: space-between;

      .history-content-top-left {
        width: 100%;
        display: flex;
        align-content: center;

        .top-title {
          color: #333;
          font-size: 28rpx;
          margin-left: 20rpx;
        }
      }
    }
    .history-main {
      width: 100%;
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      margin-top: 12rpx;

      .history-text {
        color: #888;
        font-size: 24rpx;
        padding: 6rpx 12rpx;
        background-color: #f0f0f0;
        margin-left: 10rpx;
        margin-top: 10rpx;
        border-radius: 20rpx;
      }
    }
  }
}
</style>