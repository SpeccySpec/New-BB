﻿///////////////////////////////////
// MAIN SCRIPT FOR BLOOM BATTLER //
// grassimp :) ////////////////////
///////////////////////////////////

//Discord.JS initiation.
const Discord = require('discord.js');
const Voice = require('@discordjs/voice');
const Builders = require('@discordjs/builders');
const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES
	],
	partials: [
		'MESSAGE',
		'CHANNEL',
		'REACTION'
	]
});

// Path to 'data' folder
const dataPath = './data'

// Path to 'packages' folder
const packPath = './Packages'

// Bot Stuff
const utilityFuncs = require(packPath + '/utilityFuncs.js');
const charFuncs = require(packPath + '/charFuncs.js');
const enemyFuncs = require(packPath + '/enemyFuncs.js');
const attackFuncs = require(packPath + '/attackFuncs.js');
const turnFuncs = require(packPath + '/turnFuncs.js');
const skillFuncs = require(packPath + '/skillFuncs.js');

const RF = require(packPath + '/relicFuncs.js');

// Now for specific commands
const makeLoot = require(packPath + '/commands/loot/makeloot.js');
const assignLoot = require(packPath + '/commands/loot/assignloot.js');
const getLoot = require(packPath + '/commands/loot/getloot.js');
const searchLoot = require(packPath + '/commands/loot/searchloots.js');
const listLoot = require(packPath + '/commands/loot/listloots.js');
const deassignLoot = require(packPath + '/commands/loot/deassignloot.js');
const removeLoot = require(packPath + '/commands/loot/removeloot.js');

const registerSkillSteps = require(packPath + '/commands/registerskill.js');

//Canvas, for making custom pictures.
const Canvas = require('canvas');

//FS, for writing files.
const fs = require('fs');

//Request, for requesting files
const request = require('request');

// Voice Shit
const ffmpeg = require('ffmpeg-static');
const ytdl = require('ytdl-core');
const http = require('http');

// Daily Quote - Resets at midnight
let dailyQuote = 'none'

let tempQuote = fs.readFileSync(dataPath+'/dailyquote.txt', {flag: 'as+'});
if (tempQuote && tempQuote != '')
	dailyQuote = tempQuote.toString();

// Daily Skill - Resets at midnight
let dailySkill = 'none'

let tempSkill = fs.readFileSync(dataPath+'/dailyskill.txt', {flag: 'as+'});
if (tempSkill && tempSkill != '')
	dailySkill = tempSkill.toString();

// Midnight Moment
function midnightInMS() {
    return new Date().setHours(24, 0, 0, 0) - new Date().getTime()
}

setTimeout(function() {
	dailyQuote = 'none';
	dailySkill = 'none';

	fs.writeFileSync(dataPath+'/dailyquote.txt', '');
	fs.writeFileSync(dataPath+'/dailyskill.txt', '');

	setTimeout(function() {
		dailyQuote = 'none';
		dailySkill = 'none';

		fs.writeFileSync(dataPath+'/dailyquote.txt', '');
		fs.writeFileSync(dataPath+'/dailyskill.txt', '');
	}, midnightInMS());
}, midnightInMS());

// Other Required Shit
require('dotenv').config();
const { isBooleanObject } = require('util/types');

// Games
let doGSM = false;

// Blacksmith
let blackSmith = {}

// Elements
const Elements = [
    "strike",
    "slash",
    "pierce",
    "fire",
    "water",
    "ice",
    "electric",
    "wind",
    "earth",
    "grass",
    "psychic",
    "poison",
    "nuclear",
    "metal",
    "curse",
    "bless",
	"gravity",
	"sound",
    "almighty",

    "status",
    "heal",
    "passive"
]

const elementEmoji = {
	strike: "<:strike:877132710370480190>",
	slash: "<:slash:877132710345338960> ",
	pierce: "<:pierce:877132710315950101>",
	
	fire: "<:fire:877132709934301216>",
	water: "<:water:877132710471147571>",
	ice: "<:ice:877132710299181076>",
	electric: "<:electric:877132710194348072>",
	wind: "<:wind:877140815649075241>",
	earth: "<:earth:877140476409577482>",
	grass: "<:grass:877140500036075580>",
	psychic: "<:psychic:877140522530140171>",
	poison: "<:poison:906759861742760016>",
	metal: "<:metal:906748877955268638>",
	curse: "<:curse:906748923354443856>",
	bless: "<:bless:903369721980813322>",
	nuclear: "<:nuclear:906877350447300648>",
	gravity: "🌍",
	sound: "🎵",
	
	almighty: "<:almighty:906748842450509894>",
	
	status: "<:status:906877331711344721>",
	heal: "<:heal:906758309351161907>",
	passive: "<:passive:906874477210648576>"
}

// Item
const itemTypes = [
	"skill",
	"heal",
	"healmp",
	"healhpmp",
	"revive",
	"material",
	"pacify"
]

const itemTypeEmoji = {
	skill: '🎇',

	heal: "🌀",
	healmp: "⭐",
	healhpmp: "🔰",

	revive: "✨",
	material: '🛠',
	pacify: '🎵',
}

// Status Effects
const statusEffects = [
    "burn",
	"bleed",
    "freeze",
    "paralyze",
	"dizzy",
	"sleep",
	"despair",
    "poison",
    "brainwash",
	"fear",
	"rage",
	"ego",
	"silence",
	"dazed",
	"hunger",
	"illness",
	"infatuation",
	"mirror",
	"blind",
	"confusion"
]

const statusEmojis = {
    burn: "🔥",
	bleed: "<:bleed:906903499462307870>",
    freeze: "❄",
    paralyze: "⚡",
	sleep: "💤",
	dizzy: "💫",
	despair: "💦",
    poison: "<:poison:906903499961434132>",
	dizzy: "💫",
    brainwash: "🦆",
	fear: "👁",
	rage: "<:rage:906903500053696532>",
	ego: "🎭",
	silence: '<:silence:905238069207240734>',
	dazed: '✨',
	hunger: '🍪',
	illness: '🤢',
	infatuation: '❣️',
	mirror: '<:mirror:929864689406582784>',
	blind: '🕶️',
	confusion: '☄️'
}

// Enemy Habitats
const enmHabitats = [
	"grasslands",
	"forests",
	"swamps",
	"mountains",
	"caverns",
	"volcanic",
	"icy",
	"unknown"
]

const weathers = [
	"rain",
	"thunder",
	"sunlight",
	"windy",
	"sandstorm",
	"hail"
]

const terrains = [
	"flaming", // 10 damage with 10% chance of burn
	"thunder", // 1.2x to elec
	"grassy",
	"light",
	"psychic",
	"misty",
	"sky",
	"muddy",
	
	// boss specific
	"flooded",
	"swamp",
	"glacial",
	"fairydomain",
	"graveyard",
	"factory",
	"blindingradiance",
	"eternaldarkness"
]

class Command {
	constructor(object) {
		this.desc = object.desc
		this.call = object.func
	}
}

const commands = {}
commands.test = new Command({
	desc: "a",
	func: (message, args) => {
		message.reply("**[DEBUG]**\nThis is a test command.")
	}
})

client.on("messageCreate", (message) => {
	if (!message.content.startsWith("rpg!")) return;
	let args = [...message.content.matchAll(/"([^"]*?)"|[^ ]+/gm)].map(el => el[1] || el[0] || "")
	let command = commands[args.shift()]
	if (!command) {
		message.channel.send("That command does not exist!")
	}
	command.call(message, args)
})