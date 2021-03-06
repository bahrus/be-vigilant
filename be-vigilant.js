import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeVigilantController {
    #target;
    #mutationObserver;
    intro(proxy, target, beDecor) {
        this.#target = target;
    }
    async onWatchForBs(self) {
        const { attachBehiviors } = await import('./attachBehiviors.js');
        await attachBehiviors(this.#target);
    }
    addObserver({}) {
        this.removeObserver(this);
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(this.#target, this);
        this.callback([], this.#mutationObserver); //notify subscribers that the observer is ready
    }
    callback = async (mutationList, observer) => {
        for (const mut of mutationList) {
            if (this.proxy.forBs) {
                const { attachBehiviors } = await import('./attachBehiviors.js');
                await attachBehiviors(this.#target);
            }
            const { matchActions } = this;
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
        if (this.dispatchInfo) {
            this.#target.dispatchEvent(new CustomEvent(this.dispatchInfo, {
                detail: {
                    mutationList,
                }
            }));
        }
    };
    removeObserver({}) {
        if (!this.#mutationObserver) {
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }
    finale(proxy, target, beDecor) {
        this.removeObserver(this);
        this.#target = undefined;
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
            intro: 'intro',
            virtualProps: ['subtree', 'attributes', 'characterData', 'childList', 'dispatchInfo', 'forBs', 'matchActions'],
            primaryProp: 'dispatchInfo',
            proxyPropDefaults: {
                childList: true,
                dispatchInfo: 'be-vigilant-changed',
            }
        },
        actions: {
            addObserver: {
                ifAtLeastOneOf: ['dispatchInfo', 'matchActions', 'dispatchInfo'],
                ifKeyIn: ['subtree', 'attributes', 'characterData', 'childList'],
            },
            onWatchForBs: 'forBs',
        }
    },
    complexPropDefaults: {
        controller: BeVigilantController,
    }
});
register(ifWantsToBe, upgrade, tagName);
