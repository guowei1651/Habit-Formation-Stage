export default {
	async deleteButtonAction () {
		console.log("deleteButtonAction : ", habitTable.triggeredRow.id)
		removeHabitById()
	},
	async uploadImageAction () {
		await uploadImage.run()
	},
	async updateHabit(param) {
		let result = await updateHabit.run(param)
		if (result) {
			console.log("update habit result:", result)
		} else {
			console.error("update habit 发生错误")
		}
	},
	async createHabit(param) {
		let result = createHabit.run(param)
		if (result) {
			console.log("create habit result:", result)
		} else {
			console.error("update habit 发生错误")
		}
	},
	uploadImage: async () => {
		var res = await uploadImage.run()
		if (res && !res.url) {
			showAlert("上传图片错误！"+ JSON.stringify(res), "error")
			return NaN
		}
		console.log("uploadImage res: ", res)
		var imageUrl = await this.covertToCDNUrl(res.url)
		return imageUrl
	},
	async covertToCDNUrl (imageUrl) {
		let result = imageUrl.replace("https://hf-image.83105be5e9f26dccfb424f2c75893ac6.r2.cloudflarestorage.com", "https://8e53def.webp.fi");
		return result
	},
	async submitHabitAction () {
		var param = {
		}
		console.log("filepicker : ", FilePicker)
		let result = ""
		try {
			result = await this.uploadImage()
			if (!result) {
				console.error("上传图片发生错误")
				return
			}
		} catch (error) {
			console.error("上传图片发生错误", error.message)
			showAlert("上传图片发生错误, " + error.message, "error")
			return
		}

		param.prompt = PromptInput.text
		param.duration = Number(DurationInput.text)
		param.ext_info = ExtInfoInput.text
		param.ext_desc = DescInput.text
		param.display_chart = result

		param.target_frequency = Number(TargetFrequencyInput.text)
		param.frequency_time_unit = FrequencyTimeUnitSelect.selectedOptionValue
		param.take_habit_from_repetitions = Number(TakeRepetitionsInput.text)

		console.log("开始创建或者更新数据: ", param)
		try {
			console.log("id :", IdInput.text)
			if (IdInput.text) {
				param.id = IdInput.text
				this.updateHabit(param)
			} else {
				this.createHabit(param)
			}
		} catch (err) {
			showAlert("创建或者更新数据发生错误，"+err.message, "error")
			return
		}

		await findMyHabits.run()
		closeModal(HabitModal.name)
	}
}