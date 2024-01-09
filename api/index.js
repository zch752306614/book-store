import * as API from './base.js'
export default {
	// 获取小说列表
	getBookList (params, nohide, noloading) {
		return API.GET(`/api/novelManage/queryNovelist`, params, nohide, noloading)
	},
	// 获取小说章节
	getBook (params, nohide, noloading) {
		return API.GET(`/api/novelManage/queryChapterList`, params, nohide, noloading)
	},
	// 根据id获取小说章节
	getBookById (params, nohide, noloading) {
		return API.GET(`/api/novelManage/queryChapterListById`, params, nohide, noloading)
	}
}
