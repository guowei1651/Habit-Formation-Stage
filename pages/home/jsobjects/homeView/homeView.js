export default {
	myVar1: [],
	myVar2: {},
	onload () {
		if (! appsmith.store.growing || ! appsmith.store.growing.id) {
			navigateTo('login')
		}
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}