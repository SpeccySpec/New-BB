statusList = {
	ohko: {
		name: "One Hit KO",
		desc: '_<Chance>_\nInstantly defeats the foe at a <Chance>% chance.',
		applyfunc: function(message, skill, extra1, extra2, extra3, extra4, extra5) {
			if (parseFloat(extra1) < 0) return message.channel.send("What's the point of using this skill if it never lands?");

			makeExtra(skill, "ohko", [parseFloat(extra1)]);
		}
	}
}

// Make a status type for a skill. "func" should be an array of 1-5 values indicating what the extra does.
function makeStatus(skill, extra, func) {
	if (!skill.statusses) skill.statusses = {};
	if (!skill.statusses[extra]) skill.statusses[extra] = [];

	skill.statusses[extra].push(func);
}

// Checks if the skill has an extra
// just realise we dont need this either
hasStatus = (skill, extra) => {
	if (!skill.statusses) return false;
	if (!skill.statusses[extra]) return false;
	return skill.statusses[extra];
}

// Apply Extra Effects to an existing skill using the extrasList above.
applyStatus = (message, skill, skillExtra, extra1, extra2, extra3, extra4, extra5) => {
	if (!skill.statusses) skill.statusses = {};
	if (!skillExtra || !statusList[skillExtra.toLowerCase()]) return message.channel.send("You're adding an invalid status type! Use the ''liststatus'' command to list all extras.");

	statusList[skillExtra.toLowerCase()].applyfunc(message, skill, extra1, extra2, extra3, extra4, extra5);
	message.react('👍');
	
	/* === OLD EXTRAS HERE FOR REFERENCE ===

	if (statusType === 'status') {
		if (!utilityFuncs.validStatus(extra1)) return msg.channel.send(`${extra1} is an invalid status effect.`);

		skillFile[name].status = extra1.toLowerCase()
		skillFile[name].statuschance = parseInt(extra2)
		skillFile[name].levelLock = 10
	} else if (statusType === 'multistatus') {
		skillFile[name].status = []
		if (utilityFuncs.validStatus(extra1)) skillFile[name].status.push(extra1);
		if (utilityFuncs.validStatus(extra2)) skillFile[name].status.push(extra2);
		if (utilityFuncs.validStatus(extra3)) skillFile[name].status.push(extra3);
		
		if (skillFile[name].status.length <= 0)
			return msg.channel.send('All 3 status effects were invalid.');
		
		skillFile[name].levelLock = 25
	} else if (statusType === 'buff') {
		skillFile[name].buff = extra1.toLowerCase()
		skillFile[name].target = extra2.toLowerCase()
		skillFile[name].buffCount = parseInt(extra3)
		
		if (skillFile[name].buffCount <= 1) {
			delete skillFile[name].buffCount
			skillFile[name].levelLock = 10
		}

		if (skillFile[name].buffCount >= 6) {
			skillFile[name].buffCount = 6
			skillFile[name].levelLock = 60
		}
	} else if (statusType === 'debuff') {
		skillFile[name].debuff = extra1.toLowerCase()
		skillFile[name].target = extra2.toLowerCase()
		skillFile[name].levelLock = 10
	} else if (statusType === 'dualbuff' || statusType === 'dualdebuff') {
		skillFile[name][statusType] = [extra1.toLowerCase(), extra2.toLowerCase()];
		skillFile[name].target = extra3.toLowerCase();
		skillFile[name].levelLock = 40;
	} else if (statusType === 'mimic') {
		skillFile[name].mimic = true;
		skillFile[name].levelLock = 50;
	} else if (statusType === 'clone' || statusType === 'harmonics') {
		skillFile[name].clone = true;
		skillFile[name].levelLock = 50;
	} else if (statusType === 'shield') {
		skillFile[name].shield = extra1.toLowerCase()
		skillFile[name].target = extra2.toLowerCase()
		skillFile[name].levelLock = 25
	} else if (statusType === 'makarakarn' || statusType === 'tetrakarn') {
		skillFile[name][statusType] = true
		skillFile[name].target = extra1.toLowerCase()
		skillFile[name].levelLock = 40
	} else if (statusType === 'trap') {
		skillFile[name].trap = true
		skillFile[name].effect = [extra1.toLowerCase(), extra2.toLowerCase()]
		skillFile[name].levelLock = 30;

		if (extra1.toLowerCase() == "damage") {
			skillFile[name].effect[2] = parseInt(extra2);
			skillFile[name].levelLock = 40
		}
	} else if (statusType === 'weather')
		skillFile[name].weather = extra1.toLowerCase();
	else if (statusType === 'terrain')
		skillFile[name].terrain = extra1.toLowerCase();
	else if (statusType === 'reincarnate') {
		skillFile[name].reincarnate = true;
		skillFile[name].levelLock = 50;
	} else if (statusType === 'chaosstir' || statusType === 'chaos') {
		skillFile[name].chaosStir = true;
		skillFile[name].levelLock = 45;
	} else if (statusType === 'futuresight' || statusType === 'delayed' || statusType === 'future') {
		skillFile[name].futuresight = {
			pow: parseInt(extra1),
			acc: 90,
			type: extra2.toLowerCase(),
			atktype: "magic",
			turns: parseInt(extra3)
		};

		skillFile[name].levelLock = 50;
	} else
		return msg.channel.send('You inputted an invalid status type.');
	*/

	return true;
}