import {define, BeDecoratedProps } from 'be-decorated/be-decorated.js';
import {BeVigilantActions, BeVigilantProps, BeVigilantVirtualProps} from './types';
import {register} from 'be-hive/register.js';


export class BeVigilantController implements BeVigilantActions{
    #target: Element | undefined;
    #mutationObserver: MutationObserver | undefined;

    // async attachBehiviors(){
    //     const beHive = (this.#target!.getRootNode() as DocumentFragment).querySelector('be-hive');
    //     if(beHive === null) return;
    //     const beDecoratedProps = Array.from(beHive.children) as any as BeDecoratedProps[];
    //     for(const beDecor of beDecoratedProps){
    //         const el = beDecor as any as Element;
    //         await customElements.whenDefined(el.localName);
    //         const matches = Array.from(this.#target!.querySelectorAll(`${beDecor.upgrade}[be-${beDecor.ifWantsToBe}],${beDecor.upgrade}[data-be-${beDecor.ifWantsToBe}]`));
            
    //         for(const match of matches){
    //             const data = match.hasAttribute(`data-be-${beDecor.ifWantsToBe}`) ? 'data-' : '';
    //             const attrVal = match.getAttribute(`${data}be-${beDecor.ifWantsToBe}`);
    //             match.setAttribute(`${data}is-${beDecor.ifWantsToBe}`, attrVal!);
    //             match.removeAttribute(`${data}be-${beDecor.ifWantsToBe}`);
    //             beDecor.newTarget = match;
    //         }
    //     }
    // }

    
    intro(proxy: Element & BeVigilantVirtualProps, target: Element, beDecor: BeDecoratedProps){
        this.#target = target;
        //this.attachBehiviors();
    }

    async onWatchForBs(self: this) {
        const {attachBehiviors} = await import('./attachBehiviors.js');
        await attachBehiviors(this.#target!);
    }

    addObserver({}: this){
        this.removeObserver(this);
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(this.#target!, this as MutationObserverInit);
        this.callback([], this.#mutationObserver);//notify subscribers that the observer is ready
    }

    callback = async (mutationList: MutationRecord[], observer: MutationObserver) => {
        for(const mut of mutationList){
            const addedNodes = Array.from(mut.addedNodes);
            if(this.proxy.forBs){
                let foundBeHiveElement = false;
                for(const addedNode of addedNodes){
                    if(addedNode.nodeType === Node.ELEMENT_NODE){
                        const attrs = (addedNode as Element).attributes;
                        for(let i = 0, ii = attrs.length; i < ii; i++){
                            const attr = attrs[i];
                            if(attr.name.startsWith('be-') || attr.name.startsWith('data-be-')){
                                foundBeHiveElement = true;
                                break;
                            }
                        }
    
                    }
                }
                if(foundBeHiveElement){
                    const {attachBehiviors} = await import('./attachBehiviors.js');
                    await attachBehiviors(this.#target!);
                }
            }

        }
        if(this.dispatchInfo){
            this.#target!.dispatchEvent(new CustomEvent(this.dispatchInfo, {
                detail: {
                    mutationList,
                }
            }));
        }

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
            virtualProps: ['subtree', 'attributes', 'characterData', 'childList', 'dispatchInfo', 'forBs', 'matchActions'],
            primaryProp: 'asType',
            proxyPropDefaults:{
                childList: true,
                dispatchInfo: 'be-vigilant-changed',
            }
        },
        actions:{
            addObserver: {
                ifAllOf: ['dispatchInfo'],
                ifKeyIn: ['subtree', 'attributes', 'characterData', 'childList'],
            },
            onWatchForBs: 'forBs',
        }
    },
    complexPropDefaults:{
        controller: BeVigilantController,
    }
});

register(ifWantsToBe, upgrade, tagName);