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
            name: 'setplan',
            description: 'Sete alguem com algum plano.',
            options: [
                {
                    type: 'STRING',
                    name: 'plano',
                    description: 'Qual o plano?',
                    required: true,
                    choices: [
                        {
                            name: 'Ouro',
                            value: 'ouro'
                        },
                        {
                            name: 'Cloud',
                            value: 'cloud'
                        }
                    ]
                },
                {
                    type: 'USER',
                    name: 'usuario',
                    description: 'Qual é o usuario que deseja setar o plano?',
                    required: true
                }
            ]
        })
    }
    run = async (interaction) => {
            if(!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({content: 'Você nao tem permissão para isso!', ephemeral: true})
            const user = interaction.options.getUser('usuario')
            const plano = interaction.options.getString('plano')
            con.query(`INSERT INTO planos SET discord_id = '${user.id}', plano = '${plano}', expira_em = '${Date.now()}'`)
            const member = await interaction.guild.members.fetch(user.id)
            if(!member) return console.log("membro nao encontrado")
            member.roles.add(plano == 'ouro' ? config.ids.rolePlanoOuro : config.ids.rolePlanoCloud)
            interaction.reply({content: 'Plano registrado com sucesso!', ephemeral: true})
    }
}