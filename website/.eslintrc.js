module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "indent": [2, "tab", {"SwitchCase": 1}],
    "semi": [2, "always"],
    "space-before-function-paren": ["error", "never"],
    "no-multiple-empty-lines": [2, {"max": 2, "maxEOF": 0}],
    "no-var": 1,
    "no-tabs": 0,
    "no-console":0,
    "keyword-spacing": ["warn", {"before": true, "after": true, "overrides":
        {
          "if": { "after": false },
          "switch": { "after": false }
        }
      }
    ],
    "eqeqeq":0,
    "no-unused-vars": ["error", {"varsIgnorePattern": "Lory"}]
  },
  globals: {
    "THREE": true,
    "React": true,
    "Vue": true,
    "Lory": true,
    "TimelineLite": false,
    "TimelineMax": false,
    "TweenLite": false,
    "TweenMax": false,
    "Back": false,
    "Bounce": false,
    "Circ": false,
    "Cubic": false,
    "Ease": false,
    "EaseLookup": false,
    "Elastic": false,
    "Expo": false,
    "Linear": false,
    "Power0": false,
    "Power1": false,
    "Power2": false,
    "Power3": false,
    "Power4": false,
    "Quad": false,
    "Quart": false,
    "Quint": false,
    "RoughEase": false,
    "Sine": false,
    "SlowMo": false,
    "SteppedEase": false,
    "Strong": false,
    "Draggable": false,
    "SplitText": false,
    "VelocityTracker": false,
    "CSSPlugin": false,
    "ThrowPropsPlugin": false,
    "BezierPlugin": false}
}
