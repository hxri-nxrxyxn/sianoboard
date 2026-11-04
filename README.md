# sianoboard

a minimalist monotone keyboard piano built for practicing piano muscle memory on a computer keyboard.

### features
- **ergonomic isomorphic piano layout**: continuous, unbroken ascending piano scale across 3.5 octaves.
- **dual-tier sliding architecture**:
  - **tier 1**: upper row (`qwer` / `qwfp`) + bottom row thumb (`xc` / `cv`)
  - **tier 2**: number row (`1234`) + home row thumb (`st` / `td`)
  - slide your whole hand 1 key to the right anywhere on the board to transpose the scale uniformly.
- **grand piano sound engine**:
  - binaural 3d stereo spatialization (bass on left, treble on right)
  - dynamic velocity & hammer brightness response
  - acoustic wooden recital hall convolution reverb
  - damper sustain pedal on `space` (hold or tap)
- **monotone minimalist design**:
  - pure 3-color palette: black, white, and grey
  - zero screen clutter, only the playing surface
  - keycaps show only the keyboard letter and the musical note
- **keyboard-driven settings (`esc`)**:
  - layout switcher: **colemak** vs **qwerty**
  - volume control
  - touch dynamics (`normal`, `intimate`, `concert`)
  - hall reverb toggle (`on`, `off`)

### local setup
```bash
npm install
npm run dev
```

press `esc` to open the settings menu. use arrow keys (`↑`/`↓` to navigate, `←`/`→` to change), and `esc` to close.
