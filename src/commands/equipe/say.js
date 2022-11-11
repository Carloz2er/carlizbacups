const Command = require('../../strucures/command')
const Discord = require('discord.js')
module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            description: 'Faça o bot falar alguma coisa.',
        })
    }
    run = async (interaction) => {
            if(!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({content: 'Você nao tem permissão para isso!', ephemeral: true})
            const filter = m => m.author.id === interaction.user.id
            const collector = interaction.channel.createMessageCollector({ filter, time: 120000, max: 1 });
            interaction.reply({content: 'Digite o que deseja enviar. Você tem 2 minutos. (A mensagem será enviada neste canal)', ephemeral: true})
            collector.on('collect', m => {
                const message = m.content
                    const embed = new Discord.MessageEmbed()
                    .setDescription(message)
                    .setThumbnail(interaction.guild.iconURL())
                    .setFooter({text: `Atenciosamento ${interaction.client.user.username}`, iconURL: `${interaction.client.user.displayAvatarURL()}`})
                   
                    interaction.channel.send({embeds: [embed]})
                    m.delete()
            });

            collector.on('end', (collected, reason) => {
                if(reason == 'time') {
                    interaction.followUp({content: 'Comando say expirou expirou.', ephemeral: true})
                }
            });
    }
}