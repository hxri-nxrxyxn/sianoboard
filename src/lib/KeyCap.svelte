<script>
  let {
    keyData,
    isPressed = false,
    layout = 'colemak',
    ontapdown,
    ontapup
  } = $props();

  let displayedChar = $derived(
    layout === 'qwerty'
      ? (keyData.qwertyChar || keyData.label || keyData.char)
      : (keyData.label || keyData.char)
  );

  function handlePointerDown(e) {
    e.preventDefault();
    ontapdown?.(keyData);
  }

  function handlePointerUp(e) {
    e.preventDefault();
    ontapup?.(keyData);
  }

  function handlePointerLeave(e) {
    e.preventDefault();
    if (isPressed) {
      ontapup?.(keyData);
    }
  }
</script>

<button
  type="button"
  class="keycap"
  class:pressed={isPressed}
  class:modifier={keyData.isModifier}
  class:spacebar={keyData.isSustainPedal}
  style:--key-width-units={keyData.width}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  onpointerleave={handlePointerLeave}
  onpointercancel={handlePointerLeave}
  aria-label={keyData.noteName ? `${displayedChar} ${keyData.noteName}` : displayedChar}
  data-code={keyData.code}
>
  <div class="keycap-surface">
    <!-- Top: Small Note Legend (e.g. c5) -->
    <div class="keycap-top">
      {#if keyData.noteName}
        <span class="note-legend">{keyData.noteName}</span>
      {/if}
    </div>

    <!-- Center: Main Keyboard Character (e.g. l or qwerty equivalent) -->
    <div class="keycap-body">
      <span class="main-char">{displayedChar}</span>

      <!-- Tactile homing nub for index keys -->
      {#if keyData.hasNub}
        <span class="homing-nub"></span>
      {/if}
    </div>
  </div>
</button>

<style>
  .keycap {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    height: 60px;
    flex: var(--key-width-units) var(--key-width-units) 0;
    min-width: calc(var(--key-width-units) * 36px);
    background: var(--key-side);
    border: 1px solid var(--key-border);
    border-radius: 4px;
    padding: 0;
    margin: 0;
    outline: none;
    cursor: pointer;
    box-shadow: var(--key-shadow);
    transition: transform 40ms cubic-bezier(0.2, 0, 0, 1), box-shadow 40ms ease;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
  }

  .keycap-surface {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    border-radius: 3px;
    background: var(--key-bg);
    color: var(--key-text);
    padding: 4px 6px 5px;
    transition: background 40ms ease, color 40ms ease;
  }

  /* Tap Down / Active State */
  .keycap.pressed {
    transform: translateY(3px);
    box-shadow: var(--key-active-shadow);
  }

  .keycap.pressed .keycap-surface {
    background: var(--key-active-bg);
    color: var(--key-active-text);
  }

  .keycap.pressed .note-legend {
    color: var(--key-active-subtext);
  }

  .keycap.pressed .homing-nub {
    background: var(--key-active-text);
  }

  /* Top note name */
  .keycap-top {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    min-height: 11px;
    line-height: 1;
  }

  .note-legend {
    font-size: 10px;
    font-weight: 500;
    color: var(--key-subtext);
    letter-spacing: 0.02em;
    font-family: inherit;
    line-height: 1;
  }

  /* Main letter */
  .keycap-body {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 1;
  }

  .main-char {
    font-size: 15px;
    font-weight: 600;
    line-height: 1;
  }

  .homing-nub {
    position: absolute;
    bottom: -1px;
    width: 8px;
    height: 2px;
    border-radius: 1px;
    background: var(--key-nub-color);
    opacity: 0.8;
  }

  /* Modifiers & Spacebar */
  .keycap.modifier .main-char {
    font-size: 10px;
    font-weight: 500;
    color: var(--key-subtext);
  }

  .keycap.spacebar .main-char {
    font-size: 11px;
    font-weight: 500;
    color: var(--key-subtext);
    letter-spacing: 0.06em;
  }

  @media (max-width: 768px) {
    .keycap {
      height: 48px;
      min-width: calc(var(--key-width-units) * 22px);
    }
    .main-char {
      font-size: 12px;
    }
    .note-legend {
      font-size: 8px;
    }
    .keycap.modifier .main-char {
      font-size: 8px;
    }
  }
</style>
