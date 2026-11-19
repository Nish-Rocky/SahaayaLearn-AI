SahaayaLearn video frames
========================

Frames: 359 JPEG images
Frame sampling rate: 30 frames per second
Resolution: 1920 x 1080 (Full HD)
Sequence: frame_000001.jpg through frame_000359.jpg

Source video properties:
- Codec: H.264
- Original frame rate: 24 fps
- Original duration: approximately 11.958 seconds
- Original resolution: 1920 x 1080

Conversion notes:
- Frames were sampled into a constant 30 fps sequence from the original 24 fps video.
- The source video is approximately 11.96 seconds long, not exactly 10 seconds.
- The conversion preserves the source frames; some frames are repeated to form the 30 fps sequence. It does not create new motion detail.
- For scroll scrubbing, map scroll progress from 0 to 1 to frame indices 1 through 359.
- JPEG quality is high (FFmpeg q:v 2). Files are numbered in playback order.

Suggested usage:
1. Extract this ZIP.
2. Load images in numeric order.
3. Use the frame index as the scroll position, clamped between 1 and 359.
4. Preload nearby frames to reduce visible loading during scroll.
