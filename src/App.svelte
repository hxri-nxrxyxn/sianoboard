<script>
  import Keyboard from './lib/Keyboard.svelte';
  import SettingsModal from './lib/SettingsModal.svelte';
  import { HOME_POSITIONS } from './lib/colemakData.js';
  import { sound } from './lib/soundEngine.js';

  let layout = $state('colemak'); // 'colemak' | 'qwerty'
  let homePosition = $state('c4'); // 'c4' | 'g4' | 'f4' | 'd4' | 'a4' | 'c3' | 'c5'
  let volume = $state(0.7);
  let touchCurve = $state('normal'); // 'normal' | 'intimate' | 'concert'
  let reverbOn = $state(true);
  let isSettingsOpen = $state(false);

  let currentHomePositionLabel = $derived(
    HOME_POSITIONS.find((p) => p.id === homePosition)?.label || 'c major (c4)'
  );

  function handleWindowKeyDown(e) {
    if (e.key === 'Escape' || e.code === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      isSettingsOpen = !isSettingsOpen;
    }
  }

  function handleLayoutChange(nextLayout) {
    layout = nextLayout;
  }

  function handleHomePositionChange(nextPos) {
    homePosition = nextPos;
  }

  function handleVolumeChange(nextVol) {
    volume = nextVol;
    sound.setVolume(volume);
  }

  function handleTouchChange(nextTouch) {
    touchCurve = nextTouch;
    sound.setTouchCurve(touchCurve);
  }

  function handleReverbChange(nextReverb) {
    reverbOn = nextReverb;
    if (sound.reverbEnabled !== reverbOn) {
      sound.toggleReverb();
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeyDown} />

<main class="viewport">
  <div class="keyboard-container">
    <div class="top-bar">
      <div class="status-group">
        <span class="active-badge">{layout}</span>
        <span class="divider">/</span>
        <span class="position-badge">{currentHomePositionLabel}</span>
      </div>
      <button
        type="button"
        class="settings-btn"
        onclick={() => (isSettingsOpen = !isSettingsOpen)}
        title="settings (esc)"
        aria-label="open settings modal"
      >
        [esc: settings]
      </button>
    </div>

    <Keyboard
      {layout}
      {homePosition}
      disabled={isSettingsOpen}
    />
  </div>

  {#if isSettingsOpen}
    <SettingsModal
      {layout}
      {homePosition}
      {volume}
      {touchCurve}
      {reverbOn}
      onclose={() => (isSettingsOpen = false)}
      onlayoutchange={handleLayoutChange}
      onhomepositionchange={handleHomePositionChange}
      onvolumechange={handleVolumeChange}
      ontouchchange={handleTouchChange}
      onreverbchange={handleReverbChange}
    />
  {/if}
</main>

<style>
  .viewport {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 14px;
    background: var(--bg-page);
  }

  .keyboard-container {
    width: 100%;
    max-width: 980px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
  }

  .status-group {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 0.04em;
  }

  .active-badge {
    color: #888888;
    font-weight: 600;
  }

  .divider {
    color: #444444;
  }

  .position-badge {
    color: #666666;
  }

  .settings-btn {
    background: transparent;
    border: none;
    font-size: 11px;
    color: #666666;
    cursor: pointer;
    padding: 2px 4px;
    font-family: inherit;
    transition: color 40ms ease;
  }

  .settings-btn:hover {
    color: #ffffff;
  }

  @media (max-width: 768px) {
    .viewport {
      padding: 10px 6px;
    }
    .keyboard-container {
      gap: 6px;
    }
  }
</style>
