# Knots [![Build Status](https://travis-ci.org/graincreative/knots.svg?branch=master)](https://travis-ci.org/graincreative/knots)

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
