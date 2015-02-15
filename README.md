# Knots

![Tests Status](https://codeship.com/projects/5011f040-8a31-0132-96df-7acbd47feca1/status?branch=master)


### Example

```js
const Knots = require('knots');
const knots = new Knots();

knots.tie('base', () => [require('./partials/header.js'), require('./partials/footer.js']);
knots.tie('page:contact', () => [require('./pages/contact.js')]);

knots.run(['base']);
```

*header.js*
```js
module.exports = function HeaderPartial() {
    // stuff

    return () => {
        // onload
    }
}
```
