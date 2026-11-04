<script>
  import { KEYBOARD_ROWS, KEY_BY_CODE } from './colemakData.js';
  import { sound } from './soundEngine.js';
  import KeyCap from './KeyCap.svelte';

  let {
    layout = 'colemak',
    disabled = false
  } = $props();

  let activeKeys = $state({});

  function pressKey(key) {
    if (!key || disabled) return;

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
    if (!key) return;

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

    const matchedKey = KEY_BY_CODE.get(event.code);
    if (matchedKey) {
      if (['Space', 'Tab', 'Slash', 'Backspace', 'Quote'].includes(event.code)) {
        event.preventDefault();
      }
      pressKey(matchedKey);
    }
  }

  function handleKeyUp(event) {
    if (event.key === 'Escape' || event.code === 'Escape' || event.key === 'Esc') return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

    const matchedKey = KEY_BY_CODE.get(event.code);
    if (matchedKey) {
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
    {#each KEYBOARD_ROWS as row, rowIndex (rowIndex)}
      <div class="keyboard-row">
        {#each row as key (key.code)}
          <KeyCap
            keyData={key}
            {layout}
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
