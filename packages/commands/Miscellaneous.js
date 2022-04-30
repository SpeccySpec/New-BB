const categories = {
	misc: "Other things that don't fit into the other sections.",
	moderation: "Every bot needs something to moderate the server.",
	fun: "Fun things to use, come try them out!",
	food: "Tasty, tasty food! All for you to try out!",
	items: "Items that you can use to do things!",
	loot: "Loot that you can get from killing or pacifying enemies!",
	chests: "Chests for storing whatever item, weapon or armor you want! Or to get some goodies.",
	shops: "Need Items? Open shops and sell them!",
	skills: "Can't fight without the various attacks now, can ya?",
	characters: "Characters! The ones who will fell evil and succeed in their quests! I hope.",
	battle: "The main part of Bloom Battler is well... the battles of course!",
	all: "All of the existing commands"
}

const aliases = {
	miscellaneous: "misc"	
}

commands.help = new Command({
	desc: "Lists all of Bloom Battler's commands.",
	section: "misc",
	args: [
		{
			name: "Category",
			type: "Word"
		}
	],
	func: (message, args) => {
		let DiscordEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('List of Commands')
		let category = args[0]
		if (category) {
			category = category.toLowerCase()
			let pogname = aliases[category]
			if (pogname)
				category = pogname
			let description = categories[category]
			if (!description)
				return void commands.help.call(message, [])
			DiscordEmbed.setDescription(description)
			for (const i in commands) {
				const command = commands[i]
				if (command.section == category || category == 'all') {
					const value = command.getFullDesc()
					DiscordEmbed.fields.push({name: `${getPrefix(message.guild.id)}${i}`, value, inline: true})
				}
			}
		} else {
			const file = new Discord.MessageAttachment(`${dataPath}/images/Help.png`);
			DiscordEmbed.setDescription(`If you want to check commands in which categories, we have a list of them below!\n\nIf you want to see all commands at once, type ${getPrefix(message.guild.id)}help all.\n\nArguments in <> or {} should be substituted in with other values. If they're in {}, then they're optional.`)
			for (let i in categories) {
				if (i == 'all') continue

				let aliasName = i
				for (const a in aliases) {
					if (aliases[a] == i) {
						aliasName = a.toString()
						break
					}
				}
				DiscordEmbed.fields.push({name: aliasName.charAt(0).toUpperCase() + aliasName.slice(1), value: categories[i], inline: true});
			}
			DiscordEmbed.setThumbnail('attachment://Help.png')

			return message.channel.send({embeds: [DiscordEmbed], files: [file]})
		}

		message.channel.send({embeds: [DiscordEmbed]});
	}
})
