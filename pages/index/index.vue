<template>
    <view class="page-index" :style="paddingTop">
        <view class="index-top">
            <!-- <text class="top-setting">设置</text> -->
            <view class="top-main">
                <view class="main-left">
                    <text class="main-hello">您好！愿轻松享受每一片段~</text>
                    <text class="main-username">张星星</text>
                </view>
                <image class="main-head" src="../../static/images/head-img.jpg"></image>
            </view>
        </view>
        <view class="index-bookshelf">
            <view class="bookshelf-top">
                <view class="top-left">
                    <text class="top-title">书架</text>
                    <u-badge numberType="overflow" shape="horn" bgColor="#000" max="99" :value="list.length"></u-badge>
                </view>
                <text class="top-more" @click="toMore">查看更多</text>
            </view>
            <view class="bookshelf-list">
                <view v-for="(item, index) in list" :key="index" class="list-one" @click="toBookread(item)">
                    <view class="list-one-top">
                        <image class="one-book"
                            :src="item.novelCover?item.novelCover:'../../static/images/frxxz-cover.jpg'"></image>
                        <view class="book-light"></view>
                    </view>
                    <text class="book-name">{{item.novelName}}</text>
                </view>
            </view>
        </view>
        <view class="index-read">
            <view class="index-read-content">
                <view class="read-top">
                    <view class="top-left">
                        <text class="top-title">已阅</text>
                        <u-badge numberType="overflow" shape="horn" bgColor="#000" max="99" :value="list.length"></u-badge>
                    </view>
                    <text class="top-more" @click="toMore">查看更多</text>
                </view>
                <view class="read-list">
                    <view v-for="(item, index) in list" :key="index" class="list-one" @click="toBookread(item)">
                        <view class="read-one-introduce">{{item.novelIntroduction}}</view>
                        <view class="read-one-main">
                            <view class="read-one-left">
                                <image class="one-book"
                                    :src="item.novelCover?item.novelCover:'../../static/images/frxxz-cover.jpg'">
                                </image>
                                <view class="book-light"></view>
                            </view>
                            <view class="read-one-right">
                                <view>
                                    <view class="right-line"></view>
                                    <view class="book-name-right">{{item.novelName}}</view>
                                </view>
                                <text class="book-author">{{item.novelAuthor}}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                paddingTop: '',
                pageObj: {
                    page: 1,
                    size: 6
                },
                list: []
            }
        },
        onLoad () {
            this.paddingTop = `padding-top:${this.StatusBar * 2 + 14}rpx;`;
            this.getBookList()
        },
        methods: {
            getBookList () {
                this.$Api.default.getBookList(this.pageObj, false, false).then(res => {
                    this.list = res.data.rows || []
                })
            },
            toMore() {
                uni.navigateTo({
                    url: '/pages/list/index',
                });
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

    .page-index {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background-image: linear-gradient(to bottom, #ddd, #fff 38%);

        .index-top {
            width: 100%;
            display: flex;
            flex-direction: column;
            padding: 30rpx;
            box-sizing: border-box;

            .top-setting {
                width: 100%;
                color: #666;
                font-weight: 500;
                font-size: 38rpx;
                text-align: right;
                margin-bottom: 40rpx;
            }

            .top-main {
                display: flex;
                align-items: center;

                .main-left {
                    flex: 1;
                    display: flex;
                    flex-direction: column;

                    .main-hello {
                        color: #888;
                        font-weight: 400;
                        font-size: 32rpx;
                        margin-bottom: 24rpx;
                    }

                    .main-username {
                        color: #333;
                        font-weight: bold;
                        font-size: 42rpx;
                    }
                }

                .main-head {
                    width: 110rpx;
                    height: 110rpx;
                    border-radius: 50%;
                    border: #999 1px solid;
                }
            }
        }

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
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8) 13%, rgba(255, 255, 255, 0) 25%);
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
                padding-top: 30rpx;
                box-sizing: border-box;
            }

            .index-read-content {
                width: 100%;
                padding: 0rpx 30rpx;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                background-color: #f4f4f4;
                border-radius: 30rpx;

                .read-list {
                    width: calc(100% + 30rpx);
                    padding: 30rpx 0rpx;
                    box-sizing: border-box;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;

                    .list-one {
                        width: 45%;
                        height: 400rpx;
                        padding: 20rpx;
                        box-sizing: border-box;
                        background-color: #fff;
                        border-radius: 30rpx;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        overflow: hidden;
                        position: relative;
                        margin-right: 30rpx;
                        margin-top: 30rpx;

                        .read-one-introduce {
                            width: 100%;
                            height: 200rpx;
                            color: #888;
                            font-weight: 500;
                            font-size: 24rpx;
                            line-height: 50rpx;
                        }

                        .read-one-main {
                            width: calc(100% - 30rpx);
                            display: flex;
                            align-items: center;
                            position: absolute;
                            z-index: 2;
                            bottom: 0rpx;
                            background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 1) 20%);
                            padding: 20rpx 0;

                            .read-one-left {
                                width: 100rpx;
                                height: 140rpx;
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
                                height: 140rpx;
                                display: flex;
                                flex-direction: column;
                                margin-left: 20rpx;
                                justify-content: space-between;

                                .right-line {
                                    width: 100%;
                                    height: 1rpx;
                                    background-color: #cecece;
                                    margin-top: 8rpx;
                                }

                                .book-name-right {
                                    color: #333;
                                    font-weight: 600;
                                    font-size: 30rpx;
                                    margin-top: 14rpx;
                                }

                                .book-author {
                                    color: #888;
                                    font-weight: 400;
                                    font-size: 28rpx;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>