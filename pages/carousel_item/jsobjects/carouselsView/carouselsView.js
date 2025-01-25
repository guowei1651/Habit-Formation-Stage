export default {
	carouselItems: [],
	carouselItemSlider: [],
	habit: [],
	currentItem: {
		index: 0,
		setIndex(i) {
			this.currentItem.index = i
		},
		getItem() {
			let self = this.currentItem
			console.log("CurrentItem getItem ", this)
			if (!this.carouselItems || this.carouselItems.length == 0) {
				return "remind"
			}
			let itemCount = self.gloabThis.carouselItems.length
			if (self.index < 0 || self.index >= itemCount) {
				return "remind"
			}
			return self.gloabThis.carouselItems[this.index]
		},
		getDisplayTypeValue() {
			return this.getItem().displayType
		},
		getPageTypeValue() {
			return this.getItem().pageType
		},
		showCarouselItem () {
			var item = this.carouselItems[this.index]

			AlertLevelSelect.setSelectedOption(item.alertLevel)
			DurationInput.setValue(item.duration)
			TriggerTimeInput.setValue(item.triggerTime)
			Image.setImage(item.chartUrl)
			HabitSelect.setSelectedOption(item.habitId)
		}
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
		this.currentItem.setIndex(index)
		console.log(this.currentItem)
		this.currentItem.showCarouselItem()
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


