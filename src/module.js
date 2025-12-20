import { generateDatabase } from './database-generator.js'
import { RefreshDatabaseButton } from './class/refresh-button.js'

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
        restricted: true
    });

    game.settings.register(moduleId, 'sequencerDatabase', {
        scope: 'world',
        config: false,
        type: Object,
        default: {}
    });

    game.settings.registerMenu(moduleId, "refreshMenu", {
        name: "Build Database",
        label: "Build Database",
        hint: "Builds and saves the internal Sequencer database index from your assets folder. Requires an asset filepath set and saved.",
        icon: "fas fa-sync",
        type: RefreshDatabaseButton, 
        restricted: true
}   );
})

Hooks.once('ready', async function() {
    const SEQUENCER_DATABASE = game.settings.get(moduleId, 'sequencerDatabase');
    if (SEQUENCER_DATABASE && Object.keys(SEQUENCER_DATABASE).length > 0)
        Sequencer.Database.registerEntries(moduleId, SEQUENCER_DATABASE);
})