/* ============================================================
   Nail Salon Calme — スクリプト（依存ライブラリなし）
   1. ヘッダーのスクロール時スタイル切替
   2. ハンバーガーメニュー開閉
   3. スクロール連動の出現アニメーション
   4. スマホ固定CTA（FVを過ぎたら表示）
   ============================================================ */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var menuBtn = document.getElementById('menuBtn');
  var gnav = document.getElementById('gnav');
  var fixedCta = document.getElementById('fixedCta');
  var fv = document.querySelector('.fv');

  /* ---- 1. ヘッダー: FVを少しスクロールしたら背景を敷く ---- */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- 2. ハンバーガーメニュー ---- */
  function closeMenu() {
    gnav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = gnav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  // ナビ内リンクを押したら閉じる
  gnav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });
  // Escキーでも閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- 3. スクロール出現アニメーション ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-shown');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-shown'); });
  }

  /* ---- 4. スマホ固定CTA: FVを過ぎたら出す（最終CTA付近では隠す） ---- */
  var ctaSec = document.getElementById('cta');
  if (fixedCta && fv && 'IntersectionObserver' in window) {
    var pastFv = false;
    var nearCta = false;
    function updateCta() {
      var show = pastFv && !nearCta;
      fixedCta.classList.toggle('is-visible', show);
      fixedCta.setAttribute('aria-hidden', String(!show));
      fixedCta.querySelector('a').tabIndex = show ? 0 : -1;
    }
    new IntersectionObserver(function (entries) {
      pastFv = !entries[0].isIntersecting;
      updateCta();
    }, { threshold: 0.1 }).observe(fv);
    new IntersectionObserver(function (entries) {
      nearCta = entries[0].isIntersecting;
      updateCta();
    }, { threshold: 0.15 }).observe(ctaSec);
  }
})();
