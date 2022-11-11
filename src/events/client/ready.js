const Event = require('../../strucures/event')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = () => {

        const atividades = [
            { atividade: '🌐 Procurando melhorias.', type: 'PLAYING' },
            { atividade: '🌐 Procurando melhorias..', type: 'PLAYING' },
            { atividade: '🌐 Procurando melhorias...', type: 'PLAYING' }
          ];

          this.client.user.setActivity(atividades[0].atividade);

  setInterval(() => {
    const random = Math.floor(Math.random() * atividades.length);

    this.client.user.setActivity(atividades[random].atividade);

  }, 10000);

        console.log(`Bot ${this.client.user.username} logado com sucesso!`)
        this.client.registryCommands()
    }
}