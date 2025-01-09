export default {
	DeviceTypes:[],
	DeviceTypesMap: {},
	onload () {
		findAllDeviceTypes.run()

		var self = this
		findAllDeviceTypes.data.map(deviceType => {
			self.DeviceTypes[deviceType.id.toString()] = deviceType.name
		})
		
		console.log("最终结果", JSON.stringify(self.DeviceTypes))
	}
}