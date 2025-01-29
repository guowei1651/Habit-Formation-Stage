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
		if (carouselTable.triggeredRow.item_num == 0) {
			showAlert("不能预览，没有轮播项的轮播！", "info")
			return;
		}

		var obj = { 'uId': appsmith.store.growing.id, 'cId': carouselTable.triggeredRow.id, 'expTime': expirationTime}
		let jsonStr = JSON.stringify(obj)
		console.log("json string:", jsonStr)
		let encode = this.encrypt(jsonStr)
		console.log("encode: ", encode)

		let url = "http://172.25.1.22/app/growing-external/home-6780ed538796eb006aaa90b3?branch=master&embed=true&param=" + encode
		navigateTo(url, {}, 'NEW_WINDOW')
	},
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