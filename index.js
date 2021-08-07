try {
    const DiscordJS = require("discord.js");
    require("dotenv").config();

    const guildID = "506879969763262515";


    const client = new DiscordJS.Client({ intents: "GUILDS" });

    const getApp = () => {
        const app = client.api.applications(client.user.id);
        if (guildID) app.guilds(guildID);
        return app;
    }

    client.on('ready', async () => {
        console.log("OK");
        const commands = await getApp().commands.get();
        console.log(commands);
      //  await getApp().commands('873387157522362410').delete();
      /*
        await getApp().commands.post({
            data:{
                name: "avisar",
                description: "Avise quando tiver prova, trabalho ou qualquer outra coisa",
                options: [
                    {
                        name: "tipo",
                        description: "Avisar sobre o que?",
                        type: 3,
                        required: true,
                        choices: [
                            {
                                name: "Trabalho",
                                value: "trabalho"
                            },
                            {
                                name: "Prova",
                                value: "prova"
                            },
                            {
                                name: "Encontro",
                                value: "encontro"
                            },
                            {
                                name: "Outro",
                                value: "outro"
                            }
                        ],
                    },
                    {
                        name: "quando",
                        description: "Pode usar datas ou em texto, p.e: Daqui 10 dias",
                        type: 3,
                        required: true
                    },
                    {
                        name: "observação",
                        description: "Observação Adicional",
                        type: 3,
                        required: false
                    }
                ]
            }
        });*/
        //    await getApp().commands('873347936023629866').delete();
    })


    client.ws.on("INTERACTION_CREATE", async (interaction) => {

        const {name,options,...other} = interaction.data;
        console.log(other)
        const command = name.toLowerCase();

        const args = {};

        if(options){
            for(const option of options){
                const {name,value} = option;
                args[name] = value;
            }
        }
        
        console.log(command,args);
        switch(command){
            case 'avisar':
                const embed = new DiscordJS.MessageEmbed().setTitle("Aviso Definido");
                embed.addField("Sobre", args.tipo);
                embed.addField("Quando", args.quando)
                embed.addField("Observação",args['observação'])
                reply(interaction,embed);
            break;
        }

    })
    
    const reply = async (interaction,response) => {
        
        let data = {
            content: response
        };

        if(typeof response === "object"){
            data = {
                embeds: [response.toJSON()]
            }
     //       data = await createAPIMessage(interaction,response);
        }

        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data
            }
        });
    }

    const createAPIMessage = async(interaction, content) => {
        DiscordJS.APIMessage.create()
        const {data,files} = await DiscordJS.APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            content
        ).resolveData().resolveFiles();

        return {...data, files};
    }

    client.login(process.env.TOKEN);
} catch (e) {
    console.log(e);
}