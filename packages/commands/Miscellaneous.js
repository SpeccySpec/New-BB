commands.test = new Command({
	desc: "a",
	section: "misc",
	func: (message, args) => {
		message.reply("**[DEBUG]**\nThis is a test command.")
	}
})

commands.help = new Command({
	desc: "*Args: <?Category>*\nLists all of Bloom Battler's commands.",
	section: "misc",
	func: (message, args) => {
		let DiscordEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('List of Commands')

		if (args[0]) {
			switch(args[0].toLowerCase()) {
				default:
					DiscordEmbed.setDescription('This is a list of commands!')
					for (const i in commands) {
						DiscordEmbed.fields.push({name: `${getPrefix(message.guild.id)}${i}`, value: commands[i].desc, inline: true})
					}
					break;
				case 'miscellaneous'|'misc':
					DiscordEmbed.setDescription('What even am I supposed to say here?')
					for (const i in commands) {
						if (commands[i].section == 'misc') {
							DiscordEmbed.fields.push({name: `${getPrefix(message.guild.id)}${i}`, value: commands[i].desc, inline: true})
						}
					}
			}
		} else {
			const file = new Discord.MessageAttachment(`${dataPath}/images/Help.png`);
			DiscordEmbed.setDescription(`If you want to check commands in which categories, we have a list of them below!\n\nIf you want to see all commands at once, type ${getPrefix(message.guild.id)}help all.`)
			DiscordEmbed.fields.push({name: `Miscellaneous`, value: 'There is nothing much lol', inline: true});
			DiscordEmbed.setThumbnail('attachment://Help.png')

			return message.channel.send({embeds: [DiscordEmbed], files: [file]})
		}

		message.channel.send({embeds: [DiscordEmbed]});
	}
})