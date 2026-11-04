<script>
  import Keyboard from './lib/Keyboard.svelte';
  import SettingsModal from './lib/SettingsModal.svelte';
  import { sound } from './lib/soundEngine.js';

  let layout = $state('colemak'); // 'colemak' | 'qwerty'
  let volume = $state(0.7);
  let touchCurve = $state('normal'); // 'normal' | 'intimate' | 'concert'
  let reverbOn = $state(true);
  let isSettingsOpen = $state(false);

  function handleWindowKeyDown(e) {
    if (e.key === 'Escape' || e.code === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      isSettingsOpen = !isSettingsOpen;
    }
  }

  function handleLayoutChange(nextLayout) {
    layout = nextLayout;
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
      <span class="active-badge">{layout}</span>
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
      disabled={isSettingsOpen}
    />
  </div>

  {#if isSettingsOpen}
    <SettingsModal
      {layout}
      {volume}
      {touchCurve}
      {reverbOn}
      onclose={() => (isSettingsOpen = false)}
      onlayoutchange={handleLayoutChange}
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

  .active-badge {
    font-size: 11px;
    color: #444444;
    letter-spacing: 0.05em;
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
