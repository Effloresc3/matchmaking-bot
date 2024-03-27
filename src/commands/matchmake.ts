import {Colors, createChannel, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import{superRole,categoryTextChannelName,categoryVoiceChannelName} from "./config";

export const data = new SlashCommandBuilder()
    .setName("matchmake")
    .setDescription("Matchmakes two persons into one group")
    .addUserOption(option =>
        option.setName('member')
            .setDescription('The first group member'))
    .addUserOption(option =>
        option.setName('secondmember')
            .setDescription('The second group member'))
    .addStringOption(option =>
        option.setName('group')
            .setDescription('This will be the group name'));
export async function execute(interaction) {
    const firstTaggedUser = interaction.options.getUser('member');
    const secondTaggedUser = interaction.options.getUser('secondmember');
    const group = interaction.options.getString('group');
    const superRoleFound = interaction.guild.roles.cache.find(r => r.name === superRole);
    if (!superRoleFound) {
        console.log(`Role '${superRole}' does not exist`);
        return;
    }

    const categoryTextChannel = interaction.guild.channels.cache.find(
        (channel:any) => channel.name === categoryTextChannelName && channel.type === 4
    );

    if (!categoryTextChannel) throw new Error(`Category channel "${categoryTextChannelName}" not found in guild.`);

    const categoryVoiceChannel = interaction.guild.channels.cache.find(
        (channel:any) => channel.name === categoryVoiceChannelName && channel.type === 4
    );

    if (!categoryVoiceChannel) throw new Error(`Category channel "${categoryVoiceChannelName}" not found in guild.`);

    const createRolePromise = interaction.guild.roles.create({
        name: `${group}`,
        color: Math.floor(Math.random() * 16777215)
    });

    const [role] = await Promise.all([createRolePromise]);

    const firstTaggedUserMember = interaction.guild.members.cache.get(firstTaggedUser.id);
    const secondTaggedUserMember = interaction.guild.members.cache.get(secondTaggedUser.id);

    if (firstTaggedUserMember && secondTaggedUserMember) {
        await Promise.all([
            firstTaggedUserMember.roles.add(role),
            secondTaggedUserMember.roles.add(role)
        ]);
    }

    const createChannelsPromises = [
        interaction.guild.channels.create({
            name: `${group}`,
            type: 0,
            parent: categoryTextChannel,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Default],
                },
                {
                    id: role.id,
                    allow: [PermissionsBitField.Default],
                },
                {
                    id: superRoleFound.id,
                    allow: [PermissionsBitField.All],
                },
            ],
        }),
        interaction.guild.channels.create({
            name: `${group}`,
            type: 2,
            parent: categoryVoiceChannel,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Default],
                },
                {
                    id: role.id,
                    allow: [PermissionsBitField.Default],
                },
                {
                    id: superRoleFound.id,
                    allow: [PermissionsBitField.All],
                },
            ],
        }),
    ];

    await Promise.all(createChannelsPromises);
    await interaction.reply(`Group created.`);
}
