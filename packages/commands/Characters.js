commands.registerchar = new Command({
	desc: `Register a character to use in-battle! Characters can learn skills, use items, and initiate in combat, along with wayyy more!.`,
	aliases: ['registercharacter', 'makechar', 'regchar', 'regcharacter', 'charmake'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Main Element",
			type: "Word",
			forced: false
		},
		{
			name: "Base HP",
			type: "Num",
			forced: true
		},
		{
			name: "Base MP",
			type: "Num",
			forced: true
		},
		{
			name: "Base Strength",
			type: "Num",
			forced: true
		},
		{
			name: "Base Magic",
			type: "Num",
			forced: true
		},
		{
			name: "Base Perception",
			type: "Num",
			forced: true
		},
		{
			name: "Base Endurance",
			type: "Num",
			forced: true
		},
		{
			name: "Base Charisma",
			type: "Num",
			forced: true
		},
		{
			name: "Base Inteligence",
			type: "Num",
			forced: true
		},
		{
			name: "Base Agility",
			type: "Num",
			forced: true
		},
		{
			name: "Base Luck",
			type: "Num",
			forced: true
		},
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (charFile[args[0]]) {
			if (!utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) {
				return message.channel.send(`${args[0]} already exists, and you don't own them. You cannot overwrite them.`);
			} else {
				message.channel.send(`${args[0]} already exists, so I'll overwrite them for you.`);
			}
		}

		if (!utilityFuncs.inArray(args[1].toLowerCase(), Elements)) message.channel.send({content: 'Please enter a valid element for **Main Element!**', embeds: [elementList()]});

		if ((args[2] + args[3]) > 70) return message.channel.send(`The maximum total points for HP and MP is 70! Currently, you have ${args[2]+args[3]}.`);

		let bst = 0;
		for (let i = 4; i < args.length-1; i++) {
			if (args[i]) {
				if (args[i] <= 0) return message.channel.send("You can't have a stat that is less than 0!");
				if (args[i] > 10) return message.channel.send("You can't have a stat that is more than 10!");
				bst += args[i];
			}
		}

		if (bst > 45) return message.channel.send(`45 is the maximum amount of points across stats! Currently, you have ${bst}.`)
		if (bst < 30) message.channel.send(`${bst}BST is... sort of concerning. I-I won't stop you.`)

		let charDefs = writeChar(message.author, message.guild, args[0], args[1].toLowerCase(), args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]);
		message.channel.send({content: `${args[0]} has been registered!`, embeds: [briefDescription(charDefs)]})
	}
})

commands.changetruename = new Command({
	desc: `Rename a character's true name.`,
	aliases: ['changetruename', 'changename', 'changenamechange'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "New Name",
			type: "Word",
			forced: true
		},
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send(`${args[0]} does not exist!`);
		if (!utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send(`${args[0]} does not belong to you!`);

		if (args[1] == "" || args[1] == " ") return message.channel.send('Invalid new character name! Please enter an actual name.');

		if (charFile[args[1]]) return message.channel.send(`${args[1]} already exists!`);

		charFile[args[1]] = charFile[args[0]];
		delete charFile[args[0]];

		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
		message.channel.send(`${args[0]} has been renamed to ${args[1]}!`);
	}
})


commands.renamechar = new Command({
	desc: `Change a character's display name.`,
	aliases: ['renamecharacter', 'renamechar', 'charname', 'charnamechange'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "New Name",
			type: "Word",
			forced: true
		},
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);

		if (!charFile[args[0]]) return message.channel.send(`${args[0]} does not exist!`);
		if (!utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send(`${args[0]} does not belong to you!`);

		if (args[1] == "" || args[1] == " ") return message.channel.send('Invalid new character name! Please enter an actual name.');

		charFile[args[0]].name = args[1];

		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
		message.channel.send(`${args[0]}'s name has been changed to ${args[1]}!`);
	}
})

commands.getchar = new Command({
	desc: "Lists a character's stats, skills and more!",
	aliases: ['findchar', 'charinfo', 'chardesc'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Level",
			type: "Num",
			forced: false
		}
	],
	func: (message, args) => {
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');

		// Alright, let's get the character!
		let DiscordEmbed = longDescription(charFile[args[0]], args[1] ?? charFile[args[0]].level, message.guild.id, message);
		message.channel.send({embeds: [DiscordEmbed]});
	}
})

commands.listchars = new Command({
	desc: 'Lists *all* existing characters.',
	section: "skills",
	args: [
		{
			name: "Element",
			type: "Word",
			forced: false
		},
		{
			name: "User",
			type: "Ping",
			forced: false
		}
	],
	func: (message, args) => {
		let array = [];
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);

		for (const i in charFile) {
			if (charFile[i].hidden) continue;
			let descTxt = `${charFile[i].hp}/${charFile[i].maxhp}HP, ${charFile[i].mp}/${charFile[i].maxmp}MP`;

			if ((!args[0] || args[0].toLowerCase() === 'none') && (!args[1] || args[1].toLowerCase() === 'none')) {
				array.push({title: `${elementEmoji[charFile[i].mainElement]}${charFile[i].name} (${i})`, desc: descTxt});
				continue;
			}

			if ((!args[0] || args[0].toLowerCase() === 'none') && charFile[i].mainElement != args[0].toLowerCase()) continue;
			if (!args[1] && message.mentions.users.first() && skillFile[i].type != message.mentions.users.first().id) continue;
			array.push({title: `${elementEmoji[charFile[i].mainElement]}${charFile[i].name} (${i})`, desc: descTxt});
		}

		listArray(message.channel, array, args[1]);
	}
})

commands.searchchars = new Command({
	desc: 'Searches for characters by phrase.',
	section: "characters",
	args: [
		{
			name: "Phrase",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		let array = [];
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);

		for (const i in charFile) {
			if (charFile[i].hidden) continue;
			if (charFile[i].name.toLowerCase().includes(args[0].toLowerCase()) || i.toLowerCase().includes(args[0].toLowerCase())) {
				array.push({title: `${elementEmoji[charFile[i].mainElement]}${charFile[i].name} (${i})`, desc: `${charFile[i].hp}/${charFile[i].maxhp}HP, ${charFile[i].mp}/${charFile[i].maxmp}MP`});
			}
		}

		listArray(message.channel, array);
	}
})

commands.nickname = new Command({
	desc: `Change the character's nickname.`,
	aliases: ['nick', 'shortname'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Nick Name",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');
		
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		charFile[args[0]].nickname = args[1]
		message.channel.send(`👍 ${charFile[args[0]].name}'s nickname was changed to ${args[1]}.`)
		fs.writeFileSync(`${dataPath}/json/${guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.hidechar = new Command({
	desc: 'Stops the character from being found in lists. You can still find them via "getchar".',
	aliases: ['hide', 'secretchar'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		charFile[args[0]].hidden = !charFile[args[0]].hidden;
		message.channel.send(`👍 ${charFile[args[0]].name}'s visibility was toggled ${charFile[args[0]].hidden ? "on" : "off"}.`)
		fs.writeFileSync(`${dataPath}/json/${guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.mpmeter = new Command({
	desc: `Change the character's MP Meter.`,
	aliases: ['magicmeter'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Full Name",
			type: "Word",
			forced: true
		},
		{
			name: "Abreviated Name",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');
		
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		message.channel.send(`👍 ${charFile[args[0]].name}'s ${charFile[args[0]].mpMeter[1]} meter was changed to a ${args[2].toUpperCase()} meter. ${charFile[args[0]].name} uses ${args[1]} now.`)
		charFile[args[0]].mpMeter = [args[1], args[2].toUpperCase()]
	}
})

commands.mainelement = new Command({
	desc: "Changes the character's Main Element. A Main Element is an element that the character is proficient in. Skills with the main element as it's **sole** type will deal 1.1x damage when attacking enemies.",
	aliases: ['setelement', 'setmainelement', 'changeelement', 'element', 'maintype', 'settype'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Main Element",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
		if (!utilityFuncs.inArray(args[1].toLowerCase(), Elements)) return message.channel.send({content: 'Please enter a valid element for **Main Element!**', embeds: [elementList()]});

		charFile[args[0]].mainElement = args[1].toLowerCase();
		message.channel.send(`👍 ${charFile[args[0]].name}'s main element is now ${args[1].charAt(0).toUpperCase()+args[1].slice(1)}`);
		fs.writeFileSync(`${dataPath}/json/${guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

// Affinities
hasAffinity = (charDefs, element, affinity) => {
	if (element.toLowerCase() == 'almighty') return false;

	if (!charDefs.affinities) return false;
	if (!charDefs.affinities[affinity]) return false;

	for (const aff of charDefs.affinities[affinity]) {
		if (aff.toLowerCase() == element.toLowerCase()) return true;
	}

	return false;
}

hasStatusAffinity = (charDefs, element, affinity) => {
	if (element.toLowerCase() == 'almighty') return false;

	if (!charDefs.statusaffinities) return false;
	if (!charDefs.statusaffinities[affinity]) return false;

	for (const aff of charDefs.statusaffinities[affinity]) {
		if (aff.toLowerCase() == element.toLowerCase()) return true;
	}

	return false;
}

commands.setaffinity = new Command({
	desc: "Characters can deal less or more damage to others depending on their affinities! Weakness affinities increase the damage output of skills, while resisting ones lower or nullify damage.",
	aliases: ['seteffectiveness', 'affinity', 'effectiveness'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Element",
			type: "Word",
			forced: true
		},
		{
			name: "Affinity",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		// Element Affinities
		if (utilityFuncs.inArray(args[1].toLowerCase(), Elements)) {
			if (!utilityFuncs.inArray(args[2].toLowerCase(), Affinities) && args[2].toLowerCase() != 'normal') return message.channel.send('Please enter a valid affinity!```diff\n+ SuperWeak\n+ Weak\n+ Normal\n+ Resist\n+ Block\n+ Repel\n+ Drain```');
			if (args[1].toLowerCase() == 'almighty' || args[1].toLowerCase() == 'status' || args[1].toLowerCase() == 'passive' || args[1].toLowerCase() == 'heal') return message.channel.send(`You can't set ${args[1]} affinities!`);

			if (hasAffinity(charFile[args[0]], args[1].toLowerCase(), args[2].toLowerCase())) return message.channel.send(`${charFile[args[0]].name} already has a ${args[2]} affinity to ${args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()}!`);

			// Clear Affinities
			for (let a of Affinities) {
				if (a && charFile[args[0]].affinities[a]) {
					for (const k in charFile[args[0]].affinities[a]) {
						if (charFile[args[0]].affinities[a][k].toLowerCase() === args[1].toLowerCase()) {
							charFile[args[0]].affinities[a].splice(k, 1);
							break;
						}
					}
				}
			}

			// Apply Affinities (ignore if normal)
			if (args[2].toLowerCase() != 'normal') {
				if (!charFile[args[0]].affinities[args[2].toLowerCase()]) charFile[args[0]].affinities[args[2].toLowerCase()] = [];
				charFile[args[0]].affinities[args[2].toLowerCase()].push(args[1].toLowerCase());
			}
		// Status Affinities
		} else if (utilityFuncs.inArray(args[1].toLowerCase(), statusEffects)) {
			if (!charFile[args[0]].statusaffinities) charFile[args[0]].statusaffinities = {};

			if ((!utilityFuncs.inArray(args[2].toLowerCase(), Affinities) && args[2].toLowerCase() != 'normal') || args[2].toLowerCase() === 'superweak' || args[2].toLowerCase() === 'repel' || args[2].toLowerCase() === 'drain') return message.channel.send('Please enter a valid affinity!```diff\n+ Weak\n+ Normal\n+ Resist\n+ Block```');
			if (args[1].toLowerCase() == 'infatuation' || args[1].toLowerCase() == 'confusion' || args[1].toLowerCase() == 'mirror') return message.channel.send(`You can't set ${args[1]} affinities!`);

			if (hasStatusAffinity(charFile[args[0]], args[1].toLowerCase(), args[2].toLowerCase())) return message.channel.send(`${charFile[args[0]].name} already has a ${args[2]} affinity to ${args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()}!`);

			// Clear Affinities
			for (let a of Affinities) {
				if (charFile[args[0]].statusaffinities[a]) {
					if (a && charFile[args[0]].statusaffinities[a]) {
						for (const k in charFile[args[0]].statusaffinities[a]) {
							if (charFile[args[0]].statusaffinities[a][k].toLowerCase() === args[1].toLowerCase()) {
								charFile[args[0]].statusaffinities[a].splice(k, 1);
								break;
							}
						}
					}
				}
			}

			// Apply Affinities (ignore if normal)
			if (args[2].toLowerCase() != 'normal') {
				if (!charFile[args[0]].statusaffinities[args[2].toLowerCase()]) charFile[args[0]].statusaffinities[args[2].toLowerCase()] = [];
				charFile[args[0]].statusaffinities[args[2].toLowerCase()].push(args[1].toLowerCase());
			}
		// Neither entered.
		} else {
			return message.channel.send('Please enter a valid element or status effect to resist!');
		}

		// Display Message
		message.channel.send(`👍 ${charFile[args[0]].name} has a ${args[2]} affinity to ${args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()}`);
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.gainxp = new Command({
	desc: "Gives XP to a character. Enough XP can cause the character to level up! __Affected by the XP Rate of the server__.",
	aliases: ['xpup', 'getxp'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "XP",
			type: "Num",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// Checks
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
		if (args[1] <= 0) return message.channel.send("Don't even try it.");
		if (charFile[args[0]].level >= 99) return message.channel.send(`${charFile[args[0]].name} cannot level up any further!`);

		// gainXp function handles everything.
		gainXp(message, charFile[args[0]], args[1]);
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.levelup = new Command({
	desc: "Levels up a character.",
	aliases: ['lvlup', 'gainlevel'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Levels",
			type: "Num",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// Checks
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
		if (args[1] <= 0) return message.channel.send("Don't even try it.");
		if (charFile[args[0]].level >= 99) return message.channel.send(`${charFile[args[0]].name} cannot level up any further!`);

		// levelUpTimes function handles everything.
		levelUpTimes(charFile[args[0]], false, args[1], message);
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.forcelevel = new Command({
	desc: "Manually set a charater's level. This changes all their stats to the respective level.",
	aliases: ['setlevel', 'forcelvl', 'setlvl'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Forced Level",
			type: "Num",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// Checks
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
		if (args[1] <= 0 || args[1] > 99) return message.channel.send("Don't even try it.");

		// Actually force the Level
		charFile[args[0]].level = args[1];
		updateStats(charFile[args[0]], message.guild.id, true);

		//check every skill. if skill exists, check its level lock. If level lock is lower, set it to '', and then filter later
		for (let skill in charFile[args[0]].skills) {
			if (charFile[args[0]].skills[skill].levelLock < args[1]) charFile[args[0]].skills[skill] = '';
		}
		charFile[args[0]].skills = charFile[args[0]].skills.filter(skill => skill != '');

		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));

		// Send an Embed to notify us!
		let DiscordEmbed = briefDescription(charFile[args[0]]);
		DiscordEmbed.title = `${charFile[args[0]].name} was forced to Level ${args[1]}!`;
		DiscordEmbed.description = `**Level ${charFile[args[0]].level}**\n${DiscordEmbed.description}`;
		message.channel.send({embeds: [DiscordEmbed]});
	}
})

// Melee Attacks!
commands.setmelee = new Command({
	desc: "A melee attack is a basic, low power skill, that you can use to save on resources or test a potentially risky plan.",
	aliases: ['meleeattack', 'melee', 'changemelee'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Attack Name",
			type: "Word",
			forced: true
		},
		{
			name: "Element",
			type: "Word",
			forced: true
		},
		{
			name: "Power",
			type: "Num",
			forced: true
		},
		{
			name: "Accuracy",
			type: "Num",
			forced: true
		},
		{
			name: "Critical Hit Chance",
			type: "Num",
			forced: true
		},
		{
			name: "Status Effect",
			type: "Word",
			forced: false
		},
		{
			name: "Status Chance",
			type: "Num",
			forced: false
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		// Some element and balancing checks
		if (args[2].toLowerCase() != 'strike' && args[2].toLowerCase() != 'slash' && args[2].toLowerCase() != 'pierce' && args[2].toLowerCase() != 'explode') return message.channel.send('You can only use Physical Elements in melee attacks! _(Strike, Slash, Pierce, Explode)_');
		if (args[3] > 80) return message.channel.send('Melee Attacks cannot go above **80 power**!')
		if (args[5] > 15) return message.channel.send('Melee Attacks cannot go above **15% Critical Hit Chance**!')

		// Make the Melee Attack
		charFile[args[0]].melee = {
			name: args[1],
			type: args[2].toLowerCase(),
			pow: args[3],
			acc: args[4],
			crit: args[5],
		}

		// Status Effects
		if (args[6] && args[6].toLowerCase() != 'none') {
			if (!utilityFuncs.inArray(args[6].toLowerCase(), statusEffects)) {
				let str = `${args[6]} is an invalid status effect! Please enter a valid status effect for **Status!**` + '```diff'
				for (let i in statusEffects) str += `\n-${statusEffects[i]}`;
				str += '```'

				return message.channel.send(str)
			}

			charFile[args[0]].melee.status = args[6].toLowerCase();
			if (isFinite(args[7]) && args[7] < 100) charFile[args[0]].melee.statuschance = args[7];
		}

		// Display Message
		message.channel.send(`👍 ${charFile[args[0]].name}'s Melee Attack has been changed to **${elementEmoji[args[2].toLowerCase()]}${args[1]}**!`);
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

// Skill stuff!
knowsSkill = (charDefs, skill) => {
	if (!charDefs.skills) return null;
	if (charDefs.skills.length <= 0) return null;

	for (const i in charDefs.skills) {
		if (charDefs.skills[i] === skill) return i;
	}

	return null;
}

commands.learnskill = new Command({
	desc: "Skills are attacks characters can use in battle! To make one, use the ''registerskill'' command! They can make or break a character or enemy.",
	aliases: ['skilllearn', 'obtainskill'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Skill Names",
			type: "Continuous",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		// Let's learn skills!
		let learnString = `👍 ${args[0]} learned `;
		let skillLearn = [];

		for (let i = 1; i < args.length; i++) {
			if (knowsSkill(charFile[args[0]], args[i])) return message.channel.send(`${args[0]} already knows ${args[i]}!\n\n**[TIP]**\n_Don't enter two of the same skill!_`);

			if (skillFile[args[i]]) {
				if (skillFile[args[i]].levellock) {
					if (charFile[args[0]].level < skillFile[args[i]].levellock) return message.channel.send(`${charFile[args[0]].name} is level ${charFile[args[0]].level}, but must be level ${skillFile[args[i]].levellock} to learn ${skillFile[args[i]].name}!`);
				}

				learnString += (skillFile[args[i]].name ? skillFile[args[i]].name : args[i])
				charFile[args[0]].skills.push(args[i])
				skillLearn.push(args[i])

				if (i == args.length-2)
					learnString += ' and '
				else if (i >= args.length-1)
					learnString += '!'
				else
					learnString += ', '
			} else
				return message.channel.send(`${args[i]} isn't a valid skill.`);
		}

		if (!charFile[args[0]].creator && charFile[args[0]].skills.length > 8) return message.channel.send("You cannot have more than 8 skills!");
		message.channel.send(learnString);

		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.replaceskill = new Command({
	desc: "Changes a skill a character or enemy knows from one to another.",
	aliases: ['changeskill'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Skill Name",
			type: "Word",
			forced: true
		},
		{
			name: "New Skill Name",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		// Do we know the skill
		if (!skillFile[args[1]]) return message.channel.send('Invalid skill to replace! Remember that these are case sensitive.');
		if (!skillFile[args[2]]) return message.channel.send('Invalid skill to replace with! Remember that these are case sensitive.');
		if (!knowsSkill(charFile[args[0]], args[1])) return message.channel.send(`${charFile[args[0]].name} doesn't know ${args[1]}!`);

		// Level Lock
		if (skillFile[args[2]].levellock) {
			if (charFile[args[0]].level < skillFile[args[2]].levellock) return message.channel.send(`${charFile[args[0]].name} is level ${charFile[args[0]].level}, but must be level ${skillFile[args[2]].levellock} to learn ${skillFile[args[2]].name}!`);
		}

		// Let's replace it
		let num = knowsSkill(charFile[args[0]], args[1])
		charFile[args[0]].skills[num] = args[2]

		message.react('👍');
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.forgetskill = new Command({
	desc: "Removes a character's skill.",
	aliases: ['loseskill', 'amnesia', 'removeskill'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Skill Name",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		// Do we know the skill
		if (!skillFile[args[1]]) return message.channel.send('Invalid skill to replace! Remember that these are case sensitive.');
		if (!knowsSkill(charFile[args[0]], args[1])) return message.channel.send(`${charFile[args[0]].name} doesn't know ${args[1]}!`);

		// Let's kill it!
		let num = knowsSkill(charFile[args[0]], args[1])
		charFile[args[0]].skills.splice(num, i)

		message.react('👍');
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.autolearn = new Command({
	desc: "Allows this skill to be automatically evolved when levelling up based on the skill's Evo-Skill.",
	aliases: ['autoskill', 'autoevo'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Skill Name",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// some checks
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		// Do we know the skill
		if (!skillFile[args[1]]) return message.channel.send('Invalid skill to replace! Remember that these are case sensitive.');
		if (!knowsSkill(charFile[args[0]], args[1])) return message.channel.send(`${charFile[args[0]].name} doesn't know ${args[1]}!`);

		// Auto Learn
		if (!charFile[args[0]].autolearn) charFile[args[0]].autolearn = {};

		// Let's allow it to auto evolve
		let num = knowsSkill(charFile[args[0]], args[1]);
		charFile[args[0]].autolearn[num] = !charFile[args[0]].autolearn[num];
		message.channel.send(`${charFile[args[0]].name}'s ${skillFile[args[1]].name} automatic evolution has been toggled to ${charFile[args[0]].autolearn[num] ? 'On' : 'Off'}!`);
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

// Leader Skills
commands.leaderskill = new Command({
	desc: "A Leader Skill is a skill characters activate for the entire team when they are at the front of a party. This can have various effects on the characters reccomended to use, the skills reccomended to use, the playstyle of your party and more!",
	aliases: ['setleaderskill', 'leadskill', 'frontskill', 'orderskill'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Leader Skill Name",
			type: "Word",
			forced: true
		},
		{
			name: "Leader Skill Type",
			type: "Word",
			forced: true
		},
		{
			name: "Variable #1",
			type: "Word",
			forced: true
		},
		{
			name: "Variable #2",
			type: "Num",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// checkie
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		// ok here goes nothing
		charFile[args[0]].leaderskill = {
			name: args[1],
			type: args[2].toLowerCase()
		}

		switch(args[2].toLowerCase()) {
			case 'boost':
			case 'discount':
			case 'crit':
				if (args[3].toLowerCase() === "magic" || args[3].toLowerCase() === "physical")
					if (args[4] > 10) return message.channel.send(`${args[4]}% is too powerful for a leader skill like this! The maximum for a ${args[3]} affecting leader skill is 10%.`);
				else {
					if (!utilityFuncs.inArray(args[3].toLowerCase(), Elements)) return message.channel.send({content: `${args[3]} is an invalid element! Try one of these.`, embeds: [elementList()]});
					if (args[4] > 30) return message.channel.send(`${args[4]}% is too powerful for a leader skill like this! The maximum for this leader skill is 30%.`);
				}

				if (args[4] < 1) return message.channel.send(`${args[4]}% is too low a boost :/`);
				break;

			case 'status':
				if (!utilityFuncs.inArray(args[3].toLowerCase(), statusEffects)) return message.channel.send({content: `${args[3]} is an invalid status effect!`});
				if (args[4] > 25) return message.channel.send(`${args[4]}% is too powerful for a leader skill like this! The maximum for this leader skill is 25%.`);
				if (args[4] < 1) return message.channel.send(`${args[4]}% is too low a boost :/`);
				break;

			case 'buff':
				if (!utilityFuncs.inArray(args[3].toLowerCase(), stats)) return message.channel.send({content: `${args[3]} is an invalid stat!`});
				if (args[4] > 3) return message.channel.send(`${args[4]}% is too powerful for a leader skill like this! The maximum for this leader skill is 3.`);
				if (args[4] < 1) return message.channel.send(`${args[4]}% is too low a boost :/`);
				break;
		}

		charFile[args[0]].leaderskill.var1 = args[3];
		charFile[args[0]].leaderskill.var2 = args[4];

		message.react('👍');
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

// Limit Break skills
commands.setlb = new Command({
	desc: "A Limit Break is a powerful skill exclusive to each character that they can pull off if the conditions are met. They cannot be executed if Limit Breaks are disabled for that server.",
	aliases: ['setlimitbreak', 'makelb', 'makelimitbreak'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Limit Break Name",
			type: "Word",
			forced: false
		},
		{
			name: "Limit Break Level",
			type: "Num",
			forced: false
		},
		{
			name: "LB% Required",
			type: "Num",
			forced: false
		},
		{
			name: "Power",
			type: "Num",
			forced: true
		},
		{
			name: "Critical Hit Chance",
			type: "Decimal",
			forced: false
		},
		{
			name: "Hits",
			type: "Num",
			forced: true
		},
		{
			name: "Targets",
			type: "Word",
			forced: true
		},
		{
			name: "Status",
			type: "Word",
			forced: false
		},
		{
			name: "Status Chance",
			type: "Decimal",
			forced: false
		},
		{
			name: "Description",
			type: "Any",
			forced: false
		},
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// checkie
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
	
		if (message.content.includes("@everyone") || message.content.includes("@here") || message.mentions.users.first()) return message.channel.send("Don't even try it.");
		if (args[1].length > 50) return message.channel.send(`${args[1]} is too long of a skill name.`);
	
		// So much shit to check :(
		if (args[2] > 4 || args[2] < 1) return message.channel.send('Invalid Limit Break Level! Please enter one from 1-4.');
	
		let powerBounds = [450, 600, 750, 900];
		let percentBounds = [100, 200, 300, 4-0];
		let levelLocks = [20, 48, 69, 85];
		if (charFile[args[0]].lb) {
			if (!charFile[args[0]][args[2]-1].lb) return message.channel.send(`Please enter Limit Breaks chronologically! You do not have a level ${args[2]-1} Limit Break.`);
		} else {
			if (args[2] > 1) return message.channel.send('Please enter Limit Breaks chronologically, starting from Level 1.');
		}
	
		if (charFile[args[0]].level < levelLocks[args[2]-1]) return message.channel.send(`${charFile[args[0]].name} is level ${charFile[args[0]].level}, but they must be at level ${levelLocks[args[2]-1]} to obtain a level ${args[2]} limit break.`);
	
		if (args[3] < percentBounds[args[2]-1]) return message.channel.send(`Level ${args[2]} Limit Breaks costs cannot be lower than ${percentBounds[args[2]-1]} LB%.`);
	
		if (args[4] < 1) return message.channel.send('Limit Break Skills with 0 power or less will not function!');
		if (args[4] > powerBounds[args[2]-1]) return message.channel.send(`Level ${args[2]} Limit Breaks cannot exceed ${powerBounds[args[2]-1]} power.`);
		if (!isFinite(args[3])) return message.channel.send('Please enter a whole number for **Power**!');
	
		if (args[6] < 1) return message.channel.send('Skills with 0 hits or less will not function!');
		if (!isFinite(args[6])) return message.channel.send('Please enter a whole number for **Hits**!')
	
		if (!args[7] || !utilityFuncs.inArray(args[7].toLowerCase(), Targets)) return message.channel.send('Please enter a valid target type for **Target**!```diff\n- One\n- Ally\n- Caster\n- AllOpposing\n- AllAllies\n- RandomOpposing\n- RandomAllies\n- Random\n- Everyone\n-SpreadOpposing\n- SpreadAllies```')
	
		let skillDefs = {
			name: args[1],
			level: args[2],
			pow: args[4],
			cost: args[3],
			hits: args[6],
			target: args[7].toLowerCase(),
			originalAuthor: message.author.id
		}
	
		if (args[5] > 0) skillDefs.crit = args[5];
	
		if (args[8] && args[8].toLowerCase() != 'none') {
			if (!utilityFuncs.inArray(args[8].toLowerCase(), statusEffects)) {
				let str = `${args[8]} is an invalid status effect! Please enter a valid status effect for **Status!**` + '```diff'
				for (let i in statusEffects) str += `\n-${statusEffects[i]}`;
				str += '```'

				return message.channel.send(str);
			}
					skillDefs.status = args[8].toLowerCase();
			if (isFinite(args[9]) && args[9] < 100) skillDefs.statuschance = args[11];
		}
	
		if (args[10]) skillDefs.desc = args[10];
		
		if (!charFile[args[0]].lb) charFile[args[0]].lb = {};
		charFile[args[0]].lb[args[2]] = skillDefs;
	
		message.react('👍');
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.changestats = new Command({
	desc: "Change the stats of a character.",
	aliases: ['setstats', 'changestat', 'setstat'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Base HP",
			type: "Num",
			forced: true
		},
		{
			name: "Base MP",
			type: "Num",
			forced: true
		},
		{
			name: "Base Strength",
			type: "Num",
			forced: true
		},
		{
			name: "Base Magic",
			type: "Num",
			forced: true
		},
		{
			name: "Base Perception",
			type: "Num",
			forced: true
		},
		{
			name: "Base Endurance",
			type: "Num",
			forced: true
		},
		{
			name: "Base Charisma",
			type: "Num",
			forced: true
		},
		{
			name: "Base Intelligence",
			type: "Num",
			forced: true
		},
		{
			name: "Base Agility",
			type: "Num",
			forced: true
		},
		{
			name: "Base Luck",
			type: "Num",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (charFile[args[0]]) {
			if (!utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id)
				return message.channel.send(`${args[0]} already exists, and you don't own them. You cannot change their stats.`);
		}

		if ((args[1] + args[2]) > 70) return message.channel.send(`The maximum total points for HP and MP is 70! Currently, you have ${args[1]+args[2]}.`);
	
		let bst = 0;
		for (let i = 3; i < args.length-1; i++) {
			if (args[i]) {
				if (args[i] <= 0) return message.channel.send("You can't have a stat that is less than 0!");
				if (args[i] > 10) return message.channel.send("You can't have a stat that is more than 10!");
				bst += args[i];
			}
		}

		if (bst > 45) return message.channel.send(`45 is the maximum amount of points across stats! Currently, you have ${bst}.`)
		if (bst < 30) message.channel.send(`${bst}BST is... sort of concerning. I-I won't stop you.`)

		charFile[args[0]].basehp = args[1];
		charFile[args[0]].basemp = args[2];
		charFile[args[0]].basestats = {
			baseatk: args[3] != 0 ? args[3] : 1,
			basemag: args[4] != 0 ? args[4] : 1,
			baseprc: args[5] != 0 ? args[5] : 1,
			baseend: args[6] != 0 ? args[6] : 1,
			basechr: args[7] != 0 ? args[7] : 1,
			baseint: args[8] != 0 ? args[8] : 1,
			baseagl: args[9] != 0 ? args[9] : 1,
			baseluk: args[10] != 0 ? args[10] : 1
		}

		updateStats(charFile[args[0]], message.guild.id, true);

		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
		
		// Send an Embed to notify us!
		let DiscordEmbed = briefDescription(charFile[args[0]]);
		DiscordEmbed.title = `${charFile[args[0]].name}'s stats have been changed!`;
		DiscordEmbed.description = `**Level ${charFile[args[0]].level}**\n${DiscordEmbed.description}`;
		message.channel.send({embeds: [DiscordEmbed]});
	}
})

commands.updatecharacters = new Command({
	desc: "Updates characters!",
	aliases: ['updatechars', 'fixchars', 'interoperability'],
	section: "moderation",
	args: [],
	func: (message, args) => {
		if (!utilityFuncs.RPGBotAdmin(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are not a hardcoded admin of this bot.`);
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		for (let i in charFile) {
			charFile[i].name = i;

			// Melee Attack
			charFile[i].melee = {
				name: charFile[i].melee[0],
				type: charFile[i].melee[1],
				pow: 30,
				acc: 95,
				crit: 15
			}

			// Weapons and Armor
			charFile[i].weapon = {}
			charFile[i].armor = {}

			// Main stats
			charFile[i].stats = {
				atk: charFile[i].atk,
				mag: charFile[i].mag,
				prc: charFile[i].prc,
				end: charFile[i].end,
				chr: charFile[i].chr,
				int: charFile[i].int,
				agl: charFile[i].agl,
				luk: charFile[i].luk
			}

			charFile[i].basestats = {
				baseatk: charFile[i].baseatk,
				basemag: charFile[i].basemag,
				baseprc: charFile[i].baseprc,
				baseend: charFile[i].baseend,
				basechr: charFile[i].basechr,
				baseint: charFile[i].baseint,
				baseagl: charFile[i].baseagl,
				baseluk: charFile[i].baseluk
			}

			// Affinities & Skills
			charFile[i].affinities = {
				superweak: charFile[i].superweak,
				weak: charFile[i].weak,
				resist: charFile[i].resist,
				block: charFile[i].block,
				repel: charFile[i].repel,
				drain: charFile[i].drain
			}

			charFile[i].autolearn = charFile[i].autoLearn

			// Quotes
			if (!charFile[i].quotes) charFile[i].quotes = {};
			for (const k in quoteTypes) {
				charFile[i].quotes[`${quoteTypes[k]}quote`] = charFile[i][`${quoteTypes[k]}quote`];
			}
			
			// Leader Skills
			if (charFile[i].leaderSkill) {
				charFile[i].leaderskill = {
					name: charFile[i].leaderSkill.name,
					type: charFile[i].leaderSkill.type,
					var1: charFile[i].leaderSkill.target,
					var2: charFile[i].leaderSkill.percent
				}
			}

			// LBs
			if (!charFile[i].lb) charFile[i].lb = {};

			for (let k = 1; k < 4; k++) {
				if (charFile[i][`lb${k}`]) charFile[i].lb[k] = charFile[i][`lb${k}`];
			}

			// Bio Info
			charFile[i].bio.height = [4, 0]
			charFile[i].bio.weight = 0
			charFile[i].bio.age = 10
			charFile[i].bio.custom = {}

			// Update Stats, for certain changes in new BB.
			updateStats(charFile[i], message.guild.id, true);
		}
		
		// delete old shit
		for (let i in charFile) {
			delete charFile[i].autoLearn;
			delete charFile[i].leaderSkill;
			for (let k of stats) delete charFile[i][k];
			for (let k of Affinities) delete charFile[i][k];
			for (let k of stats) delete charFile[i][`base${k}`];
			for (let k = 1; k < 4; k++) delete charFile[i][`lb${k}`];
			for (let k of quoteTypes) delete charFile[i][`${k}quote`];
		}

		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));

		// Send an Embed to notify us!
		message.channel.send('Characters have been updated from an older version to a newer one!');
	}
})

commands.purgechar = new Command({
	desc: `Deletes a character. **YOU CANNOT GET IT BACK AFTER DELETION!**`,
	section: 'characters',
	aliases: ['unregisterchar', 'charpurge', 'charunregister', 'deletechar', 'chardelete'],
	args: [
		{
			name: "Name",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`)

		if (!charFile[args[0]]) return message.channel.send(`${args[0]} is not a valid character name.`);

		if (charFile[args[0]].originalAuthor != message.author.id && !utilityFuncs.isAdmin(message)) return message.channel.send("You do not own this character, therefore, you have insufficient permissions to delete it.")

		message.channel.send(`Are you **sure** you want to delete ${charFile[args[0]].name}? You will NEVER get this back, so please, ensure you _WANT_ to delete this character.\n**Y/N**`);

		var givenResponce = false
		var collector = message.channel.createMessageCollector({ time: 15000 });
		collector.on('collect', m => {
			if (m.author.id == message.author.id) {
				if (m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'y') {
					message.channel.send(`${charFile[args[0]].name} has been erased from existance.`)
					delete charFile[args[0]]

					fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, 4));
				} else
					message.channel.send(`${charFile[args[0]].name} will not be deleted.`);
				
				givenResponce = true
				collector.stop()
			}
		});
		collector.on('end', c => {
			if (givenResponce == false)
				message.channel.send(`No response given.\n${charFile[args[0]].name} will not be deleted.`);
		});
	}
})

commands.randchar = new Command({
	desc: `Get a random character.`,
	section: 'fun',
	aliases: ['randomchar'],
	args: [],
	func: (message, args) => {
		charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`)

		if (Object.keys(charFile).length == 0) return message.channel.send(`No characters have been added yet.`);
		
		let char = Object.keys(charFile)[Math.floor(Math.random() * Object.keys(charFile).length)];

		let DiscordEmbed = longDescription(charFile[char], charFile[char].level, message.guild.id, message);
		message.channel.send({content:`Congratulations, ${message.guild.members.cache.get(charFile[char].owner).user.username}! ${elementEmoji[charFile[char].mainElement]} ${charFile[char].name} has been rolled!`, embeds: [DiscordEmbed]})
	}
})

commands.dailychar = new Command({
	desc: 'Any random character can be set as a daily one! Test your luck to see if yours is here!',
	section: "fun",
	args: [],
	func: (message, args) => {
		charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`)

		if (Object.keys(charFile).length == 0) return message.channel.send(`No characters have been added yet!`);
		if (!dailyChar) dailyChar = {};

		let notice = 'Here is the daily character, again.'
		if (!dailyChar[message.guild.id]) {
			dailyChar[message.guild.id] = Object.keys(charFile)[Math.floor(Math.random() * Object.keys(charFile).length)];

			let authorTxt = charFile[dailyChar[message.guild.id]].originalAuthor ? `<@!${charFile[dailyChar[message.guild.id]].originalAuthor}>` : '<@776480348757557308>'
			notice = `${authorTxt}, your character is the daily character for today!`;
		}

		setTimeout(function() {
			if (charFile[dailyChar[message.guild.id]]) {
				let today = getCurrentDate();

				fs.writeFileSync(dataPath+'/dailychar.txt', JSON.stringify(dailyChar));

				let charTxt = `**[${today}]**\n${notice}`
				let DiscordEmbed = longDescription(charFile[dailyChar[message.guild.id]], charFile[dailyChar[message.guild.id]].level, message.guild.id, message);
				message.channel.send({content: charTxt, embeds: [DiscordEmbed]});
			}
		}, 500);
	}
})

// Quotes... oh boy.
selectQuote = (char, quote, neverEmpty) => {
	let emptyTxt = neverEmpty ? 'No quotes in this section!' : '';

	if (!char.quotes[`${quote}quote`]) return emptyTxt;
	if (char.quotes[`${quote}quote`].length < 1) return emptyTxt;

	let randQuote = Math.round(Math.random() * (char.quotes[`${quote}quote`].length-1));
	return `_${char.name}: "${char.quotes[`${quote}quote`][randQuote]}"_`;
}

commands.setquote = new Command({
	desc: "Quotes are things characters will say in battle! This can help give them more personality and uniqueness.",
	aliases: ['makequote', 'sq'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Quote Type",
			type: "Word",
			forced: true
		},
		{
			name: "The Quote",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		if (args[2].length > 120) return message.channel.send('This quote is too long!');

		if (!utilityFuncs.inArray(args[1].toLowerCase(), quoteTypes)) {
			let quoteStr = '```diff\n';
			for (let quote of quoteTypes) quoteStr += `- ${quoteTypes}`;
			quoteStr += '```';

			return message.channel.send(`Invalid Quote Type! Try one of these:${quoteTypes}`);
		}

		if (!charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`]) charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`] = [];
		charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`].push(args[2]);

		message.react('👍');
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})

commands.clearquote = new Command({
	desc: 'Removes a quote, group of quotes or all quotes from a character.',
	aliases: ['clearquotes', 'cq'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Quote Type",
			type: "Word",
			forced: false
		},
		{
			name: "Quote ID",
			type: "Num",
			forced: false
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.utilityFuncs.isAdmin(message) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		if (!args[1]) {
			message.channel.send('**[WARNING]**\nAre you sure? **YOU CANNOT GET THESE BACK!**')
			
			let givenResponce = false
			let collector = message.channel.createMessageCollector({ time: 15000 });
			collector.on('collect', m => {
				if (m.author.id == message.author.id) {
					if (m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'y') {
						m.react('👍');
						message.react('👍');

						for (const i in quoteTypes) charFile[args[0]].quotes[`${quoteTypes[i]}quote`] = [];
						fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
					} else {
						m.react('👍');
						message.react('👍');
						message.channel.send(`${charFile[args[0]]} will not be cleansed of their quotes.`);
					}
				}
			});
			collector.on('end', c => {
				if (givenResponce == false) message.channel.send("I'll... take that as a no.");
			});
		} else {
			if (!utilityFuncs.inArray(args[1].toLowerCase(), quoteTypes)) {
				let quoteStr = '```diff\n';
				for (let quote of quoteTypes) quoteStr += `- ${quoteTypes}`;
				quoteStr += '```';

				return message.channel.send(`Invalid Quote Type! Try one of these:${quoteTypes}`);
			}

			if (args[2]) {
				if (!charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`]) charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`] = [];
				charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`].splice(args[2], 1);
			} else {
				charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`] = [];
			}

			message.react('👍');
			fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
		}
	}
})

commands.getquotes = new Command({
	desc: "View a character's quotes.",
	aliases: ['seequotes'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Quote Type",
			type: "Word",
			forced: false
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');

		if (args[1]) {
			if (!utilityFuncs.inArray(args[1].toLowerCase(), quoteTypes)) {
				let quoteStr = '```diff\n';
				for (let quote of quoteTypes) quoteStr += `- ${quoteTypes}`;
				quoteStr += '```';

				return message.channel.send(`Invalid Quote Type! Try one of these:${quoteTypes}`);
			}

			if (!charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`] || !charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`][0]) return message.channel.send('This Quote Type has no quotes!');

			let array = [];
			for (let i in charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`])
				array.push({title: `**[${i}]**`, desc: `_"${charFile[args[0]].quotes[`${args[1].toLowerCase()}quote`][i]}"_`});

			listArray(message.channel, array, 1);
		} else {
			let array = [];
			for (let quote of quoteTypes) {
				let quoteTxt = '';
				if (!charFile[args[0]].quotes[`${quote}quote`])
					quoteTxt = 'No quotes for this section!';
				else
					quoteTxt = selectQuote(charFile[args[0]], quote, true);

				array.push({title: `${quote.charAt(0).toUpperCase()+quote.slice(1)}`, desc: quoteTxt});
			}

			listArray(message.channel, array, 1);
		}
	}
})

commands.getbio = new Command({
	desc: "Lists a character's information, backstory, age, ect",
	aliases: ['bio', 'charbio', 'characterbio'],
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Section",
			type: "Word",
			forced: false
		}
	],
	func: (message, args) => {
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');

		// Alright, let's get the character!
		var DiscordEmbed;
		if (!args[1]) {
			DiscordEmbed = longBio(charFile[args[0]], message.guild.id);
		} else {
			if (!charFile[args[0]].bio[args[1].toLowerCase()] && (charFile[args[0]].bio.custom && !charFile[args[0]].bio.custom[args[1].toLowerCase()])) 
				return message.channel.send("Invalid Bio Section!");

			DiscordEmbed = shortBio(charFile[args[0]], args[1].toLowerCase(), message.guild.id);
		}

		message.channel.send({embeds: [DiscordEmbed]});
	}
})

commands.setbioinfo = new Command({
	desc: "Sets a character's information, backstory, age, ect",
	section: "characters",
	args: [
		{
			name: "Character Name",
			type: "Word",
			forced: true
		},
		{
			name: "Section",
			type: "Word",
			forced: true
		},
		{
			name: "Info",
			type: "Word",
			forced: true
		}
	],
	func: (message, args) => {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id)) return message.channel.send(`${message.author.username}, you are banned from using this bot.`);
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');

		/**bio: {
			custom: {}
		}, */

		if (!utilityFuncs.isAdmin(message) && !charFile[args[0]].owner == message.author.id) return message.channel.send('You are not the owner of this character!');

		//check for each field. If it's fillname, ninckmane or species, require a string. If it's weight require a decimal.
		switch (args[1].toLowerCase()) {
			case "fullname":
			case "nickname":
			case "species":
			case "info":
			case "backstory":
			case "likes":
			case "dislikes":
			case "fears":
			case "voice":
			case "theme":
				if (args[1].toLowerCase() == 'none') args[2] = '';
				charFile[args[0]].bio[args[1].toLowerCase()] = args[2];
				break;
			case "weight":
				if (args[2].toLowerCase() == 'none') args[2] = 0;
				if (isNaN(args[2])) return message.channel.send('Invalid weight! Please enter a decimal.');
				charFile[args[0]].bio.weight = parseFloat(args[2]);
				break;
			case "height":
				if (args[2].toLowerCase() == 'none') args[2] = [0, 0];
				if (isNaN(args[2])) {
					let split = args[2].split('\'');
					if (split.length == 1) {
						charFile[args[0]].bio.height = parseFloat(split[0]);
					} else {
						charFile[args[0]].bio.height = [parseFloat(split[0]), parseFloat(split[1].replace('"', ''))];
					}
				} else {
					return message.channel.send('Invalid Height! Please enter in the format `feet/inches` or `meters`.');
				}
				break;
			case "age":
				if (args[2].toLowerCase() == 'none') args[2] = 0;
				if (isNaN(args[2])) return message.channel.send('Invalid age! Please enter a number.');
				charFile[args[0]].bio.age = parseInt(args[2]);
				break;
			default:
				if (!charFile[args[0]].bio.custom) charFile[args[0]].bio.custom = {};
				if (args[2].toLowerCase() == 'none') args[2] = '';
				charFile[args[0]].bio.custom[args[1]] = args[2];
				if (charFile[args[0]].bio.custom[args[1]] == '') delete charFile[args[0]].bio.custom[args[1]];
				break;
		}
		message.react('👍');
		fs.writeFileSync(`${dataPath}/json/${message.guild.id}/characters.json`, JSON.stringify(charFile, null, '    '));
	}
})
