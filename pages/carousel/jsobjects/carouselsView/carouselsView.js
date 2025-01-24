export default {
	index: 0,
	images: [],
	carouselItems: [],
	habit: [],
	onload () {
		if (! appsmith.store.growing || ! appsmith.store.growing.id) {
			navigateTo('login')
		}

		
		this.carouselItems = []

		getHabit.run();
		this.habit = getHabit.data
	},
	addItem () {
		var item = {
			"id": this.index,
			"name": "Blue",
			"input": "https://assets.appsmith.com/widgets/default.png"
		}
		this.images.push(item)
	},
	subItem () {
		this.images.pop()
	}
}