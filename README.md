# be-vigilant

Add mutation observer to element.

[![Playwright Tests](https://github.com/bahrus/be-vigilant/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-vigilant/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-vigilant.png)](http://badge.fury.io/js/be-vigilant)

Size, including be-decorated framework:

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-vigilant?style=for-the-badge)](https://bundlephobia.com/result?p=be-vigilant)

Size of new code:

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-vigilant?compression=gzip">



Use case I:  Many UI libraries are built around communicating between elements via events.  be-vigilant translates mutation changes into events.

```html
<div be-vigilant=my-event-name>
...
</div>
```

Event my-event-name is fired from the div element when the direct children of the div element change.

If the value of the attribute isn't specified, the default event name is be-vigilant-changed:

```html
<div be-vigilant>
...
</div>
```


Use case II:  be-vigilant also provides a brute-force way of sniffing out [be-decorated](https://github.com/bahrus/be-decorated) adorned elements, even behind nooks and crannies of the DOM.  be-decorated behaviors search for elements based on css observing, but sometimes those aren't always picked up.

For example:

```html
<select>
    <template be-repeated></template>
</select>
```

Using the standard ways be-decorated elements are registered via css animation queries, this template simply won't be registered.

be-vigilant will cause it to register, if instructed to do so:

```html
<select be-vigilant='{
    "forBs": true
}'>
    <template be-repeated></template>
</select>
```

To fine tune how the mutation observer is configured:

```html
<div be-vigilant='{
    "subtree": true,
    "dispatchInfo": "my-event-name"
}'>
...
</div>
```

Another option, matchActions, provides the ability to specify different event names, based on css match tests on the mutated elements.

## CDN

To use from a CDN:

```html
<script type='module' crossorigin='anonymous'>
    import 'https://esm.run/be-vigilant';
</script>
```



