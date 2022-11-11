const Event = require('../../strucures/event')
const Discord = require('discord.js')
const fs = require('fs')
const mysql = require('mysql')
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DBNAME
  })
  module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionCreate'
        })
    }

    run = async (interaction) => {
        if(interaction.isCommand()) {
            const cmd = this.client.commands.find(c => c.name === interaction.commandName)

            if(cmd) cmd.run(interaction)
        } else if(interaction.isButton()) {
            
        } else if(interaction.isSelectMenu()) {
            const id = interaction.values[0]
            con.query(`SELECT * FROM arquivos_armazenados WHERE discord_id = '${interaction.user.id}' AND id = '${id}'`, async (err, results) => { //Ele ira selecionar todos os arquivos armazenados e ira filtar pelo ID do discord do cara e o id que ele informou.
            if(interaction.customId == 'delete_arquivo') {
                    if(err) return console.log(err)
                    await interaction.deferUpdate();
                    if(!results[0]) return interaction.editReply({content: 'Ocorreu um erro ao deletar esse arquivo.', embeds: [], components: [], ephemeral: true}) //Isso acontece quando o ID que solicitou não é dele ou não existe esse id.
                    con.query(`DELETE FROM arquivos_armazenados WHERE discord_id= '${interaction.user.id}' AND id = '${id}'`) //Aqui ira deletar da DB o arquivo
                    fs.unlink(`./arquivos/${results[0].uuid}.zip`, (err2) => {
                        if(err2) return console.log(err2)
                        interaction.editReply({content: 'Seu arquivo foi deletado com sucesso!', embeds: [], components: [], ephemeral: true})
                    })
                } else if(interaction.customId == 'download_arquivo') {
                    await interaction.deferUpdate();
                    interaction.editReply({content: `Aqui está seu link:\n ${process.env.main_url}/download?uuid=${results[0].uuid}`, embeds: [], components: [], ephemeral: true})
                    
                }
                
            })
        }
    }
}