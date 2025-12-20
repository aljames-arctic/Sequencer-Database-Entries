import { generateDatabase } from './database-generator.js' 

const moduleId = "sequencer-database-entries";

Hooks.once('init', async function() {
    game.settings.register(moduleId, 'assetsPath', {
        name: 'Assets Filepath',
        hint: 'The path within the Foundry data folder where assets are stored.',
        scope: 'world',
        config: true,
        type: String,
        default: '',
        filePicker: 'folder', // This adds a folder picker button to the settings menu
        onChange: value => {
            console.log(`SDE | assetsPath changed to: ${value}`);
        },
        requiresReload: true
    });

    game.settings.register(moduleId, 'sequencerDatabase', {
        scope: 'world',     // Synchronizes to all clients
        config: false,      // Hidden from the settings menu
        type: Object,
        default: {}
    });
})

Hooks.once('ready', async function() {
    if (game.user.isGM) {
        const settingsPath = game.settings.get(moduleId, 'assetsPath');
        if (!settingsPath || settingsPath == '') return;
    
        const DATABASE = await generateDatabase(settingsPath);
        await game.settings.set(moduleId, 'sequencerDatabase', DATABASE);
    }

    const SEQUENCER_DATABASE = game.settings.get(moduleId, 'sequencerDatabase');
    if (SEQUENCER_DATABASE && Object.keys(SEQUENCER_DATABASE).length > 0)
        Sequencer.Database.registerEntries(moduleId, SEQUENCER_DATABASE);
})