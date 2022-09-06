import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeVigilant {
    #mutationObserver;
    async onWatchForBs({ proxy }) {
        const { attachBehiviors } = await import('./attachBehiviors.js');
        await attachBehiviors(proxy.self);
    }
    addObserver({ dispatchInfo, matchActions, proxy }) {
        if (!dispatchInfo && !matchActions)
            return;
        this.removeObserver();
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(proxy.self, this);
        this.callback([], this.#mutationObserver); //notify subscribers that the observer is ready
    }
    callback = async (mutationList, observer) => {
        const { matchActions, dispatchInfo } = this.proxy;
        for (const mut of mutationList) {
            if (this.proxy.forBs) {
                const { attachBehiviors } = await import('./attachBehiviors.js');
                await attachBehiviors(this.proxy.self);
            }
            if (matchActions) {
                const addedNodes = Array.from(mut.addedNodes);
                for (const node of addedNodes) {
                    if (!node.dispatchEvent)
                        continue;
                    for (const selector in matchActions) {
                        if (node.matches(selector)) {
                            const match = matchActions[selector];
                            node.dispatchEvent(new CustomEvent(match.dispatchInfo, {}));
                        }
                    }
                }
            }
        }
        if (dispatchInfo) {
            this.proxy.self.dispatchEvent(new CustomEvent(dispatchInfo, {
                detail: {
                    mutationList,
                }
            }));
        }
    };
    removeObserver() {
        if (!this.#mutationObserver) {
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }
    finale(proxy, target, beDecor) {
        this.removeObserver();
    }
}
const tagName = 'be-vigilant';
const ifWantsToBe = 'vigilant';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            virtualProps: ['subtree', 'attributes', 'characterData', 'childList', 'dispatchInfo', 'forBs', 'matchActions'],
            primaryProp: 'dispatchInfo',
            proxyPropDefaults: {
                childList: true,
                dispatchInfo: 'be-vigilant-changed',
            }
        },
        actions: {
            addObserver: {
                ifKeyIn: ['subtree', 'attributes', 'characterData', 'childList', 'dispatchInfo', 'matchActions'],
            },
            onWatchForBs: 'forBs',
        }
    },
    complexPropDefaults: {
        controller: BeVigilant,
    }
});
register(ifWantsToBe, upgrade, tagName);
