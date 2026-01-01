import { RefreshDatabaseButton } from './class/refresh-button.js'
import { ExportDatabaseButton, ImportDatabaseButton } from './class/import-export-button.js';

const moduleId = "sequencer-database-entries";
const sequencerDatabaseId = 'sdbe'

Hooks.once('init', async function() {
    game.settings.register(moduleId, 'assetsPath', {
        name: 'Assets Filepath',
        hint: 'The path within the Foundry data folder where assets are stored.',
        scope: 'world',
        config: false,
        type: String,
        default: ''
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
        hint: "Opens a prompt to set your assets folder, then builds and saves the internal Sequencer database index.",
        icon: "fas fa-sync",
        type: RefreshDatabaseButton, 
        restricted: true
    });

    game.settings.registerMenu(moduleId, "exportDatabase", {
        name: "Export Database",
        label: "Export Database",
        hint: "Exports the internal Sequencer database index to a JSON file.",
        icon: "fas fa-download",
        type: ExportDatabaseButton,
        restricted: true
    });

    game.settings.registerMenu(moduleId, "importDatabase", {
        name: "Import Database",
        label: "Import Database",
        hint: "Imports a JSON file to overwrite the internal Sequencer database index.",
        icon: "fas fa-upload",
        type: ImportDatabaseButton,
        restricted: true
    });
})

Hooks.once('ready', async function() {
    const SEQUENCER_DATABASE = game.settings.get(moduleId, 'sequencerDatabase');
    if (SEQUENCER_DATABASE && Object.keys(SEQUENCER_DATABASE).length > 0)
        Sequencer.Database.registerEntries(sequencerDatabaseId, SEQUENCER_DATABASE);
})