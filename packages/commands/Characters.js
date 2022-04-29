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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (charFile[args[0]]) {
			if (charFile[args[0]].owner != message.author.id) {
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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');
		
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');
		
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');
		
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
		if (!utilityFuncs.inArray(args[1].toLowerCase(), Elements)) return message.channel.send({content: 'Please enter a valid element for **Element!**', embeds: [elementList()]});
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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// Checks
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// Checks
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// Checks
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");
		if (args[1] <= 0 || args[1] > 99) return message.channel.send("Don't even try it.");

		// Actually force the Level
		charFile[args[0]].level = args[1];
		updateStats(charFile[args[0]], message.guild.id, true);
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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// a LOT of checks :(
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// some checks
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// checkie
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

		// ok here goes nothing
		charFile[args[0]].leaderskill = {
			name: args[1],
			type: args[2].toLowerCase()
		}

		switch(args[2].toLowerCase()) {
			case 'boost':
			case 'discount':
			case 'crit':
				if (args[3].toLowerCase() === "magic" || arg[3].toLowerCase() === "physical")
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
				if (!utilityFuncs.inArray(args[3].toLowerCase(), stats)) return message.channel.send({content: `${args[3]} is an invalid stat!`);
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
		if (args[0] == "" || args[0] == " ") return message.channel.send('Invalid character name! Please enter an actual name.');

		// checkie
		let charFile = setUpFile(`${dataPath}/json/${message.guild.id}/characters.json`);
		if (!charFile[args[0]]) return message.channel.send('Nonexistant Character.');
		if (!utilityFuncs.RPGBotAdmin(message.author.id) && charFile[args[0]].owner != message.author.id) return message.channel.send("You don't own this character!");

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

				return message.channel.send(str)
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