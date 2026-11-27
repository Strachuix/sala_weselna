(function () {
  'use strict';

  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('[data-season-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      var season = button.dataset.seasonFilter;
      document.querySelectorAll('[data-season-filter]').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      document.querySelectorAll('[data-gallery-season]').forEach(function (image) {
        image.hidden = season !== 'all' && image.dataset.gallerySeason !== season;
      });
    });
  });

  var galleryGrid = document.querySelector('.gallery-grid');
  document.querySelectorAll('[data-gallery-mode]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!galleryGrid) return;
      galleryGrid.dataset.mode = button.dataset.galleryMode;
      document.querySelectorAll('[data-gallery-mode]').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
    });
  });

  var historyDetail = document.querySelector('[data-history-detail]');
  document.querySelectorAll('[data-history-step]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-history-step]').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      if (historyDetail) historyDetail.textContent = button.dataset.historyCopy;
    });
  });

  document.querySelectorAll('[data-package-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      var selectedPackage = button.dataset.packageFilter;
      document.querySelectorAll('[data-package-filter]').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      document.querySelectorAll('[data-package-card]').forEach(function (card) {
        card.hidden = selectedPackage !== 'all' && card.dataset.packageCard !== selectedPackage;
      });
    });
  });

  var zonePlan = document.querySelector('.theme-garden .floor-plan');
  document.querySelectorAll('[data-garden-zone]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!zonePlan) return;
      zonePlan.dataset.zone = button.dataset.gardenZone;
      zonePlan.querySelector('.floor-stage').textContent = button.dataset.stage;
      zonePlan.querySelector('.floor-caption').textContent = button.dataset.caption;
      document.querySelectorAll('[data-garden-zone]').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
    });
  });

  var floorPlan = document.querySelector('.floor-plan');
  var layoutStatus = document.querySelector('.layout-status');
  var layoutNames = { round: 'Sala Różana', long: 'Sala Lustrzana', ceremony: 'cała posiadłość' };
  document.querySelectorAll('[data-layout][data-guests]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!floorPlan) return;
      floorPlan.dataset.layout = button.dataset.layout;
      document.querySelectorAll('[data-layout]').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      if (layoutStatus) layoutStatus.textContent = 'Podgląd: ' + layoutNames[button.dataset.layout] + ' · do ' + button.dataset.guests + ' gości.';
    });
  });

  var tourDialog = document.getElementById('tour-dialog');
  var tourOpen = document.querySelector('[data-tour-open]');
  var tourImage = document.querySelector('.tour-image');
  var tourCounter = document.querySelector('.tour-counter');
  var tourScenes = [
    { src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=85', alt: 'Widok przykładowej sali przygotowanej na przyjęcie' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop&q=85', alt: 'Widok przykładowej ceremonii w plenerze' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&auto=format&fit=crop&q=85', alt: 'Widok przykładowej aranżacji stołów' }
  ];
  var tourSceneIndex = 0;
  var lightbox = document.getElementById('editorial-lightbox');
  var lightboxImage = lightbox && lightbox.querySelector('img');

  document.querySelectorAll('.theme-editorial .gallery-card').forEach(function (card) {
    var image = card.querySelector('img');
    if (!image || !lightbox || !lightboxImage) return;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Powiększ zdjęcie: ' + image.alt);
    function openLightbox() {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.showModal();
    }
    card.addEventListener('click', openLightbox);
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox();
      }
    });
  });

  function showTourScene(index) {
    tourSceneIndex = (index + tourScenes.length) % tourScenes.length;
    if (tourImage) {
      tourImage.src = tourScenes[tourSceneIndex].src;
      tourImage.alt = tourScenes[tourSceneIndex].alt;
    }
    if (tourCounter) tourCounter.textContent = String(tourSceneIndex + 1).padStart(2, '0') + ' / ' + String(tourScenes.length).padStart(2, '0');
  }

  if (tourDialog && tourOpen) {
    tourOpen.addEventListener('click', function () {
      if (typeof tourDialog.showModal === 'function') {
        showTourScene(0);
        tourDialog.showModal();
      }
    });
    document.querySelector('[data-tour-prev]').addEventListener('click', function () { showTourScene(tourSceneIndex - 1); });
    document.querySelector('[data-tour-next]').addEventListener('click', function () { showTourScene(tourSceneIndex + 1); });
  }

  var monthPicker = document.getElementById('month-picker');
  var calendar = document.getElementById('availability-calendar');
  var availabilityStatus = document.getElementById('availability-status');
  var selectedDate = '';
  var bookedDays = [6, 12, 22];
  var weekdays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];

  function renderCalendar() {
    if (!monthPicker || !calendar || !monthPicker.value) return;
    var parts = monthPicker.value.split('-');
    var year = Number(parts[0]);
    var month = Number(parts[1]) - 1;
    var firstDay = new Date(year, month, 1);
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var offset = (firstDay.getDay() + 6) % 7;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    calendar.replaceChildren();

    weekdays.forEach(function (weekday) {
      var heading = document.createElement('span');
      heading.className = 'calendar-head';
      heading.textContent = weekday;
      calendar.appendChild(heading);
    });
    for (var blank = 0; blank < offset; blank += 1) {
      var spacer = document.createElement('span');
      spacer.setAttribute('aria-hidden', 'true');
      calendar.appendChild(spacer);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateButton = document.createElement('button');
      var date = new Date(year, month, day);
      dateButton.type = 'button';
      dateButton.className = 'calendar-day';
      dateButton.textContent = String(day);
      dateButton.setAttribute('aria-label', day + '.' + (month + 1) + '.' + year);
      dateButton.disabled = date < today || bookedDays.indexOf(day) !== -1;
      dateButton.setAttribute('aria-pressed', selectedDate === monthPicker.value + '-' + String(day).padStart(2, '0') ? 'true' : 'false');
      dateButton.addEventListener('click', function () {
        selectedDate = monthPicker.value + '-' + String(day).padStart(2, '0');
        calendar.querySelectorAll('.calendar-day').forEach(function (item) {
          item.setAttribute('aria-pressed', String(item === dateButton));
        });
        if (availabilityStatus) availabilityStatus.textContent = 'Wybrany termin: ' + dateButton.getAttribute('aria-label') + '. Dostępny (dane demonstracyjne).';
        updateEstimate();
      });
      calendar.appendChild(dateButton);
    }
    selectedDate = '';
    if (availabilityStatus) availabilityStatus.textContent = 'Wybierz dzień. Wyszarzone daty są zajęte lub minęły.';
    updateEstimate();
  }

  if (monthPicker && calendar) {
    var now = new Date();
    var monthValue = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    monthPicker.min = monthValue;
    if (!monthPicker.value || monthPicker.value < monthValue) monthPicker.value = monthValue;
    monthPicker.addEventListener('change', renderCalendar);
    renderCalendar();
  }

  var guestsInput = document.getElementById('guest-count');
  var guestsOutput = document.getElementById('guest-output');
  var packageSelect = document.getElementById('package-select');
  var estimateOutput = document.getElementById('estimate-output');
  var requestLink = document.getElementById('request-link');
  var venue = document.body.dataset.venue || 'Sala weselna';

  function updateEstimate() {
    if (!guestsInput || !guestsOutput || !packageSelect || !estimateOutput) return;
    var guests = Number(guestsInput.value);
    var packageOption = packageSelect.options[packageSelect.selectedIndex];
    var packagePrice = Number(packageSelect.value);
    var guestLimit = Number(packageOption.dataset.guestLimit);
    var total = packagePrice + Math.max(0, guests - guestLimit) * 200;
    var formatted = new Intl.NumberFormat('pl-PL').format(total) + ' zł';
    guestsOutput.textContent = String(guests);
    estimateOutput.textContent = formatted;
    if (requestLink) {
      var dateText = selectedDate || 'do ustalenia';
      var body = 'Wstępna wycena: ' + venue + '\nTermin: ' + dateText + '\nLiczba gości: ' + guests + '\nPakiet: ' + packageOption.textContent + '\nSzacunkowy koszt: ' + formatted;
      requestLink.href = 'mailto:rezerwacje@dworwisniowy.pl?subject=' + encodeURIComponent('Zapytanie o przyjęcie — ' + venue) + '&body=' + encodeURIComponent(body);
    }
  }

  if (guestsInput && packageSelect) {
    guestsInput.addEventListener('input', updateEstimate);
    packageSelect.addEventListener('change', updateEstimate);
    updateEstimate();
  }

  if ('IntersectionObserver' in window) {
    document.body.classList.add('has-motion');
    var observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (element) { observer.observe(element); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (element) { element.classList.add('is-visible'); });
  }
}());
