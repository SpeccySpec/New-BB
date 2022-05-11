function statusDesc(skillDefs) {
	var finalText = '';
	
	if (hasStatus(skillDefs, 'buff')) {
		let buffs = {
			buffs: {},
			debuffs: {},
		}

		for (let i = 0; i < skillDefs.statusses.buff.length; i++) {
			if (skillDefs.statusses.buff[i][1] > 0) {
				if (!buffs.buffs[skillDefs.statusses.buff[i][2]]) buffs.buffs[skillDefs.statusses.buff[i][2]] = {};
				if (!buffs.buffs[skillDefs.statusses.buff[i][2]][skillDefs.statusses.buff[i][0]]) buffs.buffs[skillDefs.statusses.buff[i][2]][skillDefs.statusses.buff[i][0]] = 0;
				buffs.buffs[skillDefs.statusses.buff[i][2]][skillDefs.statusses.buff[i][0]] += Math.abs(skillDefs.statusses.buff[i][1]);
			} else {
				if (!buffs.debuffs[skillDefs.statusses.buff[i][2]]) buffs.debuffs[skillDefs.statusses.buff[i][2]] = {};
				if (!buffs.debuffs[skillDefs.statusses.buff[i][2]][skillDefs.statusses.buff[i][0]]) buffs.debuffs[skillDefs.statusses.buff[i][2]][skillDefs.statusses.buff[i][0]] = 0;
				buffs.debuffs[skillDefs.statusses.buff[i][2]][skillDefs.statusses.buff[i][0]] += Math.abs(skillDefs.statusses.buff[i][1]);
			}
		}

		let buffArray = []
		let fullBuffArray = []
		if (Object.keys(buffs.buffs).length > 0) {
			for (let i in buffs.buffs) {
				for (let j in buffs.buffs[i]) {
					buffArray = []
					for (let k in buffs.buffs[i]) {
						buffArray.push([k, buffs.buffs[i][k]])
					}
				}
				buffArray.sort(function(a, b) {
					return b[1] - a[1];
				})

				fullBuffArray.push([i, buffArray])
				fullBuffArray.sort(function(a, b) {
					return b[0] - a[0];
				})
			}
		}

		for (i in fullBuffArray) {
			if (fullBuffArray[i][0] == 100) finalText += `Buffs `
			else finalText += `Has a **${fullBuffArray[i][0]}%** chance to buff `

			for (let j in fullBuffArray[i][1]) {
				finalText += ` **${fullBuffArray[i][1][j][0].toUpperCase()}**`;

				let sameValue = 0;
				for (let k in fullBuffArray[i][1]) {
					if (k <= j) continue
					if (fullBuffArray[i][1][j][1] == fullBuffArray[i][1][k][1]) sameValue++;
				}
				if (sameValue == 0) finalText += ` by ${fullBuffArray[i][1][j][1]} stage${fullBuffArray[i][1][j][1] > 1 ? 's' : ''}`;

				if (sameValue != 0) {
					if (sameValue == 1) finalText += ` and `;
					else finalText += `, `;
				} else {
					if (j < fullBuffArray[i][1].length - 2) finalText += `, `;
					else if (j == fullBuffArray[i][1].length - 2) finalText += ` and `;
					else finalText += `.`;
				}
			}
			finalText += `\n`;
		}

		buffArray = []
		fullBuffArray = []
		if (Object.keys(buffs.debuffs).length > 0) {
			for (let i in buffs.debuffs) {
				for (let j in buffs.debuffs[i]) {
					buffArray = []
					for (let k in buffs.debuffs[i]) {
						buffArray.push([k, buffs.debuffs[i][k]])
					}
				}
				buffArray.sort(function(a, b) {
					return b[1] - a[1];
				})

				fullBuffArray.push([i, buffArray])
				fullBuffArray.sort(function(a, b) {
					return b[0] - a[0];
				})
			}
		}

		for (i in fullBuffArray) {
			if (fullBuffArray[i][0] == 100) finalText += `Debuffs `
			else finalText += `Has a **${fullBuffArray[i][0]}%** chance to debuff `

			for (let j in fullBuffArray[i][1]) {
				finalText += ` **${fullBuffArray[i][1][j][0].toUpperCase()}**`;

				let sameValue = 0;
				for (let k in fullBuffArray[i][1]) {
					if (k <= j) continue
					if (fullBuffArray[i][1][j][1] == fullBuffArray[i][1][k][1]) sameValue++;
				}
				if (sameValue == 0) finalText += ` by ${fullBuffArray[i][1][j][1]} stage${fullBuffArray[i][1][j][1] > 1 ? 's' : ''}`;

				if (sameValue != 0) {
					if (sameValue == 1) finalText += ` and `;
					else finalText += `, `;
				} else {
					if (j < fullBuffArray[i][1].length - 2) finalText += `, `;
					else if (j == fullBuffArray[i][1].length - 2) finalText += ` and `;
					else finalText += `.`;
				}
			}
			finalText += `\n`;
		}
	}
	
	if (hasStatus(skillDefs, 'weather') || hasStatus(skillDefs, 'terrain')) {
		finalText += `Changes`;

		if (hasStatus(skillDefs, 'weather')) {
			finalText += ` **Weather** to ${skillDefs.statusses.weather[0]}`;
		}

		if (hasStatus(skillDefs, 'terrain')) {
			if (hasStatus(skillDefs, 'weather')) finalText += ` and`;
			
			finalText += ` **Terrain** to ${skillDefs.statusses.terrain[0]}`;
		}
		finalText += `.\n`;
	}

	if (hasStatus(skillDefs, 'reincarnate')) {
		finalText += `Summons **an undead ally**.\n` 
	}

	if (hasStatus(skillDefs, 'mimic')) {
		finalText += `Mimics **an ally or foe** for **${skillDefs.statusses.mimic[0][0]}** turns.\n`
	}

	if (hasStatus(skillDefs, 'clone')) {
		finalText += `Clones **the caster**.\n`
	}

	if (hasStatus(skillDefs, 'makarakarn') || hasStatus(skillDefs, 'tetrakarn') || hasStatus(skillDefs, 'shield')) {
		finalText += `Surrounds the target with`;

		if (hasStatus(skillDefs, 'makarakarn')) {
			finalText += ` **Makarakarn**`;
		}
		if (hasStatus(skillDefs, 'tetrakarn')) {
			if (hasStatus(skillDefs, 'makarakarn') && !hasStatus(skillDefs, 'shield')) finalText += ` and `;
			else if (hasStatus(skillDefs, 'makarakarn') && hasStatus(skillDefs, 'shield')) finalText += `, `;

			finalText += ` **Tetrakarn**`;
		}
		if (hasStatus(skillDefs, 'shield')) {
			if (hasStatus(skillDefs, 'makarakarn') || hasStatus(skillDefs, 'tetrakarn')) finalText += ` and `;
			finalText += ` a **shield named ${skillDefs.statusses.shield[0]}**`;
		}
		finalText += `.\n`;
	}

	if (hasStatus(skillDefs, 'trap')) {
		finalText += `Sets up a **trap**.\n`
	}

	if (hasStatus(skillDefs, 'futuresight')) {
		finalText += `Strieks with a **${skillDefs.statusses.futuresight[0][0].type}** attack in **${skillDefs.statusses.futuresight[0][0].turns}** turns.\n`
	}

	if (hasStatus(skillDefs, 'analyze') || hasStatus(skillDefs, 'fullanalyse')) {
		if (hasStatus(skillDefs, 'fullanalyze')) finalText += `Fully Analyzes`
		else finalText += `Analyzes`
		finalText += ` the target.\n`
	}

	if (hasStatus(skillDefs, 'shieldbreak')) {
		finalText += `Breaks the target's **${skillDefs.statusses.shieldbreak[0][0].charAt(0).toUpperCase() + skillDefs.statusses.shieldbreak[0][0].slice(1)}${skillDefs.statusses.shieldbreak[0][0].includes('ra') ? 'karn' : ''}**.\n`
	}

	if (hasStatus(skillDefs, 'dekunda')) {
		finalText += `Removes buffs of the target.\n`
	}

	if (hasStatus(skillDefs, 'heartswap')) {
		finalText += `Swaps caster's **stat chances** with the target's.\n`
	}

	if (hasStatus(skillDefs, 'pacifystatus')) {
		finalText += `Pacifies the target with **${skillDefs.statusses.pacifystatus[0][0]}**${skillDefs.statusses.pacifystatus[0][1] >= 100 ? '' : ` by ${skillDefs.statusses.pacifystatus[0][1]}%`}.\n`
	}

	if (hasStatus(skillDefs, 'batonpass')) {
		finalText += `Switch out caster **with someone in backup**.\n`
	}

	if (hasStatus(skillDefs, 'powercharge') || hasStatus(skillDefs, 'mindcharge')) {
		finalText += `Boosts`
		if (hasStatus(skillDefs, 'powercharge')) finalText += ` **Physical** damage by ${skillDefs.statusses.powercharge[0]}x for one turn`;

		if (hasStatus(skillDefs, 'mindcharge')) {
			if (hasStatus(skillDefs, 'powercharge')) finalText += ` and`;
			finalText += ` **Magic** damage by ${skillDefs.statusses.mindcharge[0]}x for one turn`;
		}
		finalText += `.\n`
	}

	if (hasStatus(skillDefs, 'orgiamode')) {
		finalText += `Modifies caster's ATK and MAG by **${skillDefs.statusses.orgiamode[0][0]}**x and END by **${skillDefs.statusses.orgiamode[0][1]}**x for **${skillDefs.statusses.orgiamode[0][2]}** turns. Falls asleep afterwards.\n`
	}

	if (hasStatus(skillDefs, 'chaosstir')) {
		finalText += `Attack back when hit, with a **${skillDefs.statusses.chaosstir[0][1]}%** accuracy attack with **${skillDefs.statusses.chaosstir[0][0]}x** power.\n`
	}
	return finalText;
}

function passiveDesc(skillDefs) {
	var finalText = `Passive Type: **${Object.keys(skillDefs.passive).join(', ')}**\n`;
	return finalText;
}

function atkDesc(skillDefs, settings) {
	var finalText = '';

	if (hasExtra(skillDefs, 'metronome')) {
		finalText += 'Uses a **randomly defined skill**.\n';
	} else if (hasExtra(skillDefs, 'copyskill')) {
		finalText += `Copies a **random skill of caster's team**.\n`;
	} else {
		if (hasExtra(skillDefs, 'affinitypow'))
			finalText += `Affected by **<:passive:906874477210648576>SpiritCharge** or **<:passive:906874477210648576>Teamwork**, by **${skillDefs.extras.affinitypow[0]} power**.\n`;

		if (hasExtra(skillDefs, 'needlessthan')) {
			let extraSom = ''
			switch (skillDefs.extras.needlessthan[0][1]) {
				case 'hp':
					extraSom = ' HP';
					break;
				case 'mp':
					extraSom = ' MP';
					break;
				case 'lb':
					if (settings.mechanics.limitbreaks) extraSom = ' LB';
					else extraSom = ' MP';
					break;
				case 'money':
					extraSom = ` of Team's Money`;
					break;
				case 'hppercent':
					extraSom = '% of the user\'s Max HP';
					break;
				case 'mppercent':
					extraSom = '% of the user\'s Max MP';
					break;
				case 'lbpercent':
					if (settings.mechanics.limitbreaks) extraSom = '% of the user\'s Max LB';
					else extraSom = '% of the user\'s Max MP';
					break;
				case 'moneypercent':
					extraSom = '% of the user Team\'s Money';
					break;
			}
			finalText += `Needs less than **${skillDefs.extras.needlessthan[0][0]}${extraSom}** to use.\n`;
		}

		if (hasExtra(skillDefs, 'sacrifice'))
			finalText += `${skillDefs.extras.sacrifice[0] <= 0 ? `**Sacrifices the caster**` : `Leaves the caster's health at **${skillDefs.extras.sacrifice[0]}**`}.\n`;

		if (hasExtra(skillDefs, 'stealmp'))
			finalText += `Steals MP from the target instead of dealing damage.\n`;

		if (hasExtra(skillDefs, 'takemp'))
			finalText += `Takes **${skillDefs.extras.takemp[0]} MP** from the target.\n`;

		if (hasExtra(skillDefs, 'drain'))
			finalText += `Drains **1/${skillDefs.extras.drain[0]} of the damage**.\n`;

		if (hasExtra(skillDefs, 'steal'))
			finalText += `Has a **${skillDefs.extras.steal[0][0]}%** chance of stealing **${skillDefs.extras.steal[0][1]}** of the target team's items.\n`;

		if (hasExtra(skillDefs, 'buff')) {
			let buffs = {
				buffs: {},
				debuffs: {},
			}

			for (let i = 0; i < skillDefs.extras.buff.length; i++) {
				if (skillDefs.extras.buff[i][1] > 0) {
					if (!buffs.buffs[skillDefs.extras.buff[i][2]]) buffs.buffs[skillDefs.extras.buff[i][2]] = {};
					if (!buffs.buffs[skillDefs.extras.buff[i][2]][skillDefs.extras.buff[i][0]]) buffs.buffs[skillDefs.extras.buff[i][2]][skillDefs.extras.buff[i][0]] = 0;
					buffs.buffs[skillDefs.extras.buff[i][2]][skillDefs.extras.buff[i][0]] += Math.abs(skillDefs.extras.buff[i][1]);
				} else {
					if (!buffs.debuffs[skillDefs.extras.buff[i][2]]) buffs.debuffs[skillDefs.extras.buff[i][2]] = {};
					if (!buffs.debuffs[skillDefs.extras.buff[i][2]][skillDefs.extras.buff[i][0]]) buffs.debuffs[skillDefs.extras.buff[i][2]][skillDefs.extras.buff[i][0]] = 0;
					buffs.debuffs[skillDefs.extras.buff[i][2]][skillDefs.extras.buff[i][0]] += Math.abs(skillDefs.extras.buff[i][1]);
				}
			}

			let buffArray = []
			let fullBuffArray = []
			if (Object.keys(buffs.buffs).length > 0) {
				for (let i in buffs.buffs) {
					for (let j in buffs.buffs[i]) {
						buffArray = []
						for (let k in buffs.buffs[i]) {
							buffArray.push([k, buffs.buffs[i][k]])
						}
					}
					buffArray.sort(function(a, b) {
						return b[1] - a[1];
					})

					fullBuffArray.push([i, buffArray])
					fullBuffArray.sort(function(a, b) {
						return b[0] - a[0];
					})
				}
			}

			for (i in fullBuffArray) {
				if (fullBuffArray[i][0] == 100) finalText += `Buffs `
				else finalText += `Has a **${fullBuffArray[i][0]}%** chance to buff `

				for (let j in fullBuffArray[i][1]) {
					finalText += ` **${fullBuffArray[i][1][j][0].toUpperCase()}**`;

					let sameValue = 0;
					for (let k in fullBuffArray[i][1]) {
						if (k <= j) continue
						if (fullBuffArray[i][1][j][1] == fullBuffArray[i][1][k][1]) sameValue++;
					}
					if (sameValue == 0) finalText += ` by ${fullBuffArray[i][1][j][1]} stage${fullBuffArray[i][1][j][1] > 1 ? 's' : ''}`;

					if (sameValue != 0) {
						if (sameValue == 1) finalText += ` and `;
						else finalText += `, `;
					} else {
						if (j < fullBuffArray[i][1].length - 2) finalText += `, `;
						else if (j == fullBuffArray[i][1].length - 2) finalText += ` and `;
						else finalText += `.`;
					}
				}
				finalText += `\n`;
			}

			buffArray = []
			fullBuffArray = []
			if (Object.keys(buffs.debuffs).length > 0) {
				for (let i in buffs.debuffs) {
					for (let j in buffs.debuffs[i]) {
						buffArray = []
						for (let k in buffs.debuffs[i]) {
							buffArray.push([k, buffs.debuffs[i][k]])
						}
					}
					buffArray.sort(function(a, b) {
						return b[1] - a[1];
					})

					fullBuffArray.push([i, buffArray])
					fullBuffArray.sort(function(a, b) {
						return b[0] - a[0];
					})
				}
			}

			for (i in fullBuffArray) {
				if (fullBuffArray[i][0] == 100) finalText += `Debuffs `
				else finalText += `Has a **${fullBuffArray[i][0]}%** chance to debuff `

				for (let j in fullBuffArray[i][1]) {
					finalText += ` **${fullBuffArray[i][1][j][0].toUpperCase()}**`;

					let sameValue = 0;
					for (let k in fullBuffArray[i][1]) {
						if (k <= j) continue
						if (fullBuffArray[i][1][j][1] == fullBuffArray[i][1][k][1]) sameValue++;
					}
					if (sameValue == 0) finalText += ` by ${fullBuffArray[i][1][j][1]} stage${fullBuffArray[i][1][j][1] > 1 ? 's' : ''}`;

					if (sameValue != 0) {
						if (sameValue == 1) finalText += ` and `;
						else finalText += `, `;
					} else {
						if (j < fullBuffArray[i][1].length - 2) finalText += `, `;
						else if (j == fullBuffArray[i][1].length - 2) finalText += ` and `;
						else finalText += `.`;
					}
				}
				finalText += `\n`;
			}
		}

		if (hasExtra(skillDefs, 'powerbuff')) {
			let powerbuffs = {}
			for (let i in skillDefs.extras.powerbuff) {
				for (let j in skillDefs.extras.powerbuff[i]) {
					if (j % 2 == 0) {
						if (!powerbuffs[skillDefs.extras.powerbuff[i][j]]) powerbuffs[skillDefs.extras.powerbuff[i][j]] = 0;
					} else {
						powerbuffs[skillDefs.extras.powerbuff[i][j-1]] += skillDefs.extras.powerbuff[i][j];
					}
				}
			}
			finalText += `Increases in power with`
			for (let i in powerbuffs) {
				finalText += ` **${i.toUpperCase()}** buffs`;

				let sameValue = 0;
				for (let j in powerbuffs) {
					if (i == j) continue
					if (powerbuffs[i] == powerbuffs[j]) sameValue++;
				}
				if (sameValue == 0) finalText += ` up to **${powerbuffs[i]}%**`;

				if (sameValue != 0) {
					if (sameValue == 1) finalText += ` and`;
					else finalText += `,`;
				} else {
					if (i < Object.keys(powerbuffs).length - 2) finalText += `,`;
					else if (i == Object.keys(powerbuffs).length - 2) finalText += ` and`;
					else finalText += `.`;
				}
			}
			finalText += `\n`;
		}

		if (hasExtra(skillDefs, 'healverse') || hasExtra(skillDefs, 'powerverse') || hasExtra(skillDefs, 'spreadverse')) {
			finalText += `Surrounds the target with a `;
			if (hasExtra(skillDefs, 'healverse')) {
				finalText += `**healing aura** for **${skillDefs.extras.healverse[0][1]}** turns`;
			}
			if (hasExtra(skillDefs, 'powerverse')) {
				if (hasExtra(skillDefs, 'healverse') && !hasExtra(skillDefs, 'powerverse')) finalText += ` and a`;
				else if (hasExtra(skillDefs, 'healverse') && hasExtra(skillDefs, 'powerverse')) finalText += `, a`;

				finalText += ` **power aura** for **${skillDefs.extras.powerverse[0][1]}** turns`;
			}
			if (hasExtra(skillDefs, 'spreadverse')) {
				if (hasExtra(skillDefs, 'healverse') || hasExtra(skillDefs, 'powerverse')) finalText += ` and a`;

				finalText += ` **spread aura** for **${skillDefs.extras.spreadverse[0][1]}** turns`;
			}
			finalText += `.\n`;
		}

		if (hasExtra(skillDefs, 'lonewolf'))
			finalText += `Power is multiplied by ${skillDefs.extras.lonewolf[0]}x if **the user is alone or the last one standing**.\n`;

		if (hasExtra(skillDefs, 'heavenwrath'))
			finalText += `Power is multiplied by ${skillDefs.extras.heavenwrath[0]}x if **not alone, and all allies are not down**.\n`;

		if (hasExtra(skillDefs, 'rest'))
			finalText += `Caster **must recharge for a turn**.\n`;

		if (hasExtra(skillDefs, 'feint'))
			finalText += `**Bypasses shielding skills**.\n`;

		if (hasExtra(skillDefs, 'statcalc'))
			finalText += `Uses caster's **${skillDefs.extras.statcalc[0].toString().toUpperCase()}** for measuring damage.\n`;

		if (hasExtra(skillDefs, 'hpcalc') || hasExtra(skillDefs, 'mpcalc')) {
			finalText += `Damage boosted or nerfed with`

			if (hasExtra(skillDefs, 'hpcalc')) {
				finalText += ` caster's **current HP** up to **${skillDefs.extras.hpcalc[0]}%**`
			}

			if (hasExtra(skillDefs, 'mpcalc')) {
				if (hasExtra(skillDefs, 'hpcalc')) finalText += ` and from`

				finalText += ` caster's **current MP** up to **${skillDefs.extras.mpcalc[0]}%**`
			}
			finalText += `.\n`;
		}

		if (hasExtra(skillDefs, 'forcetech')) {
			let techs = []
			for (let i in skillDefs.extras.forcetech) {
				for (let j in skillDefs.extras.forcetech[i]) {
					techs.push(skillDefs.extras.forcetech[i][j])
				}
			}

			techs.sort(function(a, b) {
				return b - a;
			})
			techset = new Set(techs)
			techs = Array.from(techset)
			console.log(techs)
			techs.filter((value) => value != null)

			finalText += `Forces techs from **${techs.join(', ')}**.\n`;
		}

		if (hasExtra(skillDefs, 'forceformula')) {
			finalText += `Forces to use the **${skillDefs.extras.forceformula[0][0].charAt(0).toUpperCase() + skillDefs.extras.forceformula[0][0].slice(1)}**${skillDefs.extras.forceformula[0][0] == 'custom' ? `\`${skillDefs.extras.forceformula[0][1]}\`` : ''} formula.\n`;
		}

		if (hasExtra(skillDefs, 'rollout')) {
			finalText += `Forced to repeat, boosting power by **${skillDefs.extras.rollout[0][0]}%** until **${skillDefs.extras.rollout[0][1]}x** pow is reached or for **${skillDefs.extras.rollout[0][2]}** turns.\n`;
		}

		if (hasExtra(skillDefs, 'resistremove')) {
			finalText += `Removes resisting, blocking, draining and repelling affinities to **${skillDefs.extras.resistremove[0][0].charAt(0).toUpperCase() + skillDefs.extras.resistremove[0][0].slice(1)}**.\n`;
		}

		if (hasExtra(skillDefs, 'sustain') || hasExtra(skillDefs, 'reverse') || hasExtra(skillDefs, 'powhit') ) {
			finalText += `\n**Multi-hit Properties:**\n`;

			if (hasExtra(skillDefs, 'sustain')) {
				finalText += `- Does not decreate in power with hits.\n`;
			}
			if (hasExtra(skillDefs, 'reverse')) {
				finalText += `- Gains in power with hits.\n`;
			}
			if (hasExtra(skillDefs, 'powhit')) {
				let powhits = []
				for (let i in skillDefs.extras.powhit) {
					for (let j in skillDefs.extras.powhit[i]) {
						powhits.push(skillDefs.extras.powhit[i][j])
					}
				}
				powSet = new Set(powhits)
				powhits = Array.from(powSet)
				powhits.sort(function(a, b) {
					return b[0] - a[0];
				})
				for (let i in powhits) {
					if (typeof powhits[i] == 'object' || powhits[i] == null) powhits[i] = ''
				}
				powhits = powhits.filter((x) => x != '')

				finalText += `- ${powhits.length > 1 ? 'Hits' : 'Hit'} **${powhits.join(', ')}** increase${powhits.length > 1 ? '' : 's'} in power.\n`;
			}
		}
	}
	
	return finalText;
}

skillDesc = (skillDefs, skillName, server) => {
	let userTxt = ''
	if (skillDefs.originalAuthor) {
		if (skillDefs.originalAuthor === 'Default')
			userTxt = 'Default/Official';
		else {
			let user = client.users.fetch(skillDefs.originalAuthor)
			userTxt = user.username
		}
	} else
		userTxt = 'Default/Official';

	let type = ''
	if (typeof skillDefs.type === 'string')
		type = `${elementEmoji[skillDefs.type]}`;
	else if (typeof skillDefs.type === 'object') {
		for (const i in skillDefs.type) type += `${elementEmoji[skillDefs.type[i]]}`;
	}

	let color = elementColors[(typeof skillDefs.type === 'string') ? skillDefs.type : skillDefs.type[0]];

	let DiscordEmbed = new Discord.MessageEmbed()
		.setColor(color)
		.setTitle(`${type}${skillDefs.name ? skillDefs.name : skillName} *(${userTxt})*`)
	
	
	let settings = setUpSettings(server);
	var finalText = ``;
	if (skillDefs.type != "status" && skillDefs.type != "passive") {
		if (hasExtra(skillDefs, 'ohko') && skillDefs.type != "heal")
			finalText += 'Defeats the foe in **one shot**!';
		else {
			if (skillDefs.type === 'heal') {
				if (hasHealType(skillDefs, 'fullheal')) finalText += '**Fully heals**\n';

				if (hasHealType(skillDefs, 'default')) finalText += `Heals **around ${skillDefs.heal.default[0]} HP**\n`;
				if (hasHealType(skillDefs, 'healmp')) finalText += `Heals **around ${skillDefs.heal.healmp[0]} MP**\n`;

				if (hasHealType(skillDefs, 'regenerate')) finalText += `Regenerates **around ${skillDefs.heal.regenerate[0][0]} HP** for **${skillDefs.heal.regenerate[0][1]} turns**\n`;
				if (hasHealType(skillDefs, 'invigorate')) finalText += `Regenerates **around ${skillDefs.heal.invigorate[0][0]} MP** for **${skillDefs.heal.invigorate[0][1]} turns**\n`;

				if (hasHealType(skillDefs, 'revive')) finalText += `**Revives** the target to 1/${skillDefs.heal.revive[0]} of their max HP\n`;

				if (hasHealType(skillDefs, 'statusheal')) finalText += `Cures **${skillDefs.heal.statusheal[0]} ailments**\n`;
				
				if (hasHealType(skillDefs, 'sacrifice')) finalText += `${skillDefs.heal.sacrifice[0] > 0 ? `**Leaves the caster's health at ${skillDefs.heal.sacrifice[0]}**` : '**Sacrifices the caster**'}\n`;
				
				if (hasHealType(skillDefs, 'wish')) finalText += `Heals after **${skillDefs.heal.wish[0]} turns**\n`;

				finalText = finalText.slice(0, -1);
			} else
				finalText += `Has **${skillDefs.pow}** Power`;
		}

		if (skillDefs.hits && skillDefs.hits > 1 && skillDefs.type != "heal" && !hasExtra(skillDefs, 'ohko')) 
			finalText += ` and hits **${skillDefs.hits}** times.`;

		finalText += "\n";
	}

	switch(skillDefs.target) {
		case "allopposing":
			finalText += "Targets **all foes**.\n";
			break;
		case "allallies":
			finalText += "Targets **all allies**.\n";
			break;
		case "ally":
			finalText += "Targets **an ally**.\n";
			break;
		case "everyone":
			finalText += "Targets **all fighters** in-battle.\n";
			break;
		case "caster":
			finalText += "Targets **the user**.\n";
			break;
		case "random":
			finalText += "Targets a **random fighter** in-battle.\n";
			break;
		case "randomopposing":
			finalText += "Targets a **random opponent** in-battle.\n";
			break;
		case "spreadopposing":
			finalText += "Targets **one opponent and spreads to two surrounding**.\n";
			break;
		case "spreadallies":
			finalText += "Targets **an ally and spreads to two surrounding**.\n";
			break;
		default:
			finalText += "Targets **one foe**.\n";
	}

	if (skillDefs.cost && skillDefs.costtype) {
		switch(skillDefs.costtype) {
			case "hp":
				finalText += `Costs **${skillDefs.cost}HP**.\n`;
				break;
			case "hppercent":
				finalText += `Costs **${skillDefs.cost}% of the user's Max HP**.\n`;
				break;
			case "mppercent":
				finalText += `Costs **${skillDefs.cost}% of the user's Max MP**.\n`;
				break;
			case "money":
				finalText += `Costs **${skillDefs.cost} of the team's money**.\n`;
				break;
			case "moneypercent":
				finalText += `Costs **${skillDefs.cost}% of the team's money**.\n`;
				break;
			case "lb":
				if (settings.mechanics.limitbreaks) finalText += `Costs **${skillDefs.cost}LB**.\n`;
				else finalText += `Costs **${skillDefs.cost}MP**.\n`;
				break;
			case "lbpercent":
				if (settings.mechanics.limitbreaks) finalText += `Costs **${skillDefs.cost}% of LB**.\n`;
				else finalText += `Costs **${skillDefs.cost}% of the user's Max MP**.\n`;
				break;
			default:
				finalText += `Costs **${skillDefs.cost}MP**.\n`;
		}
	}
	
	if (skillDefs.acc && skillDefs.type != "heal" && skillDefs.type != "passive")
		finalText += `Has **${skillDefs.acc}%** Accuracy.\n`;

	if (hasExtra(skillDefs, 'drain') && skillDefs.type != "heal") {
		if (skillDefs.drain > 1) {
			finalText += `Drains 1/${skillDefs.drain} of damage dealt.\n`;
		} else {
			finalText += `Drains all damage dealt.\n`;
		}
	}

	if (skillDefs.crit && skillDefs.type != "heal" && skillDefs.type != "status" && skillDefs.type != "passive")
		finalText += `**${skillDefs.crit}%**<:crit:876905905248145448>\n`;

	if (skillDefs.status) {
		if (typeof skillDefs.status === 'object') {
			if (skillDefs.statuschance) {
				finalText += `Has a **${skillDefs.statuschance}%** chance of inflicting either `;
			} else if (!skillDefs.statuschance || skillDefs.statuschance >= 100) {
				finalText += '**Guaranteed** to inflict either ';
			}

			for (const i in skillDefs.status) {
				finalText += `**${statusEmojis[skillDefs.status[i]]}${skillDefs.status[i]}**`
				if (i == skillDefs.status.length-2)
					finalText += ' or '
				else if (i >= skillDefs.status.length-1)
					finalText += '.\n'
				else
					finalText += ', '
			}
		} else if (skillDefs.status !== "none" && skillDefs.type != "heal") {
			if (skillDefs.statuschance) {
				finalText += `Has a **${skillDefs.statuschance}%** chance of inflicting **${statusEmojis[skillDefs.status]}${skillDefs.status}**.\n`;
			} else if (!skillDefs.statuschance || skillDefs.statuschance >= 100) {
				finalText += `Guaranteed to inflict **${statusEmojis[skillDefs.status]}${skillDefs.status}**.\n`;
			}
		}
	}

	if (skillDefs.type === 'status') {
		finalText += statusDesc(skillDefs)
	} else if (skillDefs.type === 'passive') {
		finalText += passiveDesc(skillDefs)
	} else if (skillDefs.type != 'passive') {
		finalText += atkDesc(skillDefs, settings)
	}

	if (skillDefs.atktype) {
		var attackArray = skillDefs.atktype.split('');
		attackArray[0] = attackArray[0].toUpperCase()
		
		var attackString = attackArray.join('');
		finalText += `**${attackString}** attack.\n`;
	}

	if (skillDefs.preskills) {
		let preskillText = '```diff\n'
		for (const i in skillDefs.preskills) {
			preskillText += `- ${skillFile[skillDefs.preskills[i][0]].name} (${skillDefs.preskills[i][0]}), Lv${skillDefs.preskills[i][1]}\n`
		}
		preskillText += '```\n'

		DiscordEmbed.fields.push({name: 'Pre Skills:', value: preskillText, inline: false})
	}

	if (skillDefs.evoskills) {
		let evoskilltext = '```diff\n'
		for (const i in skillDefs.evoskills) {
			evoskilltext += `+ ${skillFile[skillDefs.evoskills[i][0]].name} (${skillDefs.evoskills[i][0]}), Lv${skillDefs.evoskills[i][1]}\n`
		}
		evoskilltext += '```\n'

		DiscordEmbed.fields.push({name: 'Evo Skills:', value: evoskilltext, inline: false})
	}

	if (skillDefs.levellock) finalText += skillDefs.levellock != 'unobtainable' ? `🔒 *Skill Locked until level **${skillDefs.levellock}***\n` : '🔒 *Skill Unobtainable*\n';

	if (skillDefs.desc) DiscordEmbed.fields.push({name: 'Description:', value: skillDefs.desc, inline: false})

	var charFile = setUpFile(`${dataPath}/json/${server}/characters.json`)
	var enmFile = setUpFile(`${dataPath}/json/${server}/enemies.json`)
	
	var knownBy = ""

	for (const i in charFile) {
		for (const k in charFile[i].skills) {
			if (!charFile[i].hidden && charFile[i].skills[k] == skillName) {
				if (knownBy != "") knownBy += ", ";
				knownBy += `${i}`
			}
		}
	}

	for (const i in enmFile[server]) {
		if (enemyFuncs.encounteredEnemy(i, server)) {
			for (const k in enmFile[server][i].skills) {
				if (enmFile[server][i].skills[k] == skillName) {
					if (knownBy != "") knownBy += ", ";
					knownBy += `${i}`
				}
			}
		}
	}

	if (knownBy != "") DiscordEmbed.fields.push({name: 'Known By:', value: knownBy, inline: false})

	DiscordEmbed.setDescription(finalText ?? 'Invalid Description :(')
	return DiscordEmbed;
}

module.exports = {skillDesc}