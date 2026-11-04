// colemak completely sequential isomorphic piano layout
// every row flows continuously and sequentially from left to right:
// c -> d -> e -> f -> g -> a -> b -> c -> d -> e -> f -> g -> a -> b...

export const HOME_POSITIONS = [
  { id: 'c4', label: 'c major (c4)', rootStep: 28 },
  { id: 'g4', label: 'g major (g4)', rootStep: 32 },
  { id: 'f4', label: 'f major (f4)', rootStep: 31 },
  { id: 'd4', label: 'd position (d4)', rootStep: 29 },
  { id: 'a4', label: 'a minor (a4)', rootStep: 33 },
  { id: 'c3', label: 'bass c (c3)', rootStep: 21 },
  { id: 'c5', label: 'treble c (c5)', rootStep: 35 }
];

const DIATONIC_INTERVALS = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
const NOTE_NAMES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

export function diatonicStepToMidi(step) {
  const octave = Math.floor(step / 7);
  const degree = ((step % 7) + 7) % 7;
  return (octave + 1) * 12 + DIATONIC_INTERVALS[degree];
}

export function midiToFreq(midi) {
  return +(440 * Math.pow(2, (midi - 69) / 12)).toFixed(2);
}

export function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const name = NOTE_NAMES[midi % 12];
  return `${name}${octave}`;
}

const RAW_KEYBOARD_TEMPLATE = [
  // row 0: tier 2 number row
  [
    { code: 'Backquote', char: '`', qwertyChar: '`', width: 1, diatonicOffset: 6, hand: 'left' },
    { code: 'Digit1', char: '1', qwertyChar: '1', width: 1, diatonicOffset: 7, hand: 'left' },
    { code: 'Digit2', char: '2', qwertyChar: '2', width: 1, diatonicOffset: 8, hand: 'left' },
    { code: 'Digit3', char: '3', qwertyChar: '3', width: 1, diatonicOffset: 9, hand: 'left' },
    { code: 'Digit4', char: '4', qwertyChar: '4', width: 1, diatonicOffset: 10, hand: 'left' },
    { code: 'Digit5', char: '5', qwertyChar: '5', width: 1, diatonicOffset: 11, hand: 'left' },
    { code: 'Digit6', char: '6', qwertyChar: '6', width: 1, diatonicOffset: 12, hand: 'left' },
    { code: 'Digit7', char: '7', qwertyChar: '7', width: 1, diatonicOffset: 13, hand: 'right' },
    { code: 'Digit8', char: '8', qwertyChar: '8', width: 1, diatonicOffset: 14, hand: 'right' },
    { code: 'Digit9', char: '9', qwertyChar: '9', width: 1, diatonicOffset: 15, hand: 'right' },
    { code: 'Digit0', char: '0', qwertyChar: '0', width: 1, diatonicOffset: 16, hand: 'right' },
    { code: 'Minus', char: '-', qwertyChar: '-', width: 1, diatonicOffset: 17, hand: 'right' },
    { code: 'Equal', char: '=', qwertyChar: '=', width: 1, diatonicOffset: 18, hand: 'right' },
    { code: 'Backspace', char: 'backspace', qwertyChar: 'bksp', label: 'bksp', width: 2, isModifier: true, hand: 'right' }
  ],

  // row 1: tier 1 upper row
  [
    { code: 'Tab', char: 'tab', qwertyChar: 'tab', label: 'tab', width: 1.5, isModifier: true, hand: 'left' },
    { code: 'KeyQ', char: 'q', qwertyChar: 'q', width: 1, diatonicOffset: 0, hand: 'left' },
    { code: 'KeyW', char: 'w', qwertyChar: 'w', width: 1, diatonicOffset: 1, hand: 'left' },
    { code: 'KeyE', char: 'f', qwertyChar: 'e', width: 1, diatonicOffset: 2, hand: 'left' },
    { code: 'KeyR', char: 'p', qwertyChar: 'r', width: 1, diatonicOffset: 3, hand: 'left' },
    { code: 'KeyT', char: 'g', qwertyChar: 't', width: 1, diatonicOffset: 4, hand: 'left' },
    { code: 'KeyY', char: 'j', qwertyChar: 'y', width: 1, diatonicOffset: 5, hand: 'left' },
    { code: 'KeyU', char: 'l', qwertyChar: 'u', width: 1, diatonicOffset: 6, hand: 'right' },
    { code: 'KeyI', char: 'u', qwertyChar: 'i', width: 1, diatonicOffset: 7, hand: 'right' },
    { code: 'KeyO', char: 'y', qwertyChar: 'o', width: 1, diatonicOffset: 8, hand: 'right' },
    { code: 'KeyP', char: ';', qwertyChar: 'p', width: 1, diatonicOffset: 9, hand: 'right' },
    { code: 'BracketLeft', char: '[', qwertyChar: '[', width: 1, diatonicOffset: 10, hand: 'right' },
    { code: 'BracketRight', char: ']', qwertyChar: ']', width: 1, diatonicOffset: 11, hand: 'right' },
    { code: 'Backslash', char: '\\', qwertyChar: '\\', width: 1.5, diatonicOffset: 12, hand: 'right' }
  ],

  // row 2: tier 2 home row
  [
    { code: 'CapsLock', char: 'caps', qwertyChar: 'caps', label: 'caps', width: 1.75, isModifier: true, hand: 'left' },
    { code: 'KeyA', char: 'a', qwertyChar: 'a', width: 1, diatonicOffset: 8, hand: 'left' },
    { code: 'KeyS', char: 'r', qwertyChar: 's', width: 1, diatonicOffset: 9, hand: 'left' },
    { code: 'KeyD', char: 's', qwertyChar: 'd', width: 1, diatonicOffset: 10, hand: 'left' },
    { code: 'KeyF', char: 't', qwertyChar: 'f', width: 1, diatonicOffset: 11, hasNub: true, hand: 'left' },
    { code: 'KeyG', char: 'd', qwertyChar: 'g', width: 1, diatonicOffset: 12, hand: 'left' },
    { code: 'KeyH', char: 'h', qwertyChar: 'h', width: 1, diatonicOffset: 13, hand: 'left' },
    { code: 'KeyJ', char: 'n', qwertyChar: 'j', width: 1, diatonicOffset: 14, hasNub: true, hand: 'right' },
    { code: 'KeyK', char: 'e', qwertyChar: 'k', width: 1, diatonicOffset: 15, hand: 'right' },
    { code: 'KeyL', char: 'i', qwertyChar: 'l', width: 1, diatonicOffset: 16, hand: 'right' },
    { code: 'Semicolon', char: 'o', qwertyChar: ';', width: 1, diatonicOffset: 17, hand: 'right' },
    { code: 'Quote', char: "'", qwertyChar: "'", width: 1, diatonicOffset: 18, hand: 'right' },
    { code: 'Enter', char: 'enter', qwertyChar: 'enter', label: 'enter', width: 2.25, isModifier: true, hand: 'right' }
  ],

  // row 3: tier 1 bottom row
  [
    { code: 'ShiftLeft', char: 'shift', qwertyChar: 'shift', label: 'shift', width: 2.25, isModifier: true, hand: 'left' },
    { code: 'KeyZ', char: 'z', qwertyChar: 'z', width: 1, diatonicOffset: 3, hand: 'left' },
    { code: 'KeyX', char: 'x', qwertyChar: 'x', width: 1, diatonicOffset: 4, hand: 'left' },
    { code: 'KeyC', char: 'c', qwertyChar: 'c', width: 1, diatonicOffset: 5, hand: 'left' },
    { code: 'KeyV', char: 'v', qwertyChar: 'v', width: 1, diatonicOffset: 6, hand: 'left' },
    { code: 'KeyB', char: 'b', qwertyChar: 'b', width: 1, diatonicOffset: 7, hand: 'left' },
    { code: 'KeyN', char: 'k', qwertyChar: 'n', width: 1, diatonicOffset: 8, hand: 'right' },
    { code: 'KeyM', char: 'm', qwertyChar: 'm', width: 1, diatonicOffset: 9, hand: 'right' },
    { code: 'Comma', char: ',', qwertyChar: ',', width: 1, diatonicOffset: 10, hand: 'right' },
    { code: 'Period', char: '.', qwertyChar: '.', width: 1, diatonicOffset: 11, hand: 'right' },
    { code: 'Slash', char: '/', qwertyChar: '/', width: 1, diatonicOffset: 12, hand: 'right' },
    { code: 'ShiftRight', char: 'shift', qwertyChar: 'shift', label: 'shift', width: 2.75, isModifier: true, hand: 'right' }
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

export function generateKeyboardRows(homePositionId = 'c4') {
  const pos = HOME_POSITIONS.find((p) => p.id === homePositionId) || HOME_POSITIONS[0];
  const rootStep = pos.rootStep;

  return RAW_KEYBOARD_TEMPLATE.map((row) =>
    row.map((key) => {
      if (typeof key.diatonicOffset === 'number') {
        const midi = diatonicStepToMidi(rootStep + key.diatonicOffset);
        const freq = midiToFreq(midi);
        const noteName = midiToNoteName(midi);
        return {
          ...key,
          midi,
          freq,
          noteName
        };
      }
      return {
        ...key,
        midi: null,
        freq: null,
        noteName: null
      };
    })
  );
}

export const KEYBOARD_ROWS = generateKeyboardRows('c4');
export const ALL_KEYS = KEYBOARD_ROWS.flat();
export const KEY_BY_CODE = new Map(ALL_KEYS.map((k) => [k.code, k]));
export const KEY_BY_CHAR = new Map(ALL_KEYS.map((k) => [k.char.toLowerCase(), k]));
