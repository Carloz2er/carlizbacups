const Command = require('../../strucures/command')
const Discord = require('discord.js')
const mysql = require('mysql')
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DBNAME
  })
module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'exemplo',
            description: 'Faça o bot falar alguma coisa.',
        })
    }
    run = async (interaction) => {
            if(!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({content: 'Você nao tem permissão para isso!', ephemeral: true})
            
    }
}