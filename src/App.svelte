<script>
  import Keyboard from './lib/Keyboard.svelte';
  import SettingsModal from './lib/SettingsModal.svelte';
  import { sound } from './lib/soundEngine.js';

  let layout = $state('colemak'); // 'colemak' | 'qwerty'
  let octaveShift = $state(0); // -2 to +2
  let noteShift = $state(0); // -14 to +14 (adjust via arrow left/right)
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

  function handleOctaveDelta(delta) {
    const next = Math.max(-2, Math.min(2, octaveShift + delta));
    if (next !== octaveShift) {
      sound.stopAllVoices?.();
      octaveShift = next;
    }
  }

  function handleSetOctave(val) {
    const next = Math.max(-2, Math.min(2, val));
    if (next !== octaveShift) {
      sound.stopAllVoices?.();
      octaveShift = next;
    }
  }

  function handleNoteShiftDelta(delta) {
    const next = Math.max(-14, Math.min(14, noteShift + delta));
    if (next !== noteShift) {
      sound.stopAllVoices?.();
      noteShift = next;
    }
  }

  function handleSetNoteShift(val) {
    const next = Math.max(-14, Math.min(14, val));
    if (next !== noteShift) {
      sound.stopAllVoices?.();
      noteShift = next;
    }
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
        {#if octaveShift !== 0}
          <button
            type="button"
            class="octave-badge-btn"
            onclick={() => handleSetOctave(0)}
            title="click to reset octave to normal (arrow up / down)"
          >
            oct {octaveShift > 0 ? `+${octaveShift}` : octaveShift} [reset]
          </button>
        {/if}
        {#if noteShift !== 0}
          <button
            type="button"
            class="octave-badge-btn"
            onclick={() => handleSetNoteShift(0)}
            title="click to reset note shift (arrow left / right)"
          >
            shift {noteShift > 0 ? `+${noteShift}` : noteShift} [reset]
          </button>
        {/if}
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
      {octaveShift}
      {noteShift}
      disabled={isSettingsOpen}
      onchangeoctave={handleOctaveDelta}
      onchangenoteshift={handleNoteShiftDelta}
    />
  </div>

  {#if isSettingsOpen}
    <SettingsModal
      {layout}
      {octaveShift}
      {noteShift}
      {volume}
      {touchCurve}
      {reverbOn}
      onclose={() => (isSettingsOpen = false)}
      onlayoutchange={handleLayoutChange}
      onoctavechange={handleSetOctave}
      onnoteshiftchange={handleSetNoteShift}
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

  .octave-badge-btn {
    background: #1c1c1c;
    border: 1px solid #333333;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    padding: 1px 5px;
    font-family: inherit;
    transition: all 40ms ease;
  }

  .octave-badge-btn:hover {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
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
