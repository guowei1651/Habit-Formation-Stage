export default {
	DeviceTypes:[],
	onload () {
		if (! appsmith.store.growing || ! appsmith.store.growing.id) {
			navigateTo('login')
			return
		}

		findAllDeviceTypes.run()

		var self = this
		findAllDeviceTypes.data.map(deviceType => {
			self.DeviceTypes[deviceType.id.toString()] = {
				'name':deviceType.name, 
				'allow_deletion': deviceType.allow_deletion
			}
		})

		console.log("最终结果", JSON.stringify(self.DeviceTypes))
	},
	showChageDeviceModal () {
		var data = devicesTable.selectedRow
		chageSerialInput.setValue(data.serial)
		chageNameInput.setValue(data.name)
		chageTypeInput.setValue(data.type_id)
		chageDescInput.setValue(data.info)
		chageFirmwareVerInput.setValue(data.firmware_version)
		showModal(chageDeviceModal.name)
	},
	actionAddDeviceModalSubmit () {
		var data = addSerialInput.text
		const param = {
			'serial': data
		}
		insertMyDevice.run(param).then(()=>{
			findMyDevices.run()
			closeModal(addDeviceModal.name)
		}, (err) => {
			showAlert("发生错误，请稍后重试。"+JSON.stringify(err), 'error')
		}).catch((err) => {
			showAlert("发生错误，请稍后重试。"+JSON.stringify(err), 'error')
		})
	}
}