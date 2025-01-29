export default {
	defaultItem: {
		displayType: "remind",
		pageType: "habit",
		alertLevel: '',
		duration: 0,
		triggerTime: '',
		chartUrl: '',
		habitId: 0,
	},
	carouselId: 0,
	carouselItems: [],
	carouselItemSlider: [],
	habit: [],
	async covertToVo(list) {
		if (!list) {
			console.log("covertToVo 参数为空")
			return []
		}

		var result = await list.map((item) => {
			var displayTypeStr = "remind"
			if (item.display_type == 1) {
				displayTypeStr = "permanent"
			} else if (item.display_type == 2) {
				displayTypeStr = "remind"
			} else if (item.display_type == 3) {
				displayTypeStr = "random"
			}

			var typeStr = "habit"
			var habitId = 0
			var lsId = 0
			if (item.type == 1) {
				typeStr = "image"
			} else if (item.type == 2) {
				typeStr = "remind"
			} else if (item.type == 3) {
				typeStr = "habit"
				habitId = item.relations_id
			} else if (item.type == 4) {
				typeStr = "long_schedule"
				lsId = item.relations_id
			}

			return {
				"displayType": displayTypeStr,
				"pageType": typeStr,
				"alertLevel": item.alert_level,
				"duration": item.duration,
				"triggerTime": item.trigger_time,
				"chartUrl": item.chart_url,
				"habitId": habitId,
				"longScheduleId": lsId
			}
		})
		console.log("covertToVo result:", result)
		return result;
	},
	getItem() {
		let index = this.currentItemData.index
		console.log("getItem index:", index)
		if (!this.carouselItems || this.carouselItems.length == 0) {
			return this.defaultItem
		}
		let itemCount = this.carouselItems.length
		console.log("getItem item Count:", itemCount)
		if (index < 0 || index >= itemCount) {
			return this.defaultItem
		}

		return this.carouselItems[index]
	},
	currentItemOperator: {
		getDisplayTypeValue() {
			return this.getItem().displayType
		},
		getPageTypeValue() {
			return this.getItem().pageType
		},
		fillCarouselItemSlider() {
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
		showCarouselItem () {
			var item = this.getItem()
			if (!item) {
				console.log("showCarouselItem item is null")
				this.currentItemData.displayType = "remind"
				this.currentItemData.pageType = "habit"
				AlertLevelSelect.setSelectedOption("")
				DurationInput.setValue(0)
				TriggerTimeInput.setValue("")
				Image.setImage("https://assets.appsmith.com/widgets/default.png")
				HabitSelect.setSelectedOption(0)
			} else {
				console.log("showCarouselItem item: ", item)
				this.currentItemData.displayType = item.displayType
				this.currentItemData.pageType = item.pageType
				AlertLevelSelect.setSelectedOption(item.alertLevel)
				DurationInput.setValue(item.duration)
				TriggerTimeInput.setValue(item.triggerTime)
				Image.setImage(item.chartUrl)
				HabitSelect.setSelectedOption(item.habitId)
			}
		},
		recordCarouselItem() {
			var item = this.getItem()
			console.log("recordCarouselItem item:", item)
			item.displayType = DisplayRadioGroup.selectedOptionValue
			item.pageType = TypeRadioGroup.selectedOptionValue
			item.alertLevel = AlertLevelSelect.selectedOptionValue
			item.duration = DurationInput.text
			item.triggerTime = TriggerTimeInput.text
			item.chartUrl = Image.image
			item.habitId = HabitSelect.selectedOptionValue
		}
	},
	currentItemData: {
		lastIndex: 0,
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
		if (carouselId) {
			this.carouselId = carouselId
			await getCarouselItemsByCarouselId.run({"id": carouselId})
			this.carouselItems = await this.covertToVo(getCarouselItemsByCarouselId.data)
			ConfigerContainer.setVisibility(true)
			Image.setVisibility(true)
		} else {
			showAlert("请从正确位置进入页面，否这本页面无法使用", "error")
			ConfigerContainer.setVisibility(false)
			Image.setVisibility(false)
			return
		}

		await getHabit.run();
		this.habit = getHabit.data

		if (this.carouselItems) {
			CategorySlider.setValue(0)
			await this.currentItemOperator.fillCarouselItemSlider()
		}
		this.currentItemData.index = 0
		this.currentItemOperator.showCarouselItem()
	},
	async addItem () {
		console.log("addItem clider value: ",CategorySlider.value)

		let index = 0
		if (this.carouselItems.length > 0) {
			index = CategorySlider.value - 1
		}
		this.carouselItems.splice(index, 0, this.defaultItem);

		await this.currentItemOperator.fillCarouselItemSlider()
	},
	async fillCurrentItem() {
		console.log("fillCurrentItem step 1")
		this.currentItemData.lastIndex = this.currentItemData.index
		this.currentItemOperator.recordCarouselItem()
		console.log("fillCurrentItem step 2")
		this.currentItemData.index = CategorySlider.value - 1
		this.currentItemOperator.showCarouselItem()
		console.log("fillCurrentItem step 3")
	},
	async removeItem () {
		console.log("removeItem slider value: ",CategorySlider.value)
		let index = CategorySlider.value - 1
		if (index + 1 >= this.carouselItems.length){
			CategorySlider.setValue(index)
		}
		this.carouselItems.splice(index, 1)

		await this.currentItemOperator.fillCarouselItemSlider()
	},
}