import {DEMethods } from 'be-decorated/types.js';

export async  function attachBehiviors(target: Element, mutationSettings?: MutationObserverInit){
    const beHive = (target.getRootNode() as DocumentFragment).querySelector('be-hive');
    if(beHive === null) return;
    const DEs = Array.from(beHive.children) as any as DEMethods[];
    for(const de of DEs){
        const el = de as any as Element;
        await customElements.whenDefined(el.localName);
        const upgrade = el.getAttribute('upgrade');
        const ifWantsToBe = el.getAttribute('if-wants-to-be');
        const matches = Array.from(target.querySelectorAll(`${upgrade}[be-${ifWantsToBe}],${upgrade}[data-be-${ifWantsToBe}]`));
        for(const match of matches){
            const data = match.hasAttribute(`data-be-${ifWantsToBe}`) ? 'data-' : '';
            const attrVal = match.getAttribute(`${data}be-${ifWantsToBe}`);
            match.setAttribute(`${data}is-${ifWantsToBe}`, attrVal!);
            match.removeAttribute(`${data}be-${ifWantsToBe}`);
            de.attach(match);
        }
    }
    if(mutationSettings !== undefined){
        const mutationObserver = new MutationObserver((mr: MutationRecord[]) => {
            attachBehiviors(target);
        });
        mutationObserver.observe(target, mutationSettings);
    }
    
}
