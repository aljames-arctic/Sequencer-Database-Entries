export class ExportDatabaseButton extends FormApplication {
    constructor(...args) {
        super(...args);
        ExportDatabaseButton.runExport().then(() => {
            this.close();
        });
    }

    static async runExport() {
        const moduleId = "sequencer-database-entries";
        const database = game.settings.get(moduleId, 'sequencerDatabase');

        if (!database || Object.keys(database).length === 0) {
            return ui.notifications.warn("SDBE | Database is empty, nothing to export.");
        }

        const jsonData = JSON.stringify(database, null, 2);
        const filename = `sequencer-database-backup.json`;

        saveDataToFile(jsonData, 'application/json', filename);
        ui.notifications.info(`SDBE | Successfully exported database to ${filename}`);
    }

    render() {
        return this;
    }
}

export class ImportDatabaseButton extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Import Sequencer Database",
            template: "modules/sequencer-database-entries/templates/import-database-form.html",
            id: "sdbe-import-form",
            width: 400,
            closeOnSubmit: false
        });
    }

    async _updateObject(event, formData) {
        const moduleId = "sequencer-database-entries";
        const sequencerDatabaseId = 'sdbe';

        const file = event.target.importFile.files[0];
        if (!file) {
            return ui.notifications.warn("SDBE | No file selected for import.");
        }

        const fileText = await file.text();
        let importedData;
        try {
            importedData = JSON.parse(fileText);
        } catch (err) {
            return ui.notifications.error("SDBE | Failed to parse JSON file. Please ensure it is a valid JSON file.");
        }

        if (!importedData || typeof importedData !== 'object') {
            return ui.notifications.error("SDBE | Invalid data format in the imported file.");
        }

        ui.notifications.info("SDBE | Importing database...");

        try {
            await game.settings.set(moduleId, 'sequencerDatabase', importedData);
            
            ui.notifications.info("SDBE | Database import complete!");

            new Dialog({
                title: "Reload Required",
                content: `
                    <p style="margin-bottom:10px;">The database has been updated successfully.</p>
                    <p><strong>Would you like to reload Foundry now to apply these changes?</strong></p>
                `,
                buttons: {
                    yes: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Yes, Reload",
                        callback: () => location.reload()
                    },
                    no: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "No, Later",
                        callback: () => {
                            ui.notifications.warn("SDBE | Changes will not take effect until the next reload.");
                        }
                    }
                },
                default: "yes"
            }).render(true);
            this.close();
        } catch (err) {
            console.error("SDBE | Import Failed:", err);
            ui.notifications.error("SDBE | Import Failed. Check console for details.");
        }
    }
}
