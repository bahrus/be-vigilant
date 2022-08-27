import {define, BeDecoratedProps } from 'be-decorated/be-decorated.js';
import {BeVigilantActions, BeVigilantProps, BeVigilantVirtualProps} from './types';
import {register} from 'be-hive/register.js';


export class BeVigilantController implements BeVigilantActions{
    #mutationObserver: MutationObserver | undefined;
    async onWatchForBs({proxy}: this) {
        const {attachBehiviors} = await import('./attachBehiviors.js');
        await attachBehiviors(proxy.self);
    }


    addObserver({dispatchInfo, matchActions, proxy}: this){
        if(!dispatchInfo && !matchActions) return;
        this.removeObserver(this);
        this.#mutationObserver = new MutationObserver(this.callback);
        this.#mutationObserver.observe(proxy.self!, this as MutationObserverInit);
        this.callback([], this.#mutationObserver);//notify subscribers that the observer is ready
    }

    callback = async (mutationList: MutationRecord[], observer: MutationObserver) => {
        for(const mut of mutationList){
            
            if(this.proxy.forBs){
                const {attachBehiviors} = await import('./attachBehiviors.js');
                await attachBehiviors(this.proxy.self!);
            }
            const {matchActions} = this;
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
        if(this.dispatchInfo){
            this.proxy.self.dispatchEvent(new CustomEvent(this.dispatchInfo, {
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
        controller: BeVigilantController,
    }
});

register(ifWantsToBe, upgrade, tagName);