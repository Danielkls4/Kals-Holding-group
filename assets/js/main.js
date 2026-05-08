/**
* Template Name: Gp
* Updated contact form for Vercel Node.js API
*/

(function () {
  "use strict";

  /* =========================
   * SCROLL HEADER
  ========================= */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;

    if (
      !selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')
    ) return;

    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /* =========================
   * MOBILE NAV
  ========================= */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToggle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  document.querySelectorAll('#navmenu a').forEach(nav => {
    nav.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  /* =========================
   * DROPDOWN MOBILE
  ========================= */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(drop => {
    drop.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /* =========================
   * PRELOADER
  ========================= */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.remove());
  }

  /* =========================
   * SCROLL TOP
  ========================= */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (!scrollTop) return;
    window.scrollY > 100
      ? scrollTop.classList.add('active')
      : scrollTop.classList.remove('active');
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /* =========================
   * AOS
  ========================= */
  function aosInit() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }

  window.addEventListener('load', aosInit);

  /* =========================
   * SWIPER
  ========================= */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(el => {
      let config = JSON.parse(
        el.querySelector(".swiper-config").innerHTML.trim()
      );

      new Swiper(el, config);
    });
  }

  window.addEventListener("load", initSwiper);

  /* =========================
   * GLIGHTBOX
  ========================= */
  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: '.glightbox' });
  }

  /* =========================
   * ISOTOPE
  ========================= */
  document.querySelectorAll('.isotope-layout').forEach(item => {
    let layout = item.getAttribute('data-layout') || 'masonry';
    let filter = item.getAttribute('data-default-filter') || '*';
    let sort = item.getAttribute('data-sort') || 'original-order';

    let iso;

    imagesLoaded(item.querySelector('.isotope-container'), function () {
      iso = new Isotope(item.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    item.querySelectorAll('.isotope-filters li').forEach(btn => {
      btn.addEventListener('click', function () {
        item.querySelector('.filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');

        iso.arrange({
          filter: this.getAttribute('data-filter')
        });

        if (typeof aosInit === "function") aosInit();
      });
    });
  });

  /* =========================
   * PURE COUNTER
  ========================= */
  new PureCounter();

  /* =========================
   * NAV SCROLLSPY
  ========================= */
  let navlinks = document.querySelectorAll('.navmenu a');

  function scrollSpy() {
    navlinks.forEach(link => {
      if (!link.hash) return;

      let section = document.querySelector(link.hash);
      if (!section) return;

      let pos = window.scrollY + 200;

      if (pos >= section.offsetTop && pos <= section.offsetTop + section.offsetHeight) {
        document.querySelectorAll('.navmenu a.active')
          .forEach(a => a.classList.remove('active'));

        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  document.addEventListener('scroll', scrollSpy);
  window.addEventListener('load', scrollSpy);

  /* =========================
   * 🚀 CONTACT FORM (VERCEL API)
  ========================= */

  const forms = document.querySelectorAll('.php-email-form');

  forms.forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const action = "/api/contact";

      const loading = form.querySelector('.loading');
      const error = form.querySelector('.error-message');
      const sent = form.querySelector('.sent-message');

      loading.classList.add('d-block');
      error.classList.remove('d-block');
      sent.classList.remove('d-block');

      const formData = new FormData(form);

      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message")
      };

      try {
        const res = await fetch(action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        loading.classList.remove('d-block');

        if (res.ok && result.status === "OK") {
          sent.classList.add('d-block');
          form.reset();
        } else {
          throw new Error(result.error || "Erreur lors de l'envoi");
        }

      } catch (err) {
        loading.classList.remove('d-block');
        error.innerHTML = err.message;
        error.classList.add('d-block');
      }
    });
  });

})();