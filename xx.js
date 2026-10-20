require("dotenv").config();

const fs = require("fs");

const config = require("./config.json");

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

const blacklist = new Set();

// ================= STATUT =================

// ================= COMMANDES SLASH =================

const commands = [
  // MODÉRATION

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Supprimer des messages.")
    .addIntegerOption(o =>
      o.setName("nombre")
        .setDescription("1 à 100 messages")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("renew")
    .setDescription("Recréer le salon actuel."),

  new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Verrouiller le salon."),

  new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Déverrouiller le salon."),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannir un membre.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("raison")
        .setDescription("Raison")
    ),

    new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulser un membre du serveur.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre à expulser")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("raison")
        .setDescription("Raison de l'expulsion")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout un membre.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("minutes")
        .setDescription("Durée")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("giverole")
    .setDescription("Donner un rôle.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    )
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Rôle")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("removerole")
    .setDescription("Retirer un rôle.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    )
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Rôle")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Mettre un slowmode.")
    .addIntegerOption(o =>
      o.setName("secondes")
        .setDescription("Durée en secondes")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Changer le pseudo.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("pseudo")
        .setDescription("Pseudo")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("add")
    .setDescription("Ajouter un membre au salon.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Retirer un membre du salon.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("hide")
    .setDescription("Cacher le salon."),

  new SlashCommandBuilder()
    .setName("unhide")
    .setDescription("Afficher le salon."),

  new SlashCommandBuilder()
    .setName("raidunlock")
    .setDescription("Déverrouiller tous les salons."),

  // UTILITAIRES

  new SlashCommandBuilder()
    .setName("say")
    .setDescription(">_ parle.")
    .addStringOption(o =>
      o.setName("message")
        .setDescription("Texte")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Créer un embed.")
    .addStringOption(o =>
      o.setName("titre")
        .setDescription("Titre")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("description")
        .setDescription("Description")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Créer une annonce.")
    .addStringOption(o =>
      o.setName("message")
        .setDescription("Annonce")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Créer un sondage.")
    .addStringOption(o =>
      o.setName("question")
        .setDescription("Question")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Voir un avatar de qunqun.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
    ),

  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Infos d'un membre.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Membre")
    ),

  new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Infos du serveur."),

  new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Nombre de membres."),

  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Voir le ping."),

  // SALONS

  new SlashCommandBuilder()
    .setName("voicecreate")
    .setDescription("Créer un vocal.")
    .addStringOption(o =>
      o.setName("nom")
        .setDescription("Nom")
        .setRequired(true)
    ),   

  new SlashCommandBuilder()
    .setName("textcreate")
    .setDescription("Créer un salon texte.")
    .addStringOption(o =>
      o.setName("nom")
        .setDescription("Nom")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("rename")
    .setDescription("Renommer le salon.")
    .addStringOption(o =>
      o.setName("nom")
        .setDescription("Nom")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("deletechannel")
    .setDescription("Supprimer le salon."),

  // TICKETS

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Créer un ticket."),

  new SlashCommandBuilder()
    .setName("close")
    .setDescription("Fermer un ticket."),

  // FUN

  new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Pile ou face."),

  new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Lancer un dé."),

  new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Boule magique.")
    .addStringOption(o =>
      o.setName("question")
        .setDescription("Question")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("emojiadd")
    .setDescription("Ajouter un emoji avec son ID.")
    .addStringOption(o =>
      o.setName("id")
        .setDescription("ID de l'emoji")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("bl")
    .setDescription("Blacklist un utilisateur.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Utilisateur")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("unbl")
    .setDescription("Retirer un utilisateur de la blacklist.")
    .addUserOption(o =>
      o.setName("membre")
        .setDescription("Utilisateur")
        .setRequired(true)
    ),

  // STICKERADD

  new SlashCommandBuilder()
    .setName("stickeradd")
    .setDescription("Ajouter un autocollant avec son ID.")
    .addStringOption(o =>
      o.setName("id")
        .setDescription("ID de l'autocollant")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Changer le statut du bot.")
    .addStringOption(o =>
      o.setName("texte")
        .setDescription("Nouveau statut")
        .setRequired(true)
    ),

  // ANTILINK

  new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("Gérer l'anti-link")
    .addSubcommand(sub =>
      sub
        .setName("activer")
        .setDescription("Bloquer les liens dans un salon")
        .addChannelOption(option =>
          option
            .setName("salon")
            .setDescription("Salon")
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName("desactiver")
        .setDescription("Autoriser les liens dans un salon")
        .addChannelOption(option =>
          option
            .setName("salon")
            .setDescription("Salon")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("liste")
        .setDescription("Voir les salons protégés")
    )
].map(c => c.toJSON());

// ================= READY =================

client.once("clientReady", async () => {
  console.log(`✅ ${client.user.tag} connecté !`);

  // Statut fixe au démarrage : aucun ancien statut ne tourne en arrière-plan.
  client.user.setPresence({
    activities: [{ type: 0, name: "seven's bot" }],
    status: "online"
  });

  const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN);

  // Supprime les anciennes commandes globales pour éviter le mélange.
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: [] });
    console.log("🧹 Anciennes commandes globales supprimées.");
  } catch (err) {
    console.error("❌ Impossible de supprimer les commandes globales :", err);
  }

  for (const guild of client.guilds.cache.values()) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(
          client.user.id,
          guild.id
        ),
        {
          body: commands
        }
      );

      console.log(
        `✅ Commandes installées sur ${guild.name} (${guild.id})`
      );
    } catch (err) {
      console.error(
        `❌ Erreur sur ${guild.name}:`,
        err
      );

      console.error(
        `❌ Erreur sur ${guild.name}:`,
        err
      );
    }
  }

  console.log(
    "🎉 Toutes les commandes sont enregistrées !"
  );
});

client.on("guildCreate", async (guild) => {
  console.log(
    `🆕 Nouveau serveur : ${guild.name} (${guild.id})`
  );

  try {
    const rest = new REST({ version: "10" })
      .setToken(process.env.DISCORD_TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(
        client.user.id,
        guild.id
      ),
      {
        body: commands
      }
    );

    console.log(
      `✅ Commandes installées sur ${guild.name}`
    );
  } catch (err) {
    console.error(
      `❌ Erreur installation commandes :`,
      err
    );
  }

  // 🛡️ Serveurs autorisés
  const serveursAutorises = [
    "1530687721448669244",
    "1549018540290351124",
    "1548662815987073025",
    "1545750228890689536",
    "1342511957252505790"
  ];

  for (const guild of client.guilds.cache.values()) {
    if (!serveursAutorises.includes(guild.id)) {
      console.log(
        `🚪 Je quitte : ${guild.name} (${guild.id})`
      );

      await guild.leave().catch(err => {
        console.error(
          `❌ Impossible de quitter ${guild.name}:`,
          err
        );
      });
    }
  }
});

// ================= INTERACTIONS =================

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = interaction.commandName;

  try {
    // ================= CLEAR =================

    if (cmd === "clear") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        )
      ) {
        return interaction.reply({
          content: "❌ Permission refusée.",
          ephemeral: true
        });
      }

      const nombre =
        interaction.options.getInteger("nombre");

      await interaction.channel.bulkDelete(
        nombre,
        true
      );

      return interaction.reply({
        content: `🧹 ${nombre} messages supprimés.`,
        ephemeral: true
      });
    }

    // ================= LOCK =================

    if (cmd === "lock") {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone.id,
        {
          SendMessages: false
        }
      );

      return interaction.reply(
        "🔒 Salon verrouillé."
      );
    }

    // ================= UNLOCK =================

    if (cmd === "unlock") {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone.id,
        {
          SendMessages: null
        }
      );

      return interaction.reply(
        "🔓 Salon déverrouillé."
      );
    }

    // ================= RENEW =================

    if (cmd === "renew") {
      await interaction.deferReply({
        ephemeral: true
      });

      const oldChannel =
        interaction.channel;

      const newChannel =
        await oldChannel.clone({
          reason:
            `Renew demandé par ${interaction.user.tag}`
        });

      await newChannel.setPosition(
        oldChannel.position
      );

      await oldChannel.delete();

      await newChannel.send(
        "✅ Salon renouvelé."
      );

      return;
    }

    // ================= SAY =================

    if (cmd === "say") {
      const texte =
        interaction.options.getString("message");

      await interaction.reply({
        content: "✅ Message envoyé.",
        ephemeral: true
      });

      await interaction.channel.send(
        texte
      );

      return;
    }

    // ================= EMBED =================

    if (cmd === "embed") {
      const titre =
        interaction.options.getString("titre");

      const description =
        interaction.options.getString("description");

      const embed =
        new EmbedBuilder()
          .setColor("#8B5CF6")
          .setTitle(`💜 ${titre}`)
          .setDescription(description);

      await interaction.reply({
        content: "✅ Embed envoyé.",
        ephemeral: true
      });

      await interaction.channel.send({
        embeds: [embed]
      });

      return;
    }

    // ================= ANNOUNCE =================

    if (cmd === "announce") {
      const texte =
        interaction.options.getString("message");

      const embed =
        new EmbedBuilder()
          .setColor("#F59E0B")
          .setTitle("📢 Annonce")
          .setDescription(texte)
          .setFooter({
            text: config.footer
          })
          .setTimestamp();

      await interaction.reply({
        content: "✅ Annonce envoyée.",
        ephemeral: true
      });

      await interaction.channel.send({
        embeds: [embed]
      });

      return;
    }

    // ================= POLL =================

    if (cmd === "poll") {
      const question =
        interaction.options.getString("question");

      const msg =
        await interaction.reply({
          content:
            `📊 **SONDAGE**\n\n${question}`,
          fetchReply: true
        });

      await msg.react("👍");
      await msg.react("👎");

      return;
    }

    // ================= BAN =================

    if (cmd === "ban") {
      const membre =
        interaction.options.getMember("membre");

      const raison =
        interaction.options.getString("raison") ||
        "Aucune raison.";

      await membre.ban({
        reason: raison
      });

      return interaction.reply(
        `🔨 **${membre.user.tag}** a été banni.`
      );
    }

    // ================= KICK =================

    if (cmd === "kick") {
      const membre =
        interaction.options.getMember("membre");

      const raison =
        interaction.options.getString("raison") ||
        "Aucune raison.";

      await membre.kick(raison);

      return interaction.reply(
        `👢 **${membre.user.tag}** a été expulsé.`
      );
    }

    // ================= TIMEOUT =================

    if (cmd === "timeout") {
      const membre =
        interaction.options.getMember("membre");

      const minutes =
        interaction.options.getInteger("minutes");

      await membre.timeout(
        minutes * 60000,
        "Timeout via le bot."
      );

      return interaction.reply(
        `⏳ ${membre} est timeout **${minutes} minute(s)**.`
      );
    }

    // ================= GIVEROLE =================

    if (cmd === "giverole") {
      const membre =
        interaction.options.getMember("membre");

      const role =
        interaction.options.getRole("role");

      await membre.roles.add(role);

      return interaction.reply(
        `✅ ${role} ajouté à ${membre}.`
      );
    }

    // ================= REMOVEROLE =================

    if (cmd === "removerole") {
      const membre =
        interaction.options.getMember("membre");

      const role =
        interaction.options.getRole("role");

      await membre.roles.remove(role);

      return interaction.reply(
        `❌ ${role} retiré à ${membre}.`
      );
    }

    // ================= SLOWMODE =================

    if (cmd === "slowmode") {
      const secondes =
        interaction.options.getInteger("secondes");

      await interaction.channel.setRateLimitPerUser(
        secondes
      );

      return interaction.reply(
        `🐢 Slowmode activé : **${secondes} secondes**.`
      );
    }

    // ================= NICK =================

    if (cmd === "nick") {
      const membre =
        interaction.options.getMember("membre");

      const pseudo =
        interaction.options.getString("pseudo");

      await membre.setNickname(pseudo);

      return interaction.reply(
        `✏️ Nouveau pseudo : **${pseudo}**`
      );
    }
   
    // ================= ADD =================

    if (cmd === "add") {
      const membre =
        interaction.options.getMember("membre");

      await interaction.channel.permissionOverwrites.edit(
        membre.id,
        {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true
        }
      );

      return interaction.reply(
        `✅ ${membre} ajouté au salon.`
      );
    }

    // ================= REMOVE =================

    if (cmd === "remove") {
      const membre =
        interaction.options.getMember("membre");

      await interaction.channel.permissionOverwrites.edit(
        membre.id,
        {
          ViewChannel: false
        }
      );

      return interaction.reply(
        `❌ ${membre} retiré du salon.`
      );
    }

    // ================= HIDE =================

    if (cmd === "hide") {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone.id,
        {
          ViewChannel: false
        }
      );

      return interaction.reply(
        "🙈 Salon caché."
      );
    }

    // ================= UNHIDE =================

    if (cmd === "unhide") {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone.id,
        {
          ViewChannel: true
        }
      );

      return interaction.reply(
        "👀 Salon visible."
      );
    }

    // ================= AVATAR =================

    if (cmd === "avatar") {
      const membre =
        interaction.options.getMember("membre") ||
        interaction.member;

      const embed =
        new EmbedBuilder()
          .setColor("#8B5CF6")
          .setTitle(
            `🖼 Avatar de ${membre.user.tag}`
          )
          .setImage(
            membre.user.displayAvatarURL({
              size: 2048
            })
          )
          .setFooter({
            text: config.footer
          });

      return interaction.reply({
        embeds: [embed]
      });
    }

    // ================= USERINFO =================

    if (cmd === "userinfo") {
      const membre =
        interaction.options.getMember("membre") ||
        interaction.member;

      const embed =
        new EmbedBuilder()
          .setColor("#8B5CF6")
          .setThumbnail(
            membre.user.displayAvatarURL({
              size: 1024
            })
          )
          .setTitle(
            `👤 ${membre.user.tag}`
          )
          .addFields(
            {
              name: "🆔 ID",
              value: membre.id,
              inline: false
            },
            {
              name: "📅 Compte créé",
              value:
                `\<t:${Math.floor(
                  membre.user.createdTimestamp / 1000
                )}:F>`,
              inline: false
            },
            {
              name: "📥 Arrivé sur le serveur",
              value:
                `\<t:${Math.floor(
                  membre.joinedTimestamp / 1000
                )}:F>`,
              inline: false
            },
            {
              name: "🎭 Rôles",
              value:
                `${membre.roles.cache.size - 1}`,
              inline: true
            }
          )
          .setFooter({
            text: config.footer
          });

      return interaction.reply({
        embeds: [embed]
      });
    }
    
    // ================= SERVERINFO =================

    if (cmd === "serverinfo") {
      const g =
        interaction.guild;

      const embed =
        new EmbedBuilder()
          .setColor("#8B5CF6")
          .setThumbnail(
            g.iconURL({
              size: 1024
            })
          )
          .setTitle(`🌍 ${g.name}`)
          .addFields(
            {
              name: "👥 members",
              value: `${g.memberCount}`,
              inline: true
            },
            {
              name: "🆔 ID",
              value: g.id,
              inline: true
            },
            {
              name: "👑 Owner",
              value: `<@${g.ownerId}>`,
              inline: true
            }
          )
          .setFooter({
            text: config.footer
          })
          .setTimestamp();

      return interaction.reply({
        embeds: [embed]
      });
    }

    // ================= MEMBERCOUNT =================

    if (cmd === "membercount") {
      return interaction.reply(
        `👥 Le serveur compte **${interaction.guild.memberCount} membres**.`
      );
    }

    // ================= PING =================

    if (cmd === "ping") {
      return interaction.reply(
        `🏓 Pong ! **${client.ws.ping}ms**`
      );
    }

    // ================= VOICECREATE =================

    if (cmd === "voicecreate") {
      const nom =
        interaction.options.getString("nom");

      const channel =
        await interaction.guild.channels.create({
          name: nom,
          type: ChannelType.GuildVoice
        });

      return interaction.reply(
        `🔊 Vocal créé : ${channel}`
      );
    }

    // ================= TEXTCREATE =================

    if (cmd === "textcreate") {
      const nom =
        interaction.options.getString("nom");

      const channel =
        await interaction.guild.channels.create({
          name: nom,
          type: ChannelType.GuildText
        });

      return interaction.reply(
        `💬 Salon créé : ${channel}`
      );
    }

    // ================= RENAME =================

    if (cmd === "rename") {
      const nom =
        interaction.options.getString("nom");

      await interaction.channel.setName(nom);

      return interaction.reply(
        `✏️ Salon renommé en **${nom}**.`
      );
    }

    // ================= DELETECHANNEL =================

    if (cmd === "deletechannel") {
      await interaction.reply({
        content: "🗑️ Suppression du salon...",
        ephemeral: true
      });

      await interaction.channel.delete();

      return;
    }

    // ================= TICKET =================

    if (cmd === "ticket") {
      const channel =
        await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: [
                PermissionsBitField.Flags.ViewChannel
              ]
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            }
          ]
        });
        
      return interaction.reply({
        content:
          `🎫 Ticket créé : ${channel}`,
        ephemeral: true
      });
    }

    // ================= CLOSE =================

    if (cmd === "close") {
      await interaction.reply(
        "🔒 Fermeture du ticket..."
      );

      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 2000);

      return;
    }

    // ================= COINFLIP =================

    if (cmd === "coinflip") {
      const resultat =
        Math.random() < 0.5
          ? "🪙 Pile"
          : "🪙 Face";

      return interaction.reply(
        `🎲 Résultat : **${resultat}**`
      );
    }

    // ================= DICE =================

    if (cmd === "dice") {
      const resultat =
        Math.floor(Math.random() * 6) + 1;

      return interaction.reply(
        `🎲 Tu as obtenu **${resultat}** !`
      );
    }

    // ================= 8BALL =================

    if (cmd === "8ball") {
      const question =
        interaction.options.getString("question");

      const reponses = [
        "Oui.",
        "Non.",
        "Peut-être.",
        "Certainement.",
        "Je ne pense pas.",
        "Impossible à savoir.",
        "Très probablement.",
        "Absolument."
      ];

      const reponse =
        reponses[
          Math.floor(
            Math.random() * reponses.length
          )
        ];

      return interaction.reply(
        `🎱 **Question :** ${question}\n**Réponse :** ${reponse}`
      );
    }

    // ================= EMOJIADD =================

    if (cmd === "emojiadd") {
      const id =
        interaction.options.getString("id");

      try {
        const emoji =
          await interaction.guild.emojis.create({
            attachment:
              `https\://cdn.discordapp.com/emojis/${id}.png`,
            name: `emoji\_${id}`
          });

        return interaction.reply(
          `✅ Emoji ajouté : ${emoji}`
        );
      } catch (err) {
        console.error(
          "❌ Erreur emojiadd :",
          err
        );

        return interaction.reply({
          content:
            "❌ Impossible d'ajouter cet emoji.",
          ephemeral: true
        });
      }
    }

    // ================= STICKERADD =================

    if (cmd === "stickeradd") {
      const id =
        interaction.options.getString("id");

      try {
        const sticker =
          await interaction.guild.stickers.create({
            file:
              `https\://cdn.discordapp.com/stickers/${id}.png`,
            name: `sticker\_${id}`,
            description: "Sticker ajouté par le bot",
            tags: "discord"
          });

        return interaction.reply(
          `✅ Sticker ajouté : ${sticker.name}`
        );
      } catch (err) {
        console.error(
          "❌ Erreur stickeradd :",
          err
        );

        return interaction.reply({
          content:
            "❌ Impossible d'ajouter cet autocollant.",
          ephemeral: true
        });
      }
    }
    
    // ================= BLACKLIST =================

    if (cmd === "bl") {
      if (
        interaction.user.id !==
        config.ownerId
      ) {
        return interaction.reply({
          content:
            "❌ Seul le propriétaire du bot peut utiliser cette commande.",
          ephemeral: true
        });
      }

      const membre =
        interaction.options.getUser("membre");

      blacklist.add(membre.id);

      return interaction.reply(
        `🚫 **${membre.tag}** a été ajouté à la blacklist.`
      );
    }

    // ================= UNBLACKLIST =================

    if (cmd === "unbl") {
      if (
        interaction.user.id !==
        config.ownerId
      ) {
        return interaction.reply({
          content:
            "❌ Seul le propriétaire du bot peut utiliser cette commande.",
          ephemeral: true
        });
      }

      const membre =
        interaction.options.getUser("membre");

      blacklist.delete(membre.id);

      return interaction.reply(
        `✅ **${membre.tag}** a été retiré de la blacklist.`
      );
    }

    // ================= RAID UNLOCK =================

    if (cmd === "raidunlock") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.SendMessages
        )
      ) {
        return interaction.reply({
          content:
            "❌ Permission refusée.",
          ephemeral: true
        });
      }

      for (
        const channel of
        interaction.guild.channels.cache.values()
      ) {
        if (
          channel.type ===
          ChannelType.GuildText
        ) {
          await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone.id,
            {
              SendMessages: null
            }
          );
        }
      }

      return interaction.reply(
        "🔓 Tous les salons ont été déverrouillés."
      );
    }

    // ================= ANTILINK =================

    if (cmd === "antilink") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageGuild
        )
      ) {
        return interaction.reply({
          content:
            "❌ Tu dois avoir la permission **Gérer le serveur**.",
          ephemeral: true
        });
      }

      if (!config.antiLinkChannels) {
        config.antiLinkChannels = {};
      }
      
      if (
        !config.antiLinkChannels[
          interaction.guild.id
        ]
      ) {
        config.antiLinkChannels[
          interaction.guild.id
        ] = [];
      }

      const action =
        interaction.options.getSubcommand();

      // ---------- ACTIVER ----------

      if (action === "activer") {
        const salon =
          interaction.options.getChannel("salon");

        if (
          !config.antiLinkChannels[
            interaction.guild.id
          ].includes(salon.id)
        ) {
          config.antiLinkChannels[
            interaction.guild.id
          ].push(salon.id);
        }

        fs.writeFileSync(
          "./config.json",
          JSON.stringify(
            config,
            null,
            2
          )
        );

        return interaction.reply({
          content:
            `🔒 Anti-link activé dans ${salon}.`,
          ephemeral: true
        });
      }

      // ---------- DESACTIVER ----------

      if (action === "desactiver") {
        const salon =
          interaction.options.getChannel("salon");

        config.antiLinkChannels[
          interaction.guild.id
        ] =
          config.antiLinkChannels[
            interaction.guild.id
          ].filter(
            id => id !== salon.id
          );

        fs.writeFileSync(
          "./config.json",
          JSON.stringify(
            config,
            null,
            2
          )
        );

        return interaction.reply({
          content:
            `🔓 Anti-link désactivé dans ${salon}.`,
          ephemeral: true
        });
      }

      // ---------- LISTE ----------

      if (action === "liste") {
        const salons =
          config.antiLinkChannels[
            interaction.guild.id
          ];

        if (
          !salons ||
          salons.length === 0
        ) {
          return interaction.reply({
            content:
              "ℹ️ L'anti-link n'est activé dans aucun salon.",
            ephemeral: true
          });
        }

        return interaction.reply({
          content:
            "🔒 **Anti-link actif dans :**\n" +
            salons
              .map(id => `<#${id}>`)
              .join("\n"),
          ephemeral: true
        });
      }
    }

    // ================= STATUS =================

    if (cmd === "status") {
      if (
        interaction.user.id !==
        config.ownerId
      ) {
        return interaction.reply({
          content:
            "❌ Seul le propriétaire du bot peut utiliser cette commande.",
          ephemeral: true
        });
      }

      const texte =
        interaction.options.getString("texte");

      client.user.setPresence({
        activities: [
          {
            type: 0,
            name: texte
          }
        ],
        status: "Streaming"
      });

      return interaction.reply({
        content:
          `✅ Statut changé en : **${texte}**`,
        ephemeral: true
      });
    }
    
  } catch (err) {
    console.error(
      "❌ Erreur interaction :",
      err
    );

    if (
      !interaction.replied &&
      !interaction.deferred
    ) {
      await interaction.reply({
        content:
          "❌ Une erreur est survenue.",
        ephemeral: true
      }).catch(() => {});
    }
  }
});

// ================= ANTI-LINK =================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const salonsAntiLink =
    config.antiLinkChannels?.[message.guild.id] || [];

  if (!salonsAntiLink.includes(message.channel.id)) return;

  // Les modérateurs et les membres autorisés à intégrer des liens sont exemptés.
  if (
    message.member?.permissions.has(
      PermissionsBitField.Flags.ManageMessages
    ) ||
    message.member?.permissionsIn(message.channel).has(
      PermissionsBitField.Flags.EmbedLinks
    )
  ) {
    return;
  }

  // Recherche des URLs
  const urls =
    message.content.match(
      /https?:\/\/[^\s]+|www\.[^\s]+/gi
    );

  if (!urls) return;

  // Liens autorisés :
  // - media.tenor.com
  // - discord.gg
  // - discord.com/invite
  // - discordapp.com/invite

  const liensInterdits = urls.filter((url) => {
    try {
      const urlComplete =
        url.startsWith("http")
          ? url
          : `https://${url}`;

      const parsed =
        new URL(urlComplete);

      const domaine =
        parsed.hostname.toLowerCase();

      // Tenor autorisé
      if (
        domaine === "media.tenor.com" ||
        domaine.endsWith(".media.tenor.com")
      ) {
        return false;
      }

      if (
        domaine === "discord.gg" ||
        domaine === "discord.com" &&
        parsed.pathname.startsWith("/invite/") ||
        domaine === "discordapp.com" &&
        parsed.pathname.startsWith("/invite/")
      ) {
        return false;
      }

      // Tout le reste est interdit
      return true;
    } catch {
      return true;
    }
  });

  // Aucun lien interdit
  if (liensInterdits.length === 0) return;

  try {
    await message.delete();

    const warning =
      await message.channel.send({
        content:
          `🚫 ${message.author}, les liens externes sont interdits dans ce salon.`
      }).catch(() => null);

    if (warning) {
      setTimeout(() => {
        warning.delete().catch(() => {});
      }, 5000);
    }
  } catch (err) {
    console.error(
      "❌ Erreur anti-link :",
      err
    );
  }
});

// ================= ANTI-SPAM =================

const spamMap = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.member) return;

  const now = Date.now();

  let data = spamMap.get(message.author.id);

  if (!data) {
    data = {
      count: 0,
      last: now
    };
  }

  if (now - data.last > 5000) {
    data.count = 0;
  }

  data.count++;
  data.last = now;

  spamMap.set(message.author.id, data);

  if (data.count >= 5) {
    spamMap.delete(message.author.id);

    // Vérification des permissions du bot
    const botMember =
      message.guild.members.me;

    if (!botMember) return;

    if (
      !botMember.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    ) {
      console.error(
        `❌ Anti-spam : le bot n'a pas la permission "Modérer les membres" sur ${message.guild.name}.`
      );

      return;
    }

    // Vérification de la hiérarchie des rôles
    if (
      message.member.roles.highest.position >=
      botMember.roles.highest.position
    ) {
      console.error(
        `❌ Anti-spam : impossible de mute ${message.author.tag} car son rôle est supérieur ou égal au rôle du bot sur ${message.guild.name}.`
      );

      return;
    }

    try {
      await message.member.timeout(
        5 * 60 * 1000,
        "Spam détecté"
      );

      await message.channel.send(
        `🚫 ${message.author} a été mute **5 minutes** pour spam.`
      );
    } catch (err) {
      console.error(
        `❌ Erreur anti-spam sur ${message.guild.name} :`,
        err
      );
    }
  }
});

// ================= ANTI-RAID =================

const joins = [];

client.on("guildMemberAdd", async (member) => {
  joins.push(Date.now());

  while (
    joins.length &&
    Date.now() - joins[0] > 10000
  ) {
    joins.shift();
  }

  if (joins.length >= 10) {
    try {
      for (
        const channel
        of member.guild.channels.cache.values()
      ) {
        if (
          channel.type ===
          ChannelType.GuildText
        ) {
          await channel.permissionOverwrites.edit(
            member.guild.roles.everyone.id,
            {
              SendMessages: false
            }
          );
        }
      }

      const logs =
        member.guild.channels.cache.find(
          c => c.name === "logs"
        );

      if (logs) {

        await logs.send(
          "🚨 **RAID détecté ! Tous les salons ont été verrouillés.**"
        );
      }
    } catch (err) {
      console.error(
        "❌ Erreur anti-raid :",
        err
      );
    }
  }
});

// ================= WELCOME =================

client.on("guildMemberAdd", async (member) => {
  try {
    const channel =
      member.guild.channels.cache.get(
        config.welcomeChannelId
      );

    if (!channel) return;

    await channel.send(
      `👋 Bienvenue ${member} sur **${member.guild.name}** !`
    );
  } catch (err) {
    console.error(
      "❌ Erreur welcome :",
      err
    );
  }
});

// ================= GOODBYE =================

client.on("guildMemberRemove", async (member) => {
  try {
    const channel =
      member.guild.channels.cache.get(
        config.goodbyeChannelId
      );

    if (!channel) return;

    await channel.send(
      `👋 **${member.user.username}** a quitté le serveur.`
    );
  } catch (err) {
    console.error(
      "❌ Erreur goodbye :",
      err
    );
  }
});

// ================= LOG MESSAGE DELETE =================

client.on("messageDelete", async (message) => {
  try {
    if (!message.guild) return;
    if (message.author?.bot) return;

    const logs =
      message.guild.channels.cache.find(
        c => c.name === "logs"
      );

    if (!logs) return;

    const embed =
      new EmbedBuilder()
        .setTitle("🗑️ Message supprimé")
        .addFields(
          {
            name: "Auteur",
            value: message.author
              ? `${message.author}`
              : "Inconnu"
          },
          {
            name: "Salon",
            value: `${message.channel}`
          },
          {
            name: "Contenu",
            value: message.content
              ? message.content.slice(0, 1024)
              : "Contenu indisponible"
          }
        )
        .setTimestamp();

    await logs.send({
      embeds: [embed]
    });
  } catch (err) {
    console.error(
      "❌ Erreur logs messageDelete :",
      err
    );
  }
});

// ================= LOG MESSAGE UPDATE =================

client.on("messageUpdate", async (oldMessage, newMessage) => {
  try {
    if (!oldMessage.guild) return;
    if (oldMessage.author?.bot) return;

    if (oldMessage.content === newMessage.content) {
      return;
    }

    const logs = oldMessage.guild.channels.cache.find(
      c => c.name === "logs"
    );

    if (!logs) return;

    const embed = new EmbedBuilder()
      .setTitle("✏️ Message modifié")
      .addFields(
        {
          name: "Auteur",
          value: oldMessage.author
            ? `${oldMessage.author}`
            : "Inconnu"
        },
        {
          name: "Salon",
          value: `${oldMessage.channel}`
        },
        {
          name: "Ancien message",
          value: oldMessage.content
            ? oldMessage.content.slice(0, 1024)
            : "Contenu indisponible"
        },
        {
          name: "Nouveau message",
          value: newMessage.content
            ? newMessage.content.slice(0, 1024)
            : "Contenu indisponible"
        }
      )
      .setTimestamp();

    await logs.send({
      embeds: [embed]
    });

  } catch (err) {
    console.error("❌ Erreur logs messageUpdate :", err);
  }
});

// ================= ERREURS =================

process.on(
  "unhandledRejection",
  console.error
);

process.on(
  "uncaughtException",
  console.error
);

// ================= LOGIN =================

client.login(
  process.env.DISCORD_TOKEN
);