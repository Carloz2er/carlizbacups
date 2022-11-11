const Command = require('../../strucures/command')
const Discord = require('discord.js')
const {createWriteStream} = require('node:fs');
const {pipeline} = require('node:stream');
const {promisify} = require('node:util')
const fetch = require('node-fetch')
const config = require('../../../informations.json')
const uuid = require('uuid');
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
            name: 'upload',
            description: 'Faça upload de um arquivo.',
            options: [
              {
                type: 'ATTACHMENT', 
                name: 'arquivo',
                description: 'Arquivo',
                required: true
              },
              {
                type: 'STRING', 
                name: 'nome',
                description: 'Qual será o nome do arquivo?',
                required: true
              }
            ]
        })
    }
    run = async (interaction) => {
            await interaction.reply({content: 'Carregando arquivo, aguarde! (Pode demorar um pouco, dependendo do tamanho do arquivo)', ephemeral: true})
            con.query(`SELECT * FROM planos WHERE discord_id = '${interaction.user.id}'`, async (err, results) => {
            con.query(`SELECT * FROM arquivos_armazenados WHERE discord_id = '${interaction.user.id}'`, async (err, results2) => {
              const arquivo = interaction.options.getAttachment('arquivo')
              const nome = interaction.options.getString('nome')
              const member = await interaction.guild.members.fetch(interaction.user.id)
              const isZip = arquivo.contentType == 'application/zip' //Puxa o tipo de arquivo, se é em ZIP
              const uuid2 = uuid.v4() //Pega o UUID
              const sizeInMb = arquivo.size * 0.000001 //Transforma de bytes para MB
              if(isZip) { //Caso seja .zip continua
                if(!member.roles.cache.has(config.ids.rolePlanoOuro) && !member.roles.cache.has(config.ids.rolePlanoCloud)) { //Plano Free
                  if(sizeInMb >= 250) { //Caso o arquivo tenha mais de 250mb ele bloqueia de enviar
                    return interaction.editReply({content: 'Você esta tentando fazer um upload com mais de 250MB tendo o plano free.', ephemeral: true})
                  }
                  if(results2[0]) { //Verifica se ja tem algum arquivo armazenado, caso tenha ele ira somar todos os sizes e ira apresentar quanto de armzenamento ja foi ocupado
                   const totalSize =  results2.reduce((a, b) => {
                   return a + b.size
                 }, 0)
                 if(totalSize >= 1000) { //Ele verifica se o armazenamneto já esta cheio.
                  return interaction.editReply({content: 'Você já excedeu o limite de armezenamento do seu plano.', ephemeral: true})
                 }
                   if(sizeInMb + totalSize >= 1000) { // Ele soma o siza do arquivo dando upload com o total ja armazenado por ele e ve se é maior que 1GB, caso for ele nega o upload
                    return interaction.editReply({content: 'Ops, impossivel armazenar esse arquivo. Aparentemente esse arquivo ultrapassa com o limite de armazenamento do seu plano.', ephemeral: true})
                   }
                  }
                  file()
                } else if(member.roles.cache.has(config.ids.rolePlanoCloud)) { //Plano Cloud
                  if(results2[0]) {
                   const totalSize =  results2.reduce((a, b) => {
                   return a + b.size
                 }, 0)
                 if(totalSize >= 100000) {
                  return interaction.editReply({content: 'Você já excedeu o limite de armezenamento do seu plano.', ephemeral: true})
                 }
                   if(sizeInMb + totalSize >= 100000) { 
                    return interaction.editReply({content: 'Ops, impossivel armazenar esse arquivo. Aparentemente esse arquivo ultrapassa com o limite de armazenamento do seu plano.', ephemeral: true})
                   }
                  }
                  file()
                } else if(member.roles.cache.has(config.ids.rolePlanoOuro)) {
                  if(sizeInMb >= 1000) { //Caso o arquivo tenha mais de 250mb ele bloqueia de enviar
                    return interaction.editReply({content: 'Você esta tentando fazer um upload com mais de 1GB tendo o plano gold.', ephemeral: true})
                  }
                  if(results2[0]) { //Verifica se ja tem algum arquivo armazenado, caso tenha ele ira somar todos os sizes e ira apresentar quanto de armzenamento ja foi ocupado
                   const totalSize =  results2.reduce((a, b) => {
                   return a + b.size
                 }, 0)
                 if(totalSize >= 50000) { //Ele verifica se o armazenamneto já esta cheio.
                  return interaction.editReply({content: 'Você já excedeu o limite de armezenamento do seu plano.', ephemeral: true})
                 }
                   if(sizeInMb + totalSize >= 50000) { // Ele soma o siza do arquivo dando upload com o total ja armazenado por ele e ve se é maior que 1GB, caso for ele nega o upload
                    return interaction.editReply({content: 'Ops, impossivel armazenar esse arquivo. Aparentemente esse arquivo ultrapassa com o limite de armazenamento do seu plano.', ephemeral: true})
                   }
                  }
                }
                file()
              } else {
                interaction.editReply({content: 'Você não enviou um arquivo .zip, por favor tente novamente.', ephemeral: true})
              }
              async function file() {
                con.query(`INSERT INTO arquivos_armazenados SET discord_id = '${interaction.user.id}', uuid = '${uuid2}', nome = '${nome}', size = '${sizeInMb}'`, async (err, results) => {
                  if(err) return interaction.editReply({content: 'Ocorreu um erro! Por favor tente novamente', ephemeral: true})
                  const streamPipeline = promisify(pipeline);
                  const response = await fetch(arquivo.attachment);
                  if (!response.ok) return console.log(`Ocorreu um erro ${response.statusText}`);
                  await streamPipeline(response.body, createWriteStream(`./arquivos/${uuid2}.zip`));
                  interaction.editReply({content: 'Arquivo salvo com sucesso!', ephemeral: true})
                })
                
              }
            })
            })

    }
}