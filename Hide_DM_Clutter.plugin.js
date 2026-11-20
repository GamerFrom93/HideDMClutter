/**
 * @name Hide DM Clutter
 * @author GamerFrom93
 * @description Hides the Nitro, Shop, and Quests menus in Discord's Direct Messages area. Did this on account me finding them fucking annoying and invasive.
 * @version 1.0.0
 */

module.exports = class HideDMClutter {
    constructor() {
        this.pluginName = "HideDMClutter";
        this.styleId = "HideDMClutter-style";
        this.defaultSettings = {
            hideNitro: true,
            hideShop: true,
            hideQuests: true
        };
        this.settings = { ...this.defaultSettings };
    }

    loadSettings() {
        if (typeof BdApi !== "undefined" && BdApi.Data?.load) {
            const saved = BdApi.Data.load(this.pluginName, "settings");
            this.settings = { ...this.defaultSettings, ...(saved || {}) };
        }
    }

    saveSettings() {
        if (typeof BdApi !== "undefined" && BdApi.Data?.save) {
            BdApi.Data.save(this.pluginName, "settings", this.settings);
        }
    }

    buildCSS() {
        const selectors = [];

        if (this.settings.hideNitro) {
            selectors.push(
                'a[href="/store"]',
                'li:has(a[href="/store"])',
                '[data-list-item-id$="___nitro"]',
                'li:has([data-list-item-id$="___nitro"])'
            );
        }

        if (this.settings.hideShop) {
            selectors.push(
                'a[href="/shop"]',
                'li:has(a[href="/shop"])',
                '[data-list-item-id$="___shop"]',
                'li:has([data-list-item-id$="___shop"])'
            );
        }

        if (this.settings.hideQuests) {
            selectors.push(
                'a[href="/quest-home"]',
                'a[href="/quests"]',
                'li:has(a[href="/quest-home"])',
                'li:has(a[href="/quests"])',
                '[data-list-item-id$="___quests"]',
                'li:has([data-list-item-id$="___quests"])',
                '[data-testid*="quest-bar-container"]'
            );
        }

        if (selectors.length === 0) return "";
        return `${selectors.join(",\n")} {\n    display: none !important;\n}`;
    }

    applyStyles() {
        this.removeStyles();
        const css = this.buildCSS();
        if (!css) return;

        if (typeof BdApi !== "undefined" && BdApi.DOM?.addStyle) {
            BdApi.DOM.addStyle(this.styleId, css);
        } else if (typeof BdApi !== "undefined" && BdApi.injectCSS) {
            BdApi.injectCSS(this.styleId, css);
        }
    }

    removeStyles() {
        if (typeof BdApi !== "undefined" && BdApi.DOM?.removeStyle) {
            BdApi.DOM.removeStyle(this.styleId);
        } else if (typeof BdApi !== "undefined" && BdApi.clearCSS) {
            BdApi.clearCSS(this.styleId);
        }
    }

    start() {
        this.loadSettings();
        this.applyStyles();
    }

    stop() {
        this.removeStyles();
    }

    getSettingsPanel() {
        const panel = document.createElement("div");
        panel.style.padding = "12px";
        panel.style.display = "flex";
        panel.style.flexDirection = "column";
        panel.style.gap = "12px";
        panel.style.color = "var(--text-normal, #dcddde)";

        const options = [
            { key: "hideNitro", label: "Hide Nitro menu", desc: "Hides the Nitro tab in the Direct Messages sidebar." },
            { key: "hideShop", label: "Hide Shop menu", desc: "Hides the Shop tab in the Direct Messages sidebar." },
            { key: "hideQuests", label: "Hide Quests menu", desc: "Hides the Quests tab and Quest progress bar in the Direct Messages area." }
        ];

        for (const opt of options) {
            const row = document.createElement("label");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.justifyContent = "space-between";
            row.style.cursor = "pointer";
            row.style.padding = "8px 10px";
            row.style.borderRadius = "6px";
            row.style.background = "var(--background-secondary, rgba(255, 255, 255, 0.04))";

            const textWrap = document.createElement("div");
            const title = document.createElement("div");
            title.textContent = opt.label;
            title.style.fontWeight = "600";
            title.style.fontSize = "14px";

            const desc = document.createElement("div");
            desc.textContent = opt.desc;
            desc.style.fontSize = "12px";
            desc.style.opacity = "0.75";

            textWrap.appendChild(title);
            textWrap.appendChild(desc);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = Boolean(this.settings[opt.key]);
            checkbox.style.width = "18px";
            checkbox.style.height = "18px";
            checkbox.style.cursor = "pointer";

            checkbox.addEventListener("change", () => {
                this.settings[opt.key] = checkbox.checked;
                this.saveSettings();
                this.applyStyles();
            });

            row.appendChild(textWrap);
            row.appendChild(checkbox);
            panel.appendChild(row);
        }

        return panel;
    }
};
