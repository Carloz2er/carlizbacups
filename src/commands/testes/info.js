const Command = require('../../strucures/command')
const Discord = require('discord.js')
const config = require('../../../informations.json')
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
            name: 'info',
            description: 'Veja informações da sua conta.',
            options: [
                {
                    type: 'USER',
                    name: 'usuario',
                    description: 'Qual usuaria deseja ver?',
                }
            ]
        })
    }
    run = async (interaction) => {
        const userID = interaction.member.permissions.has('ADMINISTRATOR') ? interaction.options.getUser('usuario') : interaction.user.id
            con.query(`SELECT * FROM arquivos_armazenados WHERE discord_id = '${userID || interaction.user.id}'`, (err, results) => {
                if(err) return console.log(err)
                con.query(`SELECT * FROM planos WHERE discord_id = '${userID || interaction.user.id}'`, (err2, results2) => {
                    if(err2) return console.log(err2)
                    var totalSize = '0'
                    if(results[0]) {
                         totalSize =  results.reduce((a, b) => {
                            return a + b.size
                          }, 0)
                    }
                      const totalDeArquivos = results.length
                      let acaba_em = ''
                      if(results2[0]) {
                          acaba_em = Math.floor((2678400000 + Number(results2[0].expira_em)) / 1000) 
                          
                      }
                      const embed = new Discord.MessageEmbed()
                      .setDescription(`Total de GB utilizados: ${totalSize}MB/${interaction.member.roles.cache.has(config.ids.rolePlanoCloud) ? '100GB' : interaction.member.roles.cache.has(config.ids.rolePlanoOuro) ? '10GB' : '1GB'}\nTotal de arquivos: ${totalDeArquivos}\n ${results2[0] ? `Seu plano acaba: <t:${acaba_em}:R>` : ''} `)
                      interaction.reply({embeds: [embed], ephemeral: true})
                })
            })
    }
}