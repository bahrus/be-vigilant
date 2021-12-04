import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeVigilantController {
    #target;
    #mutationObserver;
    intro(proxy, target, beDecor) {
        this.#target = target;
    }
    addObserver({}) {
        this.removeObserver(this);
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(this.#target, this);
    }
    callback = (mutationList, observer) => {
        this.proxy.mutationList = mutationList;
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
        this.proxy.mutationList = undefined;
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
            virtualProps: ['subtree', 'attributes', 'characterData', 'childList', 'mutationList'],
            emitEvents: ['mutationList'],
        }
    },
    complexPropDefaults: {
        controller: BeVigilantController,
    }
});
register(ifWantsToBe, upgrade, tagName);
