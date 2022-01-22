import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeVigilantController {
    #target;
    #mutationObserver;
    async attachBehiviors() {
        const beHive = this.#target.getRootNode().querySelector('be-hive');
        if (beHive === null)
            return;
        const beDecoratedProps = Array.from(beHive.children);
        for (const beDecor of beDecoratedProps) {
            const el = beDecor;
            await customElements.whenDefined(el.localName);
            const matches = Array.from(this.#target.querySelectorAll(`${beDecor.upgrade}[be-${beDecor.ifWantsToBe}],${beDecor.upgrade}[data-be-${beDecor.ifWantsToBe}]`));
            for (const match of matches) {
                const data = match.hasAttribute(`data-be-${beDecor.ifWantsToBe}`) ? 'data-' : '';
                const attrVal = match.getAttribute(`${data}be-${beDecor.ifWantsToBe}`);
                match.setAttribute(`${data}is-${ifWantsToBe}`, attrVal);
                match.removeAttribute(`${data}be-${ifWantsToBe}`);
                beDecor.newTarget = match;
            }
        }
    }
    intro(proxy, target, beDecor) {
        this.#target = target;
        this.attachBehiviors();
    }
    addObserver({}) {
        this.removeObserver(this);
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(this.#target, this);
        this.callback([], this.#mutationObserver); //notify subscribers that the observer is ready
    }
    callback = (mutationList, observer) => {
        for (const mut of mutationList) {
            const addedNodes = Array.from(mut.addedNodes);
            let foundBeHiveElement = false;
            for (const addedNode of addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    const attrs = addedNode.attributes;
                    for (let i = 0, ii = attrs.length; i < ii; i++) {
                        const attr = attrs[i];
                        if (attr.name.startsWith('be-') || attr.name.startsWith('data-be-')) {
                            foundBeHiveElement = true;
                            break;
                        }
                    }
                }
            }
            if (foundBeHiveElement) {
                this.attachBehiviors();
            }
        }
        this.#target.dispatchEvent(new CustomEvent(this.asType, {
            detail: {
                mutationList,
            }
        }));
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
            virtualProps: ['subtree', 'attributes', 'characterData', 'childList', 'asType'],
            primaryProp: 'asType',
            proxyPropDefaults: {
                childList: true,
                asType: 'be-vigilant-changed',
            }
        },
        actions: {
            addObserver: {
                ifAllOf: ['asType'],
                ifKeyIn: ['subtree', 'attributes', 'characterData', 'childList'],
            }
        }
    },
    complexPropDefaults: {
        controller: BeVigilantController,
    }
});
register(ifWantsToBe, upgrade, tagName);
