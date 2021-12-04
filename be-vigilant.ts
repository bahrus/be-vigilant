import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeVigilantActions, BeVigilantProps, BeVigilantVirtualProps} from './types';
import {register} from 'be-hive/register.js';

export class BeVigilantController implements BeVigilantActions{
    #target: Element | undefined;
    #mutationObserver: MutationObserver | undefined;
    intro(proxy: Element & BeVigilantVirtualProps, target: Element, beDecor: BeDecoratedProps){
        this.#target = target;
    }

    addObserver({}: this){
        this.removeObserver(this);
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(this.#target!, this as MutationObserverInit);
    }

    callback = (mutationList: MutationRecord[], observer: MutationObserver) => {
        this.#target!.dispatchEvent(new CustomEvent(this.asType, {
            detail: {
                mutationList,
            }
        }));
    }

    removeObserver({}: this){
        if(!this.#mutationObserver){
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }

    finale(proxy: Element & BeVigilantVirtualProps, target: Element, beDecor: BeDecoratedProps){
        this.removeObserver(this);
        this.#target = undefined;
    }
}

export interface BeVigilantController extends BeVigilantProps{}

const tagName = 'be-vigilant';

const ifWantsToBe = 'vigilant';

const upgrade = '*';


define<BeVigilantProps & BeDecoratedProps<BeVigilantProps, BeVigilantActions>, BeVigilantActions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            intro: 'intro',
            virtualProps: ['subtree', 'attributes', 'characterData', 'childList', 'asType'],
            primaryProp: 'asType',
            proxyPropDefaults:{
                childList: true,
            }
        },
        actions:{
            addObserver: {
                ifAllOf: ['asType'],
                ifKeyIn: ['subtree', 'attributes', 'characterData', 'childList'],
            }
        }
    },
    complexPropDefaults:{
        controller: BeVigilantController,
    }
});

register(ifWantsToBe, upgrade, tagName);