(function () {
    'use strict';

    const menuButton = document.getElementById('menu-toggle');
    const menuList = document.getElementById('menu-list');

    if (menuButton && menuList) {
        menuButton.addEventListener('click', function () {
            const isOpen = menuList.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });

        menuList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menuList.classList.remove('open');
                menuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const guestsInput = document.getElementById('guests');
    const guestsOutput = document.getElementById('guest-count');
    const daySelect = document.getElementById('day');
    const packageInputs = document.querySelectorAll('input[name="package"]');
    const priceOutput = document.getElementById('price-value');
    const reserveButton = document.getElementById('reserve-btn');

    const dayMultiplier = {
        friday: 0.96,
        saturday: 1.08,
        sunday: 0.9
    };

    const packageRate = {
        standard: 355,
        premium: 445,
        prestige: 565
    };

    const packageFlatFee = {
        standard: 2200,
        premium: 3900,
        prestige: 6800
    };

    function getSelectedPackage() {
        const checked = document.querySelector('input[name="package"]:checked');
        return checked ? checked.value : 'standard';
    }

    function formatPLN(value) {
        return new Intl.NumberFormat('pl-PL').format(Math.round(value)) + ' zł';
    }

    function calculateEstimate() {
        const guests = Number(guestsInput.value);
        const day = daySelect.value;
        const selectedPackage = getSelectedPackage();

        const base = guests * packageRate[selectedPackage] + packageFlatFee[selectedPackage];
        const estimate = base * dayMultiplier[day];

        guestsOutput.textContent = String(guests);
        priceOutput.textContent = formatPLN(estimate);

        return { guests: guests, day: day, pkg: selectedPackage, estimate: estimate };
    }

    if (guestsInput && guestsOutput && daySelect && priceOutput) {
        guestsInput.addEventListener('input', calculateEstimate);
        daySelect.addEventListener('change', calculateEstimate);
        packageInputs.forEach(function (input) {
            input.addEventListener('change', calculateEstimate);
        });
        calculateEstimate();
    }

    if (reserveButton) {
        reserveButton.addEventListener('click', function () {
            const data = calculateEstimate();
            const message = [
                'Villa Mamma - zapytanie o pakiet',
                '',
                'Dzień: ' + (data.day === 'friday' ? 'Piątek' : data.day === 'saturday' ? 'Sobota' : 'Niedziela'),
                'Liczba gości: ' + data.guests,
                'Pakiet: ' + data.pkg,
                'Orientacyjna wycena: ' + formatPLN(data.estimate)
            ].join('\n');

            window.location.href = 'mailto:kontakt@villamamma.pl?subject=Rezerwacja%20pakietu&body=' + encodeURIComponent(message);
        });
    }

    // Reveal animations for deliberate, editorial-like section entrances.
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.18 });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    // Subtle parallax on image blocks to reinforce magazine-style depth.
    const parallaxBlocks = document.querySelectorAll('.parallax');
    function handleParallax() {
        const viewportHeight = window.innerHeight;
        parallaxBlocks.forEach(function (block) {
            const speed = Number(block.dataset.speed || 0.1);
            const rect = block.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2;
                const moveY = centerOffset * -speed;
                block.style.transform = 'translateY(' + moveY.toFixed(2) + 'px)';
            }
        });
    }

    if (parallaxBlocks.length > 0) {
        handleParallax();
        window.addEventListener('scroll', handleParallax, { passive: true });
        window.addEventListener('resize', handleParallax);
    }

    const year = document.getElementById('year');
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
})();
