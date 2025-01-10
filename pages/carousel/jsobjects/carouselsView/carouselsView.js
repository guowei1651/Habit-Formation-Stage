export default {
	index: 0,
	images: [],
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