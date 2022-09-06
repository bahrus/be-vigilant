import {define, BeDecoratedProps } from 'be-decorated/be-decorated.js';
import {Actions, Proxy, PP, VirtualProps, Controller} from './types';
import {register} from 'be-hive/register.js';


export class BeVigilant implements Actions{
    #mutationObserver: MutationObserver | undefined;
    async onWatchForBs({proxy}: PP) {
        const {attachBehiviors} = await import('./attachBehiviors.js');
        await attachBehiviors(proxy.self);
    }


    addObserver({dispatchInfo, matchActions, proxy}: PP){
        if(!dispatchInfo && !matchActions) return;
        this.removeObserver();
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(proxy.self!, this as MutationObserverInit);
        this.callback([], this.#mutationObserver);//notify subscribers that the observer is ready
    }

    callback = async (mutationList: MutationRecord[], observer: MutationObserver) => {
        const {matchActions, dispatchInfo} = this.proxy;
        for(const mut of mutationList){
            
            if(this.proxy.forBs){
                const {attachBehiviors} = await import('./attachBehiviors.js');
                await attachBehiviors(this.proxy.self!);
            }
            
            if(matchActions){
                const addedNodes = Array.from(mut.addedNodes) as Element[];
                for(const node of addedNodes){
                    if(!node.dispatchEvent) continue;
                    for(const selector in matchActions){
                        if(node.matches(selector)){
                            const match = matchActions[selector];
                            node.dispatchEvent(new CustomEvent(match.dispatchInfo, {

                            }));
                        }
                    }
                }
            }

        }
        if(dispatchInfo){
            this.proxy.self.dispatchEvent(new CustomEvent(dispatchInfo, {
                detail: {
                    mutationList,
                }
            }));
        }
        

    }

    removeObserver(){
        if(!this.#mutationObserver){
            return;
        }
        this.#mutationObserver.disconnect();
        this.#mutationObserver = undefined;
    }

    finale(proxy: Proxy, target: Element, beDecor: BeDecoratedProps){
        this.removeObserver();
    }
}

export interface BeVigilant extends Controller{}

const tagName = 'be-vigilant';

const ifWantsToBe = 'vigilant';

const upgrade = '*';


define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            virtualProps: ['subtree', 'attributes', 'characterData', 'childList', 'dispatchInfo', 'forBs', 'matchActions'],
            primaryProp: 'dispatchInfo',
            proxyPropDefaults:{
                childList: true,
                dispatchInfo: 'be-vigilant-changed',
            }
        },
        actions:{
            addObserver: {
                ifKeyIn: ['subtree', 'attributes', 'characterData', 'childList', 'dispatchInfo', 'matchActions'],
            },
            onWatchForBs: 'forBs',
        }
    },
    complexPropDefaults:{
        controller: BeVigilant,
    }
});

register(ifWantsToBe, upgrade, tagName);