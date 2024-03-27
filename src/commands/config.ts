import {PermissionsBitField, RoleFlagsBitField, SlashCommandBuilder} from "discord.js";
import { config } from "../config";

import fs from 'fs';
import dotenv from 'dotenv';

export let superRole = config.SUPER_ROLE;
export let categoryTextChannelName = config.CATEGORY_TEXT_CHANNEL_NAME;
export let categoryVoiceChannelName = config.CATEGORY_VOICE_CHANNEL_NAME;

export const data = new SlashCommandBuilder()
    .setName("configure")
    .setDescription("Configure the server settings")
    .addRoleOption(option =>
        option.setName('role')
            .setDescription('The role for private channels'))
    .addChannelOption(option =>
        option.setName('textchannel')
            .setDescription('The text channel category for private channels'))
    .addChannelOption(option =>
        option.setName('voicechannel')
            .setDescription('The voice channel category for private channels'));

export async function execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.All)){
        await interaction.reply({ content: 'Only administrators can use this command.', ephemeral: true });
        return;
    }

    const newSuperRole = interaction.options.getRole('role')?.name;
    const newTextChannel = interaction.options.getChannel('textchannel')?.name;
    const newVoiceChannel = interaction.options.getChannel('voicechannel')?.name;

    // Load existing .env content
    const envConfig = dotenv.parse(fs.readFileSync('.env'));

    if (newSuperRole) {
        // Update the superRole value
        envConfig.SUPER_ROLE = newSuperRole;
        superRole = newSuperRole;
    }

    if (newTextChannel) {
        // Update the text channel name
        envConfig.CATEGORY_TEXT_CHANNEL_NAME = newTextChannel;
        categoryTextChannelName = newTextChannel;
    }

    if (newVoiceChannel) {
        // Update the voice channel name
        envConfig.CATEGORY_VOICE_CHANNEL_NAME = newVoiceChannel;
        categoryVoiceChannelName = newVoiceChannel;
    }

    // Format updated .env content
    const updatedEnvConfig = Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n');

    // Write updated content back to .env
    fs.writeFileSync('.env', updatedEnvConfig);

    await interaction.reply(`Server settings updated successfully.`);
}
