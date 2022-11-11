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
            name: 'planos',
            description: 'Veja os planos disponiveis.',
        })
    }
    run = async (interaction) => {
            const embed = new Discord.MessageEmbed()
            .setTitle("Planos")
            .setDescription("Plano free\nMáximo de armazenamento: 1GB \n Limitação de Upload: 250MB\n\n Plano Ouro: \nMáximo de armazenamento: 50GB \n Limitação de Upload: 1GB\n Preço: R$8,00\n\nPlano Cloud: \nMáximo de armazenamento: 100GB \n Limitação de Upload: Ilimitado\n Preço: R$16,00\n\n")
            interaction.reply({embeds: [embed]})
    }
}