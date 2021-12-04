# be-vigilant

Add mutation observer to element.

Use case:  Many UI libraries are built around communicating between elements via events.  be-vigilant translates mutation changes into events.

```html
<div be-vigilant=my-event-name>
...
</div>
```

Event my-event-name is fired when the direct children of the div element change.

To fine tune how the mutation observer is configured:

```html
<div be-vigilant='{
    "subtree": true,
    "asType": "my-event-name"
}'>
...
</div>
```