import * as API from './base.js'
export default {
	// 获取小说列表
	getBookList (params, nohide, noloading) {
		return API.GET(`/novel/queryNovelist`, params, nohide, noloading)
	},
	// 获取小说章节
	getBook (params, nohide, noloading) {
		return API.GET(`/novel/queryChapterList`, params, nohide, noloading)
	},
	// 根据id获取小说章节
	getBookById (params, nohide, noloading) {
		return API.GET(`/novel/queryChapterListById`, params, nohide, noloading)
	}
}
