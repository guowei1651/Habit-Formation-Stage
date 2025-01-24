export default {
	onload () {
		if (! appsmith.store.growing || ! appsmith.store.growing.id) {
			navigateTo('login')
		}
	},
}