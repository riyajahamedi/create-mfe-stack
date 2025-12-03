/**
 * DevTools page entry point.
 * Creates the MFE Stack panel in Chrome DevTools.
 */

chrome.devtools.panels.create(
  'MFE Stack',
  'icons/icon-48.png',
  'devtools/panel/index.html',
  () => {
    console.log('[MFE Stack DevTools] Panel created');
  }
);
