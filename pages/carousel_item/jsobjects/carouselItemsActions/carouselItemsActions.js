export default {
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