KeyDownCombo v0.1.1
============
##Demos & Examples
[Demos](http://archerproxyserver.appspot.com/jquery-keydowncombo/examples/index.html)

## News
17/04/2014:release.

## How to Use It
``` javascript
$(document).KeyDownCombo({ 
    keys: [38, 38, 40, 40, 37, 39, 37, 39, "B", "A"]
});
```
## API
### Required
- `JQuery.KeyDownCombo.keys` <br/>keycode or words(igrone case)

### Options
- `delayTime` <br/>Deytime between two key down time.
- `limitType` <br/>[default: none, 1: only numbers, 2: only words, 3: Only numbers and words]
- `igrone` <br/>keycode or words(igrone case)

### Events
- `onTimeOutError` <br/>When out key down delay time.
- `onKeyError` <br/>When key down wrong key.
- `onSuccess` <br/>When key down right key.
- `onComplete` <br/>When combo is done.

## KeyCode Comparison Table
| KeyCode       | Word           |
| ------------- |:-------------:|
| 8 | Backspace |
| 9 | Tab |
| 13 | Enter |
| 16 | Shift |
| 17 | Ctrl |
| 18 | Alt |
| 19 | Pause |
| 20 | CapsLock |
| 27 | Esc |
| 32 | Space |
| 33 | PageUp |
| 34 | PageDown |
| 35 | End |
| 36 | Home |
| 37 | leftArrow |
| 38 | upArrow |
| 39 | rightArrow |
| 40 | downArrow |
| 45 | Insert |
| 46 | Delete |
| 48 | Zero |
| 49 | One |
| 50 | Two |
| 51 | Three |
| 52 | Four |
| 53 | Five |
| 54 | Six |
| 55 | Seven |
| 56 | Eight |
| 57 | Nine |
| 65 | A |
| 66 | B |
| 67 | C |
| 68 | D |
| 69 | E |
| 70 | F |
| 71 | G |
| 72 | H |
| 73 | I |
| 74 | J |
| 75 | K |
| 76 | L |
| 77 | M |
| 78 | N |
| 79 | O |
| 80 | P |
| 81 | Q |
| 82 | R |
| 83 | S |
| 84 | T |
| 85 | U |
| 86 | V |
| 87 | W |
| 88 | X |
| 89 | Y |
| 90 | Z |
| 96 | Numpad0 |
| 97 | Numpad1 |
| 98 | Numpad2 |
| 99 | Numpad3 |
| 100 | Numpad4 |
| 101 | Numpad5 |
| 102 | Numpad6 |
| 103 | Numpad7 |
| 104 | Numpad8 |
| 105 | Numpad9 |
| 106 | Multiply |
| 107 | Plus | 
| 109 | Minut |
| 110 | Dot |
| 111 | Slash | 
| 112 | F1 |
| 113 | F2 |
| 114 | F3 |
| 115 | F4 |
| 116 | F5 |
| 117 | F6 |
| 118 | F7 |
| 119 | F8 |
| 120 | F9 |
| 121 | F10 |
| 122 | F11 |
| 123 | F12 |
| 144 | NumLock |
| 145 | ScrollLock |
| 186 | Semicolon |
| 187 | Equals | 
| 188 | Comma | 
| 189 | Minus |
| 190 | Period | 
| 191 | Slash |
| 192 | BackTick |
| 219 | LeftBrackets |
| 220 | BackSlash |
| 221 | RightBrackets |
| 222 | Apostrophe |
## About
author:Archer Hsieh<br/>
e-mail: kevin8685@gmail.com
