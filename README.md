# be-vigilant

Add mutation observer to element.

Use case:  Many UI libraries are built around communicating between elements via events.  be-vigilant translates mutation changes into events.

```html
<div be-vigilant=my-event-name>
...
</div>
```

Event my-event-name is fired when the direct children of the div element change.

If the value of the attribute isn't specified, the default event name is be-vigilian-changed.

be-vigilant also provides a brute-force way of registering be-decorated elements that, due to css oddities, aren't always picked up.

For example:

```html
<select>
    <template be-repeated></template>
</select>
```

Using the standard ways be-decorated elements are registered via css animation queries, this template simply won't be registered.

be-vigilant will cause it to register:

```html
<select be-vigilant>
    <template be-repeated></template>
</select>
```

To fine tune how the mutation observer is configured:

```html
<div be-vigilant='{
    "subtree": true,
    "asType": "my-event-name"
}'>
...
</div>
```