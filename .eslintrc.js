module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "node": true,
        "es6": true,
    },
    "rules": {
        // override default options
        "comma-dangle": ["error", "always-multiline"],
        "indent": ["error", 4],
        "no-cond-assign": ["error", "always"],

        // disable now, but enable in the future
        "one-var": "off", // ["error", "never"]

        // disable
        "init-declarations": "off",
        "no-console": "off",
        "no-inline-comments": "off",
    },
    "parserOptions": {
        "ecmaVersion": 8,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
};