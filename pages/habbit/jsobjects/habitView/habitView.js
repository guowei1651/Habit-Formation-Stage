export default {
	displayModalData: {
		switchRadioGroup: 'times'
	},
	onload () {
		if (! appsmith.store.growing || ! appsmith.store.growing.id) {
			navigateTo('login')
		}
	},
	async disaplyImage() {
		Image.setImage(FilePicker.files[0].data)
	},
	showModalSwitchRadioGroupDefault() {
		return habitView.displayModalData.switchRadioGroup
	},
	covertFrequencyTimeUnitToDisplay(row) {
		let timeUnit = row["frequency_time_unit"];
		let times = row["target_frequency"];
		if (!timeUnit || !times) {
			return '/'
		}
		if (timeUnit == 'day'){
			return '每天' + times + '次'
		} else if (timeUnit == 'two days'){
			return '每两天' + times + '次'
		} else if (timeUnit == 'week'){
			return '每周' + times + '次'
		} else if (timeUnit == 'two weeks'){
			return '每两周' + times + '次'
		} else if (timeUnit == 'month'){
			return '每月' + times + '次'
		} else if (timeUnit == 'season'){
			return '每季度' + times + '次'
		}
		return '每天' + times + '次'
	},
	covertComplateToDisplay(row) {
		if (row.is_achieved){
			return '\u{1F315}' + ""
		}

		let progress = 0;
		if (row.take_habit_from_repetitions) {
			progress = row.times/row.take_habit_from_repetitions

		}
		let timeUnit = row["frequency_time_unit"];
		let times = row["target_frequency"];
		if (timeUnit && times) {
			progress = row.times/row.take_habit_from_repetitions
		}
		console.log("progress : ", progress)
		// progress = 0%			'\u{1F311}'
		if (progress < 0.25) {
			return '\u{1F311}'
		}
		// progress = 25%		'\u{1F312}'
		if (progress >= 0.25 && progress < 0.5) {
			return '\u{1F312}'
		}
		// progress = 50%		'\u{1F313}'
		if (progress >= 0.5 && progress < 0.75) {
			return '\u{1F313}'
		}
		// progress = 75%		'\u{1F314}'
		if (progress >= 0.75 && progress < 1) {
			return '\u{1F313}'
		}
		// progress = 100%		'\u{1F315}'
		if (progress >= 1) {
			return '\u{1F315}'
		}
		return '\u{1F311}'
	},
	showCrateModal() {
		console.log('showCrateModal : ')
		TitleText.setText("创建习惯")
		IdInput.setValue(0)
		PromptInput.setValue("")
		DurationInput.setValue("")
		ExtInfoInput.setValue("")
		DescInput.setValue("")
		Image.setImage("")

		TargetFrequencyInput.setValue("")
		FrequencyTimeUnitSelect.setSelectedOption("")
		TakeRepetitionsInput.setValue("")
		SwitchRadioGroup.setData('times')

		showModal(HabitModal.name)
	},
	showUpdateModal(row) {
		console.log('showUpdateModal : ', row)
		TitleText.setText("修改"+row.id+"号习惯")
		IdInput.setValue(row.id)
		PromptInput.setValue(row.prompt)
		DurationInput.setValue(row.duration)
		ExtInfoInput.setValue(row.ext_info)
		DescInput.setValue(row.ext_desc)
		Image.setImage(row.display_chart)

		if (row.target_frequency && row.frequency_time_unit) {
			this.displayModalData.switchRadioGroup = 'frequency'
			console.log("展示目标频率与目标单位: ", row.target_frequency, row.frequency_time_unit)
			TakeRepetitionsInput.setValue(0)
			TargetFrequencyInput.setValue(row.target_frequency)
			FrequencyTimeUnitSelect.setSelectedOption(row.frequency_time_unit)
		} else {
			this.displayModalData.switchRadioGroup = 'times'
			console.log("展示目标次数: ", row.take_habit_from_repetitions)
			TakeRepetitionsInput.setValue(row.take_habit_from_repetitions)
			TargetFrequencyInput.setValue('')
			FrequencyTimeUnitSelect.setSelectedOption('')
		}

		showModal(HabitModal.name)
	}
}