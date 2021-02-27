// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: notes-medical;

let items = await loadItems()
if (config.runsInWidget) {
	// Tell the widget on the Home Screen to show our ListWidget instance.
	let widget = await createWidget(items.response)

	Script.setWidget(widget)
} else {
	QuickLook.present(items)
	let widget = await createWidget(items.response)
	QuickLook.present(widget)
}

// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(item) {

	let widget = new ListWidget()
	const topWrap = widget.addStack()
	topWrap.layoutHorizontally()
	topWrap.centerAlignContent()
	let title = topWrap.addText("Backlog")
	title.textColor = new Color("BDBBB9", 255)

	topWrap.addSpacer(6)

	let imgLink = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/1200px-Steam_icon_logo.svg.png"

	let imgReq = new Request(imgLink)
	let img = await imgReq.loadImage()

	topWrap.addImage(img)

	widget.backgroundColor = new Color("#1B2838", 255)
	widget.addSpacer(20)
	const wrap = widget.addStack()
	wrap.layoutHorizontally()
	wrap.topAlignContent()
	wrap.spacing = 15

	const totalCol = wrap.addStack()
	totalCol.layoutVertically()
	const totalLabel = totalCol.addText("Total")
	totalLabel.textColor = new Color("#BDBBB9", 255)
	totalCol.addSpacer(8)
	totalCol.addText(item.game_count.toString())

	const playedCol = wrap.addStack()
	playedCol.layoutVertically()
	const playedLabel = playedCol.addText("Played")
	playedLabel.textColor = new Color("#BDBBB9", 255)
	playedCol.addSpacer(8)
	let playedCount = 0
	for (let x = 0; x < item.games.length; x++) {
		const game = item.games[x];
		if (game.playtime_forever > 4) {
			playedCount++
		}

	}
	playedCol.addText(playedCount.toString())

	return widget
}

async function loadItems() {
	let url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=[API Key]&steamid=[Steam User ID]&format=json"
	let req = new Request(url)
	let json = await req.loadJSON()
	//await QuickLook.present(json)
	return json
}