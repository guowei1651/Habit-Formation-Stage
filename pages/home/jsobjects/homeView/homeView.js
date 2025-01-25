export default {
	myVar1: [],
	myVar2: {},
	onload () {
		if (! appsmith.store.growing || ! appsmith.store.growing.id) {
			navigateTo('login')
		}
	},
	async showForm(isCreate, data) {
		console.log("showForm ", isCreate, data)
		promptText.setText("")
		if (isCreate) {
			titleText.setText("创建")
			idInput.setValue("")
			nameInput.setValue("")
			descInput.setValue("")
			Form.data['id'] = undefined
		} else {
			titleText.setText("修改")
			idInput.setValue(data.id)
			nameInput.setValue(data.name)
			if(data.description) {
				descInput.setValue(data.description)
			} else {
				descInput.setValue("")
			}
		}
		showModal("detail")
	},
	async createOrUpdate () {
		console.log("createOrUpdate", Form.data)
		await existCarousel.run({"name":Form.data['nameInput']})
		console.log(existCarousel.data)
		if (existCarousel.data[0].count > 0) {
			promptText.setText("*已经存在名字相同的轮播！")
			return
		}

		if (!Form.data.idInput) {
			let data = {}
			data['name'] = Form.data['nameInput']
			data['description'] = Form.data['descInput']
			createCarousel.run(data).then(()=>{
				getCarousel.run()
				closeModal("detail")
			}).catch((err)=>{
				showAlert("创建失败，"+err.message, "error")
			})
		} else {
			let data = {}
			data['id'] = Form.data['idInput']
			data['name'] = Form.data['nameInput']
			data['description'] = Form.data['descInput']
			updateCarousel.run(data).then(()=>{
				getCarousel.run()
				closeModal("detail")
			}).catch((err)=>{
				showAlert("创建失败，"+err.message, "error")
			})
		}
	}
}