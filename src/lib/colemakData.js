// colemak completely sequential isomorphic piano layout
// every row flows continuously and sequentially from left to right:
// c -> d -> e -> f -> g -> a -> b -> c -> d -> e -> f -> g -> a -> b...

export function midiToFreq(midi) {
  return +(440 * Math.pow(2, (midi - 69) / 12)).toFixed(2);
}

const NOTE_NAMES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

export function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const name = NOTE_NAMES[midi % 12];
  return `${name}${octave}`;
}

export const KEYBOARD_ROWS = [
  // row 0: tier 2 number row (c5 - a6)
  [
    { code: 'Backquote', char: '`', qwertyChar: '`', width: 1, midi: 71, hand: 'left' },
    { code: 'Digit1', char: '1', qwertyChar: '1', width: 1, midi: 72, hand: 'left' },   // c5
    { code: 'Digit2', char: '2', qwertyChar: '2', width: 1, midi: 74, hand: 'left' },   // d5
    { code: 'Digit3', char: '3', qwertyChar: '3', width: 1, midi: 76, hand: 'left' },   // e5
    { code: 'Digit4', char: '4', qwertyChar: '4', width: 1, midi: 77, hand: 'left' },   // f5
    { code: 'Digit5', char: '5', qwertyChar: '5', width: 1, midi: 79, hand: 'left' },   // g5
    { code: 'Digit6', char: '6', qwertyChar: '6', width: 1, midi: 81, hand: 'left' },   // a5
    { code: 'Digit7', char: '7', qwertyChar: '7', width: 1, midi: 83, hand: 'right' },  // b5
    { code: 'Digit8', char: '8', qwertyChar: '8', width: 1, midi: 84, hand: 'right' },  // c6
    { code: 'Digit9', char: '9', qwertyChar: '9', width: 1, midi: 86, hand: 'right' },  // d6
    { code: 'Digit0', char: '0', qwertyChar: '0', width: 1, midi: 88, hand: 'right' },  // e6
    { code: 'Minus', char: '-', qwertyChar: '-', width: 1, midi: 89, hand: 'right' },   // f6
    { code: 'Equal', char: '=', qwertyChar: '=', width: 1, midi: 91, hand: 'right' },   // g6
    { code: 'Backspace', char: 'backspace', qwertyChar: 'bksp', label: 'bksp', width: 2, midi: 93, isModifier: true, hand: 'right' }
  ],

  // row 1: tier 1 upper row (c4 - a5)
  [
    { code: 'Tab', char: 'tab', qwertyChar: 'tab', label: 'tab', width: 1.5, midi: 59, isModifier: true, hand: 'left' },
    { code: 'KeyQ', char: 'q', qwertyChar: 'q', width: 1, midi: 60, hand: 'left' }, // c4
    { code: 'KeyW', char: 'w', qwertyChar: 'w', width: 1, midi: 62, hand: 'left' }, // d4
    { code: 'KeyE', char: 'f', qwertyChar: 'e', width: 1, midi: 64, hand: 'left' }, // e4
    { code: 'KeyR', char: 'p', qwertyChar: 'r', width: 1, midi: 65, hand: 'left' }, // f4
    { code: 'KeyT', char: 'g', qwertyChar: 't', width: 1, midi: 67, hand: 'left' }, // g4
    { code: 'KeyY', char: 'j', qwertyChar: 'y', width: 1, midi: 69, hand: 'left' }, // a4
    { code: 'KeyU', char: 'l', qwertyChar: 'u', width: 1, midi: 71, hand: 'right' }, // b4
    { code: 'KeyI', char: 'u', qwertyChar: 'i', width: 1, midi: 72, hand: 'right' }, // c5
    { code: 'KeyO', char: 'y', qwertyChar: 'o', width: 1, midi: 74, hand: 'right' }, // d5
    { code: 'KeyP', char: ';', qwertyChar: 'p', width: 1, midi: 76, hand: 'right' }, // e5
    { code: 'BracketLeft', char: '[', qwertyChar: '[', width: 1, midi: 77, hand: 'right' }, // f5
    { code: 'BracketRight', char: ']', qwertyChar: ']', width: 1, midi: 79, hand: 'right' }, // g5
    { code: 'Backslash', char: '\\', qwertyChar: '\\', width: 1.5, midi: 81, hand: 'right' }  // a5
  ],

  // row 2: tier 2 home row (d5 - a6)
  [
    { code: 'CapsLock', char: 'caps', qwertyChar: 'caps', label: 'caps/bksp', width: 1.75, midi: 72, isModifier: true, hand: 'left' },
    { code: 'KeyA', char: 'a', qwertyChar: 'a', width: 1, midi: 74, hand: 'left' }, // d5
    { code: 'KeyS', char: 'r', qwertyChar: 's', width: 1, midi: 76, hand: 'left' }, // e5
    { code: 'KeyD', char: 's', qwertyChar: 'd', width: 1, midi: 77, hand: 'left' }, // f5
    { code: 'KeyF', char: 't', qwertyChar: 'f', width: 1, midi: 79, hasNub: true, hand: 'left' }, // g5
    { code: 'KeyG', char: 'd', qwertyChar: 'g', width: 1, midi: 81, hand: 'left' }, // a5
    { code: 'KeyH', char: 'h', qwertyChar: 'h', width: 1, midi: 83, hand: 'left' }, // b5
    { code: 'KeyJ', char: 'n', qwertyChar: 'j', width: 1, midi: 84, hasNub: true, hand: 'right' }, // c6
    { code: 'KeyK', char: 'e', qwertyChar: 'k', width: 1, midi: 86, hand: 'right' }, // d6
    { code: 'KeyL', char: 'i', qwertyChar: 'l', width: 1, midi: 88, hand: 'right' }, // e6
    { code: 'Semicolon', char: 'o', qwertyChar: ';', width: 1, midi: 89, hand: 'right' }, // f6
    { code: 'Quote', char: "'", qwertyChar: "'", width: 1, midi: 91, hand: 'right' }, // g6
    { code: 'Enter', char: 'enter', qwertyChar: 'enter', label: 'enter', width: 2.25, midi: 93, isModifier: true, hand: 'right' }
  ],

  // row 3: tier 1 bottom row (e4 - b5)
  [
    { code: 'ShiftLeft', char: 'shift', qwertyChar: 'shift', label: 'shift', width: 2.25, midi: 64, isModifier: true, hand: 'left' },
    { code: 'KeyZ', char: 'z', qwertyChar: 'z', width: 1, midi: 65, hand: 'left' }, // f4
    { code: 'KeyX', char: 'x', qwertyChar: 'x', width: 1, midi: 67, hand: 'left' }, // g4
    { code: 'KeyC', char: 'c', qwertyChar: 'c', width: 1, midi: 69, hand: 'left' }, // a4
    { code: 'KeyV', char: 'v', qwertyChar: 'v', width: 1, midi: 71, hand: 'left' }, // b4
    { code: 'KeyB', char: 'b', qwertyChar: 'b', width: 1, midi: 72, hand: 'left' }, // c5
    { code: 'KeyN', char: 'k', qwertyChar: 'n', width: 1, midi: 74, hand: 'right' }, // d5
    { code: 'KeyM', char: 'm', qwertyChar: 'm', width: 1, midi: 76, hand: 'right' }, // e5
    { code: 'Comma', char: ',', qwertyChar: ',', width: 1, midi: 77, hand: 'right' }, // f5
    { code: 'Period', char: '.', qwertyChar: '.', width: 1, midi: 79, hand: 'right' }, // g5
    { code: 'Slash', char: '/', qwertyChar: '/', width: 1, midi: 81, hand: 'right' },  // a5
    { code: 'ShiftRight', char: 'shift', qwertyChar: 'shift', label: 'shift', width: 2.75, midi: 83, isModifier: true, hand: 'right' }
  ],

  // row 4: sustain damper pedal
  [
    { code: 'ControlLeft', char: 'ctrl', qwertyChar: 'ctrl', label: 'ctrl', width: 1.25, isModifier: true, hand: 'left' },
    { code: 'AltLeft', char: 'opt', qwertyChar: 'opt', label: 'opt', width: 1.25, isModifier: true, hand: 'left' },
    { code: 'MetaLeft', char: 'cmd', qwertyChar: 'cmd', label: 'cmd', width: 1.25, isModifier: true, hand: 'left' },
    { code: 'Space', char: 'space', qwertyChar: 'space', label: 'space', width: 6.25, isSustainPedal: true },
    { code: 'MetaRight', char: 'cmd', qwertyChar: 'cmd', label: 'cmd', width: 1.25, isModifier: true, hand: 'right' },
    { code: 'AltRight', char: 'opt', qwertyChar: 'opt', label: 'opt', width: 1.25, isModifier: true, hand: 'right' },
    { code: 'ContextMenu', char: 'fn', qwertyChar: 'fn', label: 'fn', width: 1.25, isModifier: true, hand: 'right' },
    { code: 'ControlRight', char: 'ctrl', qwertyChar: 'ctrl', label: 'ctrl', width: 1.25, isModifier: true, hand: 'right' }
  ]
];

export const ALL_KEYS = KEYBOARD_ROWS.flat().map((key) => {
  const noteName = key.midi ? midiToNoteName(key.midi) : null;
  const freq = key.midi ? midiToFreq(key.midi) : null;
  return {
    ...key,
    noteName,
    freq
  };
});

export const KEY_BY_CODE = new Map(ALL_KEYS.map((k) => [k.code, k]));
export const KEY_BY_CHAR = new Map(ALL_KEYS.map((k) => [k.char.toLowerCase(), k]));
