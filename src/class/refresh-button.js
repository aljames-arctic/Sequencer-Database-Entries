import { generateDatabase } from '../database-generator.js';

export class RefreshDatabaseButton extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Build Sequencer Database",
            template: "modules/sequencer-database-entries/templates/build-database-form.html",
            id: "sdbe-build-form",
            width: 400,
            closeOnSubmit: false
        });
    }

    getData(options) {
        const moduleId = "sequencer-database-entries";
        const assetPath = game.settings.get(moduleId, 'assetsPath');
        return {
            assetPath: assetPath
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

    async _updateObject(event, formData) {
        const moduleId = "sequencer-database-entries";
        const settingsPath = formData.assetPath;

        if (!settingsPath) {
            return ui.notifications.error("SDBE | Please set an Assets Filepath first!");
        }
        
        await game.settings.set(moduleId, 'assetsPath', settingsPath);

        ui.notifications.info("SDBE | Refreshing Database...");
        
        try {
            const DATABASE = await generateDatabase(settingsPath);
            await game.settings.set(moduleId, 'sequencerDatabase', DATABASE);
            
            ui.notifications.info("SDBE | Database Refresh Complete!");

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
            console.error("SDBE | Refresh Failed:", err);
            ui.notifications.error("SDBE | Refresh Failed. Check console for details.");
        }
    }
}