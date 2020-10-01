# stylelint

yarn stylelint | wc -l   # stylelint-config-standard
1302

## Variant a

After --fix

157

```
  "rules": {
    "selector-pseudo-element-colon-notation": null,
    "at-rule-no-unknown": null,
    "no-duplicate-selectors": null,
    "no-descending-specificity": null,
    "declaration-block-no-shorthand-property-overrides": null
  }
```

0

## Variant b

```
  "rules": {
    "rule-empty-line-before": null,
    "selector-pseudo-element-colon-notation": null,
    "at-rule-no-unknown": null,
    "no-duplicate-selectors": null,
    "no-descending-specificity": null,
    "declaration-block-no-shorthand-property-overrides": null
  }
```

615

After --fix

0

## Variant 2a

yarn stylelint | wc -l   # stylelint-config-sass-guidelines

2652
