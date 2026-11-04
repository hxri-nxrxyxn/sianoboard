<script>
  import { generateKeyboardRows } from './colemakData.js';
  import { sound } from './soundEngine.js';
  import KeyCap from './KeyCap.svelte';

  let {
    layout = 'colemak',
    homePosition = 'c4',
    octaveShift = 0,
    noteShift = 0,
    showFingerGuides = true,
    disabled = false,
    onchangeoctave,
    onchangenoteshift
  } = $props();

  let activeKeys = $state({});

  let rows = $derived(generateKeyboardRows(homePosition, octaveShift, noteShift));
  let keyByCode = $derived(new Map(rows.flat().map((k) => [k.code, k])));

  function pressKey(key) {
    if (!key || disabled || key.isDisabled) return;

    if (key.isSustainPedal || key.code === 'Space') {
      sound.setSustainPedal(true);
      activeKeys = { ...activeKeys, [key.code]: true };
      return;
    }

    if (activeKeys[key.code]) return;
    activeKeys = { ...activeKeys, [key.code]: true };
    sound.keyDown(key.code, key.freq, key.midi);
  }

  function releaseKey(key) {
    if (!key || key.isDisabled) return;

    if (key.isSustainPedal || key.code === 'Space') {
      sound.setSustainPedal(false);
      const next = { ...activeKeys };
      delete next[key.code];
      activeKeys = next;
      return;
    }

    if (!activeKeys[key.code]) return;
    const next = { ...activeKeys };
    delete next[key.code];
    activeKeys = next;
    sound.keyUp(key.code);
  }

  function handleKeyDown(event) {
    if (disabled) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

    // Do not capture Escape key so it can open settings modal
    if (event.key === 'Escape' || event.code === 'Escape' || event.key === 'Esc') return;

    // ArrowUp: octave up (+1)
    if (event.code === 'ArrowUp' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!event.repeat) {
        onchangeoctave?.(1);
      }
      return;
    }

    // ArrowDown: octave down (-1)
    if (event.code === 'ArrowDown' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (!event.repeat) {
        onchangeoctave?.(-1);
      }
      return;
    }

    // ArrowRight: move notes to right (+1 step)
    if (event.code === 'ArrowRight' || event.key === 'ArrowRight') {
      event.preventDefault();
      if (!event.repeat) {
        onchangenoteshift?.(1);
      }
      return;
    }

    // ArrowLeft: move notes to left (-1 step)
    if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft') {
      event.preventDefault();
      if (!event.repeat) {
        onchangenoteshift?.(-1);
      }
      return;
    }

    const matchedKey = keyByCode.get(event.code);
    if (matchedKey) {
      if (matchedKey.isDisabled) return;

      if (['Space', 'Tab', 'Slash', 'Backspace', 'Quote'].includes(event.code)) {
        event.preventDefault();
      }
      pressKey(matchedKey);
    }
  }

  function handleKeyUp(event) {
    if (event.key === 'Escape' || event.code === 'Escape' || event.key === 'Esc') return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

    const matchedKey = keyByCode.get(event.code);
    if (matchedKey) {
      if (matchedKey.isDisabled) return;

      if (['Space', 'Tab', 'Slash', 'Backspace', 'Quote'].includes(event.code)) {
        event.preventDefault();
      }
      releaseKey(matchedKey);
    }
  }

  function handleBlur() {
    for (const code of Object.keys(activeKeys)) {
      sound.keyUp(code);
    }
    sound.setSustainPedal(false);
    activeKeys = {};
  }
</script>

<svelte:window
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
  onblur={handleBlur}
/>

<div class="keyboard-chassis">
  <div class="keyboard-plate">
    {#each rows as row, rowIndex (rowIndex)}
      <div class="keyboard-row">
        {#each row as key (key.code)}
          <KeyCap
            keyData={key}
            {layout}
            {showFingerGuides}
            isPressed={Boolean(activeKeys[key.code])}
            ontapdown={() => pressKey(key)}
            ontapup={() => releaseKey(key)}
          />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .keyboard-chassis {
    position: relative;
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 10px;
    background: var(--bg-chassis);
    border: 1px solid var(--border-color);
    border-radius: 6px;
  }

  .keyboard-plate {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    padding: 8px;
    background: var(--bg-plate);
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .keyboard-row {
    display: flex;
    gap: 5px;
    width: 100%;
    align-items: stretch;
  }

  @media (max-width: 768px) {
    .keyboard-chassis {
      padding: 6px;
      border-radius: 4px;
    }
    .keyboard-plate {
      gap: 4px;
      padding: 4px;
    }
    .keyboard-row {
      gap: 3px;
    }
  }
</style>
