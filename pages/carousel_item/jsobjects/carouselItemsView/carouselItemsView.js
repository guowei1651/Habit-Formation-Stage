export default {
	carouselItems: [],
	carouselItemSlider: [],
	habit: [],
	currentItemOperator: {
		getItem() {
			let index = this.currentItemData.index
			console.log("CurrentItem getItem ", this)
			if (!this.carouselItems || this.carouselItems.length == 0) {
				return "remind"
			}
			let itemCount = this.currentItemData.length
			if (index < 0 || index >= itemCount) {
				return "remind"
			}
			return this.currentItemData[this.index]
		},
		getDisplayTypeValue() {
			return this.currentItemOperator.getItem().displayType
		},
		getPageTypeValue() {
			return this.currentItemOperator.getItem().pageType
		},
		showCarouselItem () {
			var item = this.currentItemData.getItem()
			console.log("showCarouselItem item: ", item)
			this.currentItemData.displayType = item.displayType
			this.currentItemData.pageType = item.pageType
			AlertLevelSelect.setSelectedOption(item.alertLevel)
			DurationInput.setValue(item.duration)
			TriggerTimeInput.setValue(item.triggerTime)
			Image.setImage(item.chartUrl)
			HabitSelect.setSelectedOption(item.habitId)
		},
	},
	currentItemData: {
		index: 0,
		displayType: "",
		pageType: "",
	},
	async onload () {
		console.log("carousel_item onload", appsmith.store.growing)
		if (! appsmith.store.growing || ! appsmith.store.growing.id) {
			navigateTo('login')
			return
		}

		console.log("carousel_item onload", appsmith.URL.queryParams)
		if (!appsmith.URL.queryParams) {
			console.log("未传参数，所以不能正常使用。")
			showAlert("未传参数，所以不能正常使用。")
			return;
		}

		let carouselId = appsmith.URL.queryParams.id
		await getCarouselItemsByCarouselId.run({"id": carouselId})
		this.carouselItems = getCarouselItemsByCarouselId.data

		await getHabit.run();
		this.habit = getHabit.data

		CategorySlider.setValue(0)
		this.currentItemData.index = 0
		console.log(this.currentItem)
		this.currentItemOperator.showCarouselItem()
	},
	async fillCarouselItemSlider() {
		var result = []
		for (var i = 1 ;i < this.carouselItems.length + 1; i++)
		{ 
			result.push({
				"label": i + "",
				"value": i
			})
		}
		this.carouselItemSlider = result
		return result
	},
	async addItem () {
		console.log("addItem clider value: ",CategorySlider.value)
		var item = {
			displayType: "remind",
			pageType: "habit",
			alertLevel: '',
			duration: 0,
			triggerTime: '',
			chartUrl: '',
			habitId: 0,
		}
		this.carouselItems.splice(CategorySlider.value - 1, 0, item);

		await this.fillCarouselItemSlider()
	},
	async removeItem () {
		console.log("removeItem slider value: ",CategorySlider.value)
		if (CategorySlider.value >= this.carouselItems.length){
			CategorySlider.setValue(CategorySlider.value - 1)
		}
		this.carouselItems.splice(CategorySlider.value - 1, 1)

		await this.fillCarouselItemSlider()
	},
}