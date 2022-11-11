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
            name: 'remove',
            description: 'Remova algum dos seus arquivos armazenados.',
        })
    }
    run = async (interaction) => {
            con.query(`SELECT * FROM arquivos_armazenados WHERE discord_id = '${interaction.user.id}'`, (err, results) => {
                if(err) return console.log(err)
                interaction.reply({content: 'Procurando...', ephemeral: true})
                if(!results[0]) return interaction.editReply({content: 'Você não tem nenhum arquivo armazenado', ephemeral: true})
                var arr = []
                for (let i = 0; i < results.length; i++) {
                    const element = results[i];
                    arr.push({label: `${element.nome}`,description: `${element.nome}`,value: `${element.id}`,})
                }
                const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('delete_arquivo')
                        .setPlaceholder('Nada selecionado')
                        .addOptions(arr),
                );
                setTimeout(() => {
                    const embed = new Discord.MessageEmbed()
                .setDescription(`Escolha um dos arquivos para deletar`)
                interaction.editReply({content: '.', embeds: [embed], components: [row], ephemeral: true})
                }, 1000)
                
            })
    }
}