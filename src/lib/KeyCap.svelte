<script>
  let {
    keyData,
    isPressed = false,
    layout = 'colemak',
    showFingerGuides = true,
    ontapdown,
    ontapup
  } = $props();

  let displayedChar = $derived(
    layout === 'qwerty'
      ? (keyData.qwertyChar || keyData.label || keyData.char)
      : (keyData.label || keyData.char)
  );

  function handlePointerDown(e) {
    if (keyData.isDisabled) return;
    e.preventDefault();
    ontapdown?.(keyData);
  }

  function handlePointerUp(e) {
    if (keyData.isDisabled) return;
    e.preventDefault();
    ontapup?.(keyData);
  }

  function handlePointerLeave(e) {
    if (keyData.isDisabled) return;
    e.preventDefault();
    if (isPressed) {
      ontapup?.(keyData);
    }
  }
</script>

<button
  type="button"
  class="keycap"
  class:pressed={isPressed && !keyData.isDisabled}
  class:disabled-key={keyData.isDisabled}
  class:modifier={keyData.isModifier}
  class:spacebar={keyData.isSustainPedal}
  style:--key-width-units={keyData.width}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  onpointerleave={handlePointerLeave}
  onpointercancel={handlePointerLeave}
  aria-label={keyData.isDisabled ? `${displayedChar} (disabled)` : (keyData.noteName ? `${displayedChar} ${keyData.noteName}` : (keyData.subLegend ? `${displayedChar} ${keyData.subLegend}` : displayedChar))}
  disabled={keyData.isDisabled}
  data-code={keyData.code}
>
  <div class="keycap-surface">
    <!-- Top: Small Note Legend / Sublegend (left) and High-Contrast Hand Finger Position (right) -->
    <div class="keycap-top">
      {#if !keyData.isDisabled && keyData.noteName}
        <span class="note-legend">{keyData.noteName}</span>
      {:else if !keyData.isDisabled && keyData.subLegend}
        <span class="note-legend">{keyData.subLegend}</span>
      {:else}
        <span></span>
      {/if}

      {#if !keyData.isDisabled && showFingerGuides && keyData.finger}
        <span class="finger-legend">{keyData.finger}</span>
      {/if}
    </div>

    <!-- Center: Main Keyboard Character (e.g. l or qwerty equivalent) -->
    <div class="keycap-body">
      <span class="main-char">{displayedChar}</span>

      <!-- Tactile homing nub for index keys -->
      {#if keyData.hasNub && !keyData.isDisabled}
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

  .keycap.pressed .finger-legend {
    background: #000000;
    color: #ffffff;
    border-color: #000000;
  }

  .keycap.pressed .homing-nub {
    background: var(--key-active-text);
  }

  /* Disabled gutter key (Colemak j, b, h, 7) */
  .keycap.disabled-key {
    background: #080808;
    border-color: #1a1a1a;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.38;
  }

  .keycap.disabled-key .keycap-surface {
    background: #0b0b0b;
    color: #383838;
  }

  .keycap.disabled-key .main-char {
    color: #383838;
    font-weight: 500;
  }

  /* Top row: Note name on left, Finger indicator badge on right */
  .keycap-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 14px;
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

  /* High contrast noticeable finger guide badge */
  .finger-legend {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 15px;
    height: 14px;
    padding: 0 3px;
    font-size: 10px;
    font-weight: 700;
    color: #ffffff;
    background: #2b2b2b;
    border: 1px solid #484848;
    border-radius: 3px;
    font-family: inherit;
    line-height: 1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
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
    .finger-legend {
      font-size: 8px;
      min-width: 13px;
      height: 12px;
    }
    .keycap.modifier .main-char {
      font-size: 8px;
    }
  }
</style>
