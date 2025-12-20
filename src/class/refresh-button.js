import { generateDatabase } from '../database-generator.js';

export class RefreshDatabaseButton extends FormApplication {
    constructor(...args) {
        super(...args);
        // When the menu is clicked, Foundry opens this class.
        // We run our logic and then immediately close/cancel the window.
        RefreshDatabaseButton.runRefresh().then(() => {
            this.close(); 
        });
    }

    static async runRefresh() {
        const moduleId = "sequencer-database-entries";
        const settingsPath = game.settings.get(moduleId, 'assetsPath');

        if (!settingsPath) {
            return ui.notifications.error("SDE | Please set an Assets Filepath first!");
        }

        ui.notifications.info("SDE | Refreshing Database...");
        
        try {
            const DATABASE = await generateDatabase(settingsPath);
            await game.settings.set(moduleId, 'sequencerDatabase', DATABASE);
            ui.notifications.info("SDE | Database Refresh Complete!");

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
                            ui.notifications.warn("SDE | Changes will not take effect until the next reload.");
                        }
                    }
                },
                default: "yes"
            }).render(true);
        } catch (err) {
            console.error("SDE | Refresh Failed:", err);
            ui.notifications.error("SDE | Refresh Failed. Check console for details.");
        }
    }

    // Overriding render so the window never actually appears to the user
    render() {
        return this;
    }
}