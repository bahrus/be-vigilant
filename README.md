# be-vigilant [TODO]

Add mutation observer to element.  Notify host, self or upsearched elements via [be-noticed](https://github.com/bahrus/be-noticed) binding syntax.

```html
<div be-vigilant='{
        "childList": true,
        "mutationMatchTransformations": {
            "*": {
                ":host": {},
                "self": {},

            }
        }
}'>
...
</div>
```

mmt abbrev for mutationMatchTransformations

Shares code with be-transformative.

Gives us ":has" functionality among other things.