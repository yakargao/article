// SVG Lightbox — click diagram to enlarge
(function() {
  // Add overlay once
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<div class="lb-content"><button class="lb-close" onclick="closeLightbox()">✕</button><div class="lb-svg-wrap"></div></div>';
  document.body.appendChild(overlay);

  window.openLightbox = function(el) {
    const svg = el.tagName === 'svg' ? el : el.querySelector('svg');
    if (!svg) return;
    const wrap = overlay.querySelector('.lb-svg-wrap');
    wrap.innerHTML = '';
    const clone = svg.cloneNode(true);
    clone.removeAttribute('style');
    clone.setAttribute('style', 'max-width:100%;height:auto;');
    wrap.appendChild(clone);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Click on overlay background (not content) to close
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLightbox();
  });

  // Escape key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
  });

  // Attach click to all .diagram elements
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.diagram').forEach(function(el) {
      el.addEventListener('click', function() { openLightbox(this); });
    });
  });
})();
