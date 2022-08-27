export async function attachBehiviors(target, mutationSettings) {
    const beHive = target.getRootNode().querySelector('be-hive');
    if (beHive === null)
        return;
    const beDecoratedProps = Array.from(beHive.children);
    for (const beDecor of beDecoratedProps) {
        const el = beDecor;
        await customElements.whenDefined(el.localName);
        const matches = Array.from(target.querySelectorAll(`${beDecor.upgrade}[be-${beDecor.ifWantsToBe}],${beDecor.upgrade}[data-be-${beDecor.ifWantsToBe}]`));
        for (const match of matches) {
            const data = match.hasAttribute(`data-be-${beDecor.ifWantsToBe}`) ? 'data-' : '';
            const attrVal = match.getAttribute(`${data}be-${beDecor.ifWantsToBe}`);
            match.setAttribute(`${data}is-${beDecor.ifWantsToBe}`, attrVal);
            match.removeAttribute(`${data}be-${beDecor.ifWantsToBe}`);
            beDecor.newTargets = [...beDecor.newTargets, match];
        }
    }
    if (mutationSettings !== undefined) {
        const mutationObserver = new MutationObserver((mr) => {
            attachBehiviors(target);
        });
        mutationObserver.observe(target, mutationSettings);
    }
}
