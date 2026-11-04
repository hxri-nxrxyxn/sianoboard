<script>
  import { HOME_POSITIONS } from './colemakData.js';

  let {
    layout = 'colemak',
    homePosition = 'c4',
    octaveShift = 0,
    showFingerGuides = true,
    volume = 0.7,
    touchCurve = 'normal',
    reverbOn = true,
    onclose,
    onlayoutchange,
    onhomepositionchange,
    onoctavechange,
    onfingerguideschange,
    onvolumechange,
    ontouchchange,
    onreverbchange
  } = $props();

  let selectedIndex = $state(0);

  const SETTINGS = [
    { id: 'layout', label: 'layout' },
    { id: 'homePosition', label: 'home position' },
    { id: 'octave', label: 'octave shift' },
    { id: 'fingerGuides', label: 'finger guides' },
    { id: 'volume', label: 'volume' },
    { id: 'touch', label: 'touch response' },
    { id: 'reverb', label: 'hall reverb' }
  ];

  let currentHomePositionLabel = $derived(
    HOME_POSITIONS.find((p) => p.id === homePosition)?.label || 'c major (c4)'
  );

  let currentOctaveLabel = $derived(
    octaveShift === 0 ? '0 (normal)' : (octaveShift > 0 ? `+${octaveShift}` : `${octaveShift}`)
  );

  function handleKeyDown(e) {
    if (e.key === 'Escape' || e.code === 'Escape' || e.key === 'Esc') {
      // Escape toggling is handled centrally by App.svelte
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      e.stopPropagation();
      selectedIndex = (selectedIndex - 1 + SETTINGS.length) % SETTINGS.length;
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      e.stopPropagation();
      selectedIndex = (selectedIndex + 1) % SETTINGS.length;
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'h') {
      e.preventDefault();
      e.stopPropagation();
      changeSetting(-1);
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      changeSetting(1);
      return;
    }
  }

  function changeSetting(direction) {
    if (selectedIndex === 0) {
      // 1. Layout: colemak vs qwerty
      const next = layout === 'colemak' ? 'qwerty' : 'colemak';
      onlayoutchange?.(next);
    } else if (selectedIndex === 1) {
      // 2. Home Position
      const currentIdx = HOME_POSITIONS.findIndex((p) => p.id === homePosition);
      const nextIdx = (currentIdx + direction + HOME_POSITIONS.length) % HOME_POSITIONS.length;
      onhomepositionchange?.(HOME_POSITIONS[nextIdx].id);
    } else if (selectedIndex === 2) {
      // 3. Octave shift: -2 to +2
      const nextOct = Math.max(-2, Math.min(2, octaveShift + direction));
      onoctavechange?.(nextOct);
    } else if (selectedIndex === 3) {
      // 4. Finger guides: on / off
      onfingerguideschange?.(!showFingerGuides);
    } else if (selectedIndex === 4) {
      // 5. Volume
      const nextVol = Math.max(0, Math.min(1, +(volume + direction * 0.1).toFixed(1)));
      onvolumechange?.(nextVol);
    } else if (selectedIndex === 5) {
      // 6. Touch dynamics
      const touchModes = ['normal', 'intimate', 'concert'];
      const currentIdx = touchModes.indexOf(touchCurve);
      const nextIdx = (currentIdx + direction + touchModes.length) % touchModes.length;
      ontouchchange?.(touchModes[nextIdx]);
    } else if (selectedIndex === 6) {
      // 7. Reverb
      onreverbchange?.(!reverbOn);
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onclose?.();
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="modal-backdrop" onclick={handleBackdropClick} role="presentation">
  <div
    class="modal-dialog"
    role="dialog"
    aria-modal="true"
    aria-label="settings"
    tabindex="-1"
  >
    <div class="modal-header">
      <span class="modal-title">settings</span>
      <button type="button" class="close-hint-btn" onclick={onclose}>[esc to close]</button>
    </div>

    <div class="settings-list">
      <!-- 1. Layout -->
      <button
        type="button"
        class="setting-row"
        class:selected={selectedIndex === 0}
        onclick={() => { selectedIndex = 0; changeSetting(1); }}
      >
        <div class="row-left">
          <span class="cursor">{selectedIndex === 0 ? '>' : ' '}</span>
          <span class="setting-label">layout</span>
        </div>
        <div class="row-right">
          <span class="setting-val">{layout}</span>
        </div>
      </button>

      <!-- 2. Home Position -->
      <button
        type="button"
        class="setting-row"
        class:selected={selectedIndex === 1}
        onclick={() => { selectedIndex = 1; changeSetting(1); }}
      >
        <div class="row-left">
          <span class="cursor">{selectedIndex === 1 ? '>' : ' '}</span>
          <span class="setting-label">home position</span>
        </div>
        <div class="row-right">
          <span class="setting-val">{currentHomePositionLabel}</span>
        </div>
      </button>

      <!-- 3. Octave Shift -->
      <button
        type="button"
        class="setting-row"
        class:selected={selectedIndex === 2}
        onclick={() => { selectedIndex = 2; changeSetting(1); }}
      >
        <div class="row-left">
          <span class="cursor">{selectedIndex === 2 ? '>' : ' '}</span>
          <span class="setting-label">octave shift</span>
        </div>
        <div class="row-right">
          <span class="setting-val">{currentOctaveLabel}</span>
        </div>
      </button>

      <!-- 4. Finger Guides -->
      <button
        type="button"
        class="setting-row"
        class:selected={selectedIndex === 3}
        onclick={() => { selectedIndex = 3; changeSetting(1); }}
      >
        <div class="row-left">
          <span class="cursor">{selectedIndex === 3 ? '>' : ' '}</span>
          <span class="setting-label">finger guides</span>
        </div>
        <div class="row-right">
          <span class="setting-val">{showFingerGuides ? 'on' : 'off'}</span>
        </div>
      </button>

      <!-- 5. Volume -->
      <button
        type="button"
        class="setting-row"
        class:selected={selectedIndex === 4}
        onclick={() => { selectedIndex = 4; changeSetting(1); }}
      >
        <div class="row-left">
          <span class="cursor">{selectedIndex === 4 ? '>' : ' '}</span>
          <span class="setting-label">volume</span>
        </div>
        <div class="row-right">
          <span class="setting-val">{Math.round(volume * 100)}%</span>
        </div>
      </button>

      <!-- 6. Touch Dynamics -->
      <button
        type="button"
        class="setting-row"
        class:selected={selectedIndex === 5}
        onclick={() => { selectedIndex = 5; changeSetting(1); }}
      >
        <div class="row-left">
          <span class="cursor">{selectedIndex === 5 ? '>' : ' '}</span>
          <span class="setting-label">touch response</span>
        </div>
        <div class="row-right">
          <span class="setting-val">{touchCurve}</span>
        </div>
      </button>

      <!-- 7. Hall Reverb -->
      <button
        type="button"
        class="setting-row"
        class:selected={selectedIndex === 6}
        onclick={() => { selectedIndex = 6; changeSetting(1); }}
      >
        <div class="row-left">
          <span class="cursor">{selectedIndex === 6 ? '>' : ' '}</span>
          <span class="setting-label">hall reverb</span>
        </div>
        <div class="row-right">
          <span class="setting-val">{reverbOn ? 'on' : 'off'}</span>
        </div>
      </button>
    </div>

    <div class="modal-footer">
      <span>[↑/↓: select]</span>
      <span>[←/→: change]</span>
      <button type="button" class="close-footer-btn" onclick={onclose}>[esc: close]</button>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-dialog {
    width: 100%;
    max-width: 400px;
    background: #0d0d0d;
    border: 1px solid #2c2c2c;
    border-radius: 4px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.9);
    outline: none;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #222222;
    padding-bottom: 10px;
  }

  .modal-title {
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .close-hint-btn, .close-footer-btn {
    background: transparent;
    border: none;
    font-size: 10px;
    color: #666666;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    transition: color 40ms ease;
  }

  .close-hint-btn:hover, .close-footer-btn:hover {
    color: #ffffff;
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-radius: 3px;
    font-size: 12px;
    color: #888888;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    transition: all 40ms ease;
    font-family: inherit;
  }

  .setting-row.selected {
    background: #ffffff;
    color: #000000;
  }

  .setting-row.selected .setting-label,
  .setting-row.selected .setting-val,
  .setting-row.selected .cursor {
    color: #000000;
    font-weight: 700;
  }

  .row-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cursor {
    font-family: monospace;
    font-weight: bold;
    width: 10px;
  }

  .setting-label {
    letter-spacing: 0.02em;
  }

  .setting-val {
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #222222;
    padding-top: 10px;
    font-size: 10px;
    color: #666666;
  }
</style>
