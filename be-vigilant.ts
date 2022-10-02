import {define, BeDecoratedProps } from 'be-decorated/be-decorated.js';
import {Actions, Proxy, PP, VirtualProps} from './types';
import {register} from 'be-hive/register.js';
import {defaultProps, BeWatching, virtualProps, actions as BeWatchingActions} from 'be-watching/be-watching.js';

export class BeVigilant extends BeWatching implements Actions{
    
    async onWatchForBs({proxy}: PP) {
        const {attachBehiviors} = await import('./attachBehiviors.js');
        await attachBehiviors(proxy.self);
    }

    async doAddedNode({matchActions, forBs, self, dispatchInfo}: PP, node: Node) {
        if(node instanceof Element){
            for(const selector in matchActions){
                if(node.matches(selector)){
                    const match = matchActions[selector];
                    node.dispatchEvent(new CustomEvent(match.dispatchInfo, {

                    }));
                }
            }
        }
        if(forBs){
            const {attachBehiviors} = await import('./attachBehiviors.js');
            await attachBehiviors(self!);
        }
        if(dispatchInfo){
            self.dispatchEvent(new CustomEvent(dispatchInfo, {
                detail: {
                    node,
                }
            }));
        }
    }

    async doRemovedNode(pp: PP, node: Node) {
        
    }

}

const tagName = 'be-vigilant';

const ifWantsToBe = 'vigilant';

const upgrade = '*';


define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            virtualProps: [...virtualProps, 'dispatchInfo', 'forBs', 'matchActions'],
            primaryProp: 'dispatchInfo',
            proxyPropDefaults:{
                ...defaultProps,
                beVigilant: true,
                doInit: true,
                childList: true,
                dispatchInfo: 'be-vigilant-changed',
                for:'*',
            }
        },
        actions:{
            ...BeWatchingActions,
            onWatchForBs: 'forBs',
        }
    },
    complexPropDefaults:{
        controller: BeVigilant,
    }
});

register(ifWantsToBe, upgrade, tagName);