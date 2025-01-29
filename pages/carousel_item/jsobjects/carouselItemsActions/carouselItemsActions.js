export default {
	reverseString(str) {
		let reversedStr = '';
		for (let i = str.length - 1; i >= 0; i--) {
			reversedStr += str[i];
		}
		return reversedStr;
	},
	encrypt(content) {
		const encodeUint8Array = Uint8Array.from(Array.from(content).map(letter => letter.charCodeAt(0)));
		let encodeBase64 = encodeUint8Array.toBase64()
		let enencodeBase64 = this.reverseString(encodeBase64)
		return enencodeBase64;
	},
	decrypt(content) {
		let dedecodeBase64 = this.reverseString(content)
		const decodeUint8Array = Uint8Array.fromBase64(dedecodeBase64);
		var encodeStr = String.fromCharCode.apply(null, decodeUint8Array);
		return encodeStr;
	},
	previewButtonAction() {
		// 获取当前时间
		const currentTime = new Date();
		// 计算过期时间（加 1 小时）
		const expirationTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
		var obj = { 'uId': appsmith.store.growing.id, 'cId': carouselItemsView.carouselId, 'expTime': expirationTime}
		let jsonStr = JSON.stringify(obj)
		console.log("json string:", jsonStr)
		let encode = this.encrypt(jsonStr)
		console.log("encode: ", encode)

		let url = "http://172.25.1.22/app/growing-external/home-6780ed538796eb006aaa90b3?branch=master&embed=true&param=" + encode
		navigateTo(url, {}, 'NEW_WINDOW')
	},
	uploadImage: async () => {
		var res = await ossSaveImage.run()
		if (res && !res.url) {
			showAlert("上传图片错误！"+ JSON.stringify(res), "error")
			return NaN
		}
		var imageUrl = await this.covertToCDNUrl(res.url)
		Image.setImage(imageUrl)
		return res
	},
	async covertToCDNUrl (imageUrl) {
		let result = imageUrl.replace("https://hf-image.83105be5e9f26dccfb424f2c75893ac6.r2.cloudflarestorage.com", "https://8e53def.webp.fi");
		return result
	},
	covertToEntity: async (data, index) => {
		let carouselId = carouselItemsView.carouselId

		var result = {}
		result['carouselId'] = carouselId
		result['order'] = index
		// 1: permanent, 2: remind, 3: random
		result['displayType'] = 2
		if (data.displayType == 'permanent') {
			result['displayType'] = 1
		} else if (data.displayType == 'remind') {
			result['displayType'] = 2
		} else if (data.displayType == 'random') {
			result['displayType'] = 3
		}

		// 1: image, 2: remind, 3: habit, 4: long_schedule
		result['type'] = 2
		if (data.pageType == 'image') {
			result['type'] = 1
		} else if (data.pageType == 'remind') {
			result['type'] = 2
		} else if (data.pageType == 'habit') {
			result['type'] = 3
		} else if (data.pageType == 'long_schedule') {
			result['type'] = 4
		}

		result['alertLevel'] = Number(data.alertLevel)
		result['duration'] = data.duration
		result['triggerTime'] = data.triggerTime
		result['chartUrl'] = data.chartUrl
		result['relationsId'] = null
		if (data.habitId) {
			result['relationsId'] = Number(data.habitId)
		}

		return result;
	},
	complete: async() => {
		console.log(carouselItemsView.carouselItems)

		deleteItemsByCarouselId.run({'id': carouselItemsView.carouselId})
		for (let index = 0; index < carouselItemsView.carouselItems.length; index++) {
			var item = carouselItemsView.carouselItems[index]
			var entity = await this.covertToEntity(item, index)
			console.log("complete insert item:", item)
			insertCarouseItems.run(entity)
		}
		navigateTo("home")
	}
}