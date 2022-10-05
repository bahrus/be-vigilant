import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
import { defaultProps, BeWatching, virtualProps, actions as BeWatchingActions } from 'be-watching/be-watching.js';
export class BeVigilant extends BeWatching {
    async onWatchForBs({ proxy }) {
        const { attachBehiviors } = await import('./attachBehiviors.js');
        await attachBehiviors(proxy.self);
    }
    async doAddedNode({ matchActions, forBs, self, dispatchInfo }, node) {
        if (node instanceof Element) {
            for (const selector in matchActions) {
                if (node.matches(selector)) {
                    const match = matchActions[selector];
                    node.dispatchEvent(new CustomEvent(match.dispatchInfo, {}));
                }
            }
        }
        if (forBs) {
            const { attachBehiviors } = await import('./attachBehiviors.js');
            await attachBehiviors(self);
        }
        if (dispatchInfo) {
            self.dispatchEvent(new CustomEvent(dispatchInfo, {
                detail: {
                    node,
                }
            }));
        }
    }
    async doRemovedNode(pp, node) {
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
            virtualProps: [...virtualProps, 'dispatchInfo', 'forBs', 'matchActions'],
            primaryProp: 'dispatchInfo',
            proxyPropDefaults: {
                ...defaultProps,
                beVigilant: true,
                doInit: true,
                childList: true,
                dispatchInfo: 'be-vigilant-changed',
                forAll: '*',
            }
        },
        actions: {
            ...BeWatchingActions,
            onWatchForBs: 'forBs',
        }
    },
    complexPropDefaults: {
        controller: BeVigilant,
    }
});
register(ifWantsToBe, upgrade, tagName);
