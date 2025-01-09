export default {

	changeAction () {
		if (username.text.length >= 6 && password.text.length >= 6) {
			Sign_In.setDisabled(false);
		} else {
			Sign_In.setDisabled(true);
		}
		return ''
	},
	sign_in () {
		const param = {'name':username.text, 'password': password.text}
		checkAuth.run({'login': param}).then((response) => {
			Sign_In.setDisabled(true);
			checkAuth.clear()

			if (null == response && response.length == 0) {
				showAlert('未找到用户')
				return '未找到用户';
			}

			const plainText = response[0].slat+param.password
			var md = forge.md.md5.create();
			md.update(plainText);
			var cipherText = md.digest().toHex()
			if (response[0].password != cipherText) {
				showAlert('未找到用户')
				return '未找到用户';
			}

			storeValue("growing", response[0]) 
			navigateTo('home')
			showAlert('用户成功登录')
			return '用户成功登录';
		}, (resp) => {
			console.log('执行报错', resp)
			checkAuth.clear()
		}).catch((err) => {
			console.log('报错', err)
			checkAuth.clear()
		})
	}
}