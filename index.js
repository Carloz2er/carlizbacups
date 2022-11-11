require('dotenv').config()
const Client = require('./src/strucures/Client')
const Discord = require('discord.js')
const client = new Client({ intents: new Discord.Intents(32767) });
const config = require('./informations.json')
const express = require('express')
const path = require('path')
const app = express()
const mysql = require('mysql')
const con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DBNAME
})

let timeout = 2678400000; 
setInterval(() => {
    con.query(`SELECT * FROM planos`, (err, rsults) => {
     if(err) {
      return  console.log(err)
    }
    if(!rsults[0]) return
    con.query(`SELECT * FROM planos HAVING COUNT(expira_em) > ${timeout - (Date.now() - rsults[0].expira_em)}`, (e, results) => {
        if(results[0] === undefined || results[0].nome === null) return 
        con.query(`DELETE FROM planos WHERE id = '${results[0].id}'`, async (err, resul) => { //Achou um plano pra expirar deleta o plano da DB
            if(err) {
                return console.log(err)
            }
            const member = await client.guilds.cache.get(config.bot.guildID).members.fetch(user.id)
            if(!member) return console.log("membro nao encontrado")
            member.roles.remove(rsults[0].plano == 'ouro' ? config.ids.rolePlanoOuro : config.ids.rolePlanoCloud) 

        })
    })
    })
}, 60000)

                    app.get('/download', function (req, res) {
                        const uuid = req.query.uuid
                        res.download(path.join(__dirname, `arquivos/${uuid}.zip`), async (err)=>{
                            if(err) return console.log(err)
                        });
                    });
                    app.get('*', function (req, res) {
                        res.send('Ficheiro não existe')
                      })

app.listen(25615)
client.login(process.env.BOT_TOKEN)