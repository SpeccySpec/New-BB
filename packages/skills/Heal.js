healList = {
	default: {
		name: "Default",
		desc: "_<HP>_\nThe default heal type. Restores HP by <HP>. _Negative values for <HP> will damage the target!_",
		applyfunc: function(message, skill, ...extra) {
			if (!extra[0]) return message.channel.send("You didn't supply anything for <HP>!");
			if (parseInt(extra[0]) == 0) extra[0] = 60;
			
			skill.pow = parseInt(extra[0]);
			makeHeal(skill, "default", [parseInt(extra[0])]);
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			if (!vars[0] || vars[0] === null) return '';

			targ.hp = Math.min(targ.maxhp, targ.hp+vars[0]);
			return `${targ.name}'s HP was restored by ${vars[0]}!`;
		}
	},

	healmp: {
		name: "Heal MP",
		desc: "_<MP>_\nRestores MP by <MP>. _Negative values for <MP> will drain the target!_",
		applyfunc: function(message, skill, ...extra) {
			if (!extra[0]) return message.channel.send("You didn't supply anything for <MP>!");
			makeHeal(skill, "healmp", [parseInt(extra[0])]);
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			targ.mp = Math.min(targ.maxmp, targ.mp+vars[0]);
			return `${targ.name}'s MP was restored by ${vars[0]}!`;
		}
	},

	regenerate: {
		name: "Regenerate",
		desc: "_<HP> <Turns>_\nRestores HP by <HP> over time for <Turns> turns. _Negative values for <HP> will damage the target!_",
		applyfunc: function(message, skill, ...extra) {
			if (!extra[0]) return message.channel.send("You didn't supply anything for <HP>!");
			if (!extra[1]) return message.channel.send("You didn't supply anything for <Turns>!");
			if (parseInt(extra[0]) == 0) extra[0] = 20;
			if (parseInt(extra[0]) == 0) extra[1] = 3;
			makeHeal(skill, "regenerate", [parseInt(extra[0]), parseInt(extra[1])]);
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			targ.regenheal = {
				heal: vars[0],
				turns: vars[1],
				type: "hp"
			}

			return `${targ.name} is surrounded in a lime coloured aura!`;
		}
	},

	invigorate: {
		name: "Invigorate",
		desc: "_<MP> <Turns>_\nRestores MP by <MP> over time for <Turns> turns. _Negative values for <MP> will drain the target!_",
		applyfunc: function(message, skill, ...extra) {
			if (!extra[0]) return message.channel.send("You didn't supply anything for <MP>!");
			if (!extra[1]) return message.channel.send("You didn't supply anything for <Turns>!");
			if (parseInt(extra[0]) == 0) extra[0] = 20;
			if (parseInt(extra[0]) == 0) extra[1] = 3;
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			targ.regenheal = {
				heal: vars[0],
				turns: vars[1],
				type: "mp"
			}

			return `${targ.name} is surrounded in a violet coloured aura!`;
		}
	},

	revive: {
		name: "Revive",
		desc: "_<Amount>_\nRevives the target to 1/<Amount> of their max HP. _Negative values are not permitted._",
		applyfunc: function(message, skill, ...extra) {
			if (!extra[0]) return message.channel.send("You didn't supply anything for <Amount>!");
			if (parseInt(extra[0]) <= 0) return message.channel.send("You can't revive to 0 or less!");
			makeHeal(skill, "revive", [parseInt(extra[0])]);
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			if (targ.hp > 0) return 'But it failed!';

			targ.hp = targ.maxhp/vars[0];
			return `${targ.name} was revived!`;
		}
	},

	recarmdra: {
		name: "Recarmdra",
		desc: "Fully restores party HP and MP, but downs the caster.",
		applyfunc: function(message, skill, ...extra) {
			makeHeal(skill, "recarmdra", [true]);
			return true;
		},
		override: function(char, skill, btl, vars) {
			char.hp = 0;
			for (let i in btl.teams[char.team]) {
				targ.hp = targ.maxhp;
				targ.mp = targ.maxmp;
			}

			return `The party's HP & MP was fully restored, but at the cost of ${char.name}'s sacrifice!`;
		}
	},

	fullheal: {
		name: "Full Heal",
		desc: "Fully restores HP of the target.",
		applyfunc: function(message, skill, ...extra) {
			makeHeal(skill, "fullheal", [true]);
			if (hasHealType(skill, "default")) delete skill.heal["default"];
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			targ.hp = targ.maxhp
			return `${targ.name}'s HP was fully restored!`;
		}
	},

	statusheal: {
		name: "Status Heal",
		desc: "_<Status>_\nCures the target of the specified status. Accepts 'physical', 'mental' and 'all' as statuses.",
		multiple: true,
		diffflag: 0,
		applyfunc: function(message, skill, ...extra) {
			if (!extra[0]) return message.channel.send("You didn't supply anything for <Status>!");
			extra[0] = extra[0].toLowerCase();
			if (extra[0] != 'physical' || extra[0] != 'mental' || extra[0] != 'all') {
				if (!statusEffects.includes(extra[0])) return message.channel.send("That's not a valid status!");
			}
			makeHeal(skill, "statusheal", [extra[0]]);
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			switch(vars[0]) {
				case 'physical':
					if (targ.confusion) delete targ.confusion;

					if (isPhysicalStatus(targ.status)) {
						delete targ.status;
						delete targ.statusturns;
					}

					return `${targ.name} had physical status ailments cured!`;
					break;
			
				case 'mental':
					if (targ.infatuation) delete targ.infatuation;

					if (!isPhysicalStatus(targ.status)) {
						delete targ.status;
						delete targ.statusturns;
					}

					return `${targ.name} had mental status ailments cured!`;
					break;

				case 'all':
					if (targ.confusion) delete targ.confusion;
					if (targ.infatuation) delete targ.infatuation;
					delete targ.status;
					delete targ.statusturns;

					return `${targ.name} had their status ailments cured!`;
					break;
				
				default:
					if (vars[0] === 'confusion') {
						if (targ.confusion) delete targ.confusion;
					} else if (vars[0] === 'infatuation') {
						if (targ.infatuation) delete targ.infatuation;
					} else {
						if (targ.status === vars[0]) {
							delete targ.status;
							delete targ.statusturns;
						}
					}

					return `${targ.name} had their ${vars[0]} status effect cured!`;
			}

			return '...';
		}
	},

	sacrifice: {
		name: "Sacrifice",
		desc: "_{HP}_\nWill reduce the caster's HP to a {HP}.",
		applyfunc: function(message, skill, ...extra) {
			makeHeal(skill, "sacrifice", [extra[0] ? parseInt(extra[0]) : 0]);
			let hasHeal = false;
			for (var i in skill.heal) {
				if (i != "wish" && i != "sacrifice") {
					hasHeal = true;
					break;
				}
			}
			if (!hasHeal) makeHeal(skill, "default", [60]);
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			if (!vars[0])
				char.hp = 0;
			else
				char.hp = vars[0];

			return `${char.name} sacrificed themselves, lowering their HP to ${vars[0]}!`;
		}
	},

	wish: {
		name: "Wish",
		desc: "_<Turns>_\nWill restore after <Turns> turns. _Negative values are not permitted._",
		applyfunc: function(message, skill, ...extra) {
			if (!extra[0]) return message.channel.send("You didn't supply anything for <Turns>!");
			if (parseInt(extra[0]) <= 0) return message.channel.send("You can't wish for 0 or less!");
			makeHeal(skill, "wish", [parseInt(extra[0])]);
			let hasHeal = false
			for (var i in skill.heal) {
				if (i != "sacrifice" && i != "wish") {
					hasHeal = true;
					break;
				}
			}
			if (!hasHeal) makeHeal(skill, "default", [60]);
			return true;
		},
		onuse: function(char, targ, skill, btl, vars) {
			targ.wishheal = vars[0];
			return `${char.name} will experience a healing wish in ${vars[0]} turns.`;
		}
	}
}

// Make a status type for a skill. "func" should be an array of 1-5 values indicating what the extra does.
function makeHeal(skill, extra, func) {
	if (!skill.heal) skill.heal = {};
	if (!skill.heal[extra]) skill.heal[extra] = [];

	if (healList[extra].multiple) {
		if (healList[extra].diffflag) {
			for (i in skill.heal[extra]) {
				if (skill.heal[extra][i][healList[extra].diffflag] === func[healList[extra].diffflag]) {
					skill.heal[extra][i] = func;
					return true;
				}
			}
		}
		skill.heal[extra].push(func);
	} else {
		skill.heal[extra] = func;
	}
}

// Checks if the skill has an extra
// just realise we dont need this either
hasHealType = (skill, extra) => {
	if (!skill.heal) return false;
	if (!skill.heal[extra]) return false;
	return skill.heal[extra];
}

// Apply Extra Effects to an existing skill using the extrasList above.
applyHeal = (message, skill, skillExtra, ...extra) => {
	if (!skill.heal) skill.heal = {};
	if (!skillExtra || !healList[skillExtra.toLowerCase()]) {
		message.channel.send("You're adding an invalid heal type! Use the ''listhealtypes'' command to list all extras.");
		return false;
	}

	if (!healList[skillExtra.toLowerCase()].applyfunc(message, skill, ...extra)) {
		message.channel.send("Something went wrong!");
		return false;
	}
	
	skill.done = true;

	console.log("win")
	return true;
}

buildHeal = (message, args) => {
	let skill = {
		name: args[0],
		type: 'heal',
		cost: args[1],
		costtype: args[2],
		target: args[3],
		originalAuthor: message.author.id
	}

	applyHeal(message, skill, args[4].toLowerCase(), args[5], args[6], args[7], args[8], args[9])
	
	if (skill.done) {
		delete skill.done;
		return skill;
	} else {
		return false
	}
}