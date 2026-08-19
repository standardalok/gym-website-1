/* ==========================================================================
   Apex Fitness - Premium Interactivity Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header Header On Scroll ---
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on init in case user reloads scrolled down


    // --- 2. Mobile Navigation Toggle Menu ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is active on mobile
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Once animated, we don't need to observe it again
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers: show all instantly
        revealElements.forEach(el => el.classList.add('reveal-active'));
    }


    // --- 4. Interactive Class Schedule Weekday Filters ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const dayPanels = document.querySelectorAll('.day-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetDay = button.getAttribute('data-day');

            // Set active tab button
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            // Show target panel, hide others
            dayPanels.forEach(panel => {
                const panelId = panel.getAttribute('id');
                if (panelId === `panel-${targetDay}`) {
                    panel.style.display = 'block';
                    // Trigger a tiny animation re-flow
                    setTimeout(() => {
                        panel.classList.add('active');
                    }, 50);
                } else {
                    panel.style.display = 'none';
                    panel.classList.remove('active');
                }
            });
        });
    });


    // --- 5. Interactive Lightbox Photo Gallery Modal ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentImageIndex = 0;
    const galleryImages = [];

    // Compile list of image paths and captions
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        const caption = item.getAttribute('data-caption');
        
        galleryImages.push({
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            caption: caption
        });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    const openLightbox = (index) => {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 400);
    };

    const updateLightboxContent = () => {
        const item = galleryImages[currentImageIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxCaption.textContent = item.caption;
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxContent();
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxContent();
    };

    // Lightbox Event Listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Close on overlay clicking (outside the image container)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard controls for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });


    // --- 6. Modal Window Control Logic (Pass, Join, Reserve) ---
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const customModals = document.querySelectorAll('.custom-modal');
    const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');

    // Dynamic state trackers
    const reserveClassNameSpan = document.getElementById('reserve-class-name');
    const reserveClassTimeSpan = document.getElementById('reserve-class-time');
    const joinPlanNameSpan = document.getElementById('join-plan-name');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);

            if (!targetModal) return;

            // Handle dynamic data attributes binding
            if (modalId === 'reserve-modal') {
                const className = trigger.getAttribute('data-class') || 'Group Workout';
                const classTime = trigger.getAttribute('data-time') || 'scheduled slot';
                reserveClassNameSpan.textContent = className;
                reserveClassTimeSpan.textContent = classTime;
            } else if (modalId === 'join-modal') {
                const planName = trigger.getAttribute('data-plan') || 'Unlimited Membership';
                joinPlanNameSpan.textContent = planName;
            } else if (modalId === 'tour-modal') {
                // We'll reuse the pass-modal or contact form for quick tour scheduling,
                // let's route tour bookings to the general contact form scroll or pass modal
                const trainerName = trigger.getAttribute('data-trainer');
                const contactSelect = document.getElementById('form-interest');
                const contactTextarea = document.getElementById('form-message');
                
                if (contactSelect && contactTextarea) {
                    contactSelect.value = 'Book a Tour';
                    contactTextarea.value = `Hi, I would like to book an introductory training session with ${trainerName}.`;
                    
                    // Smooth scroll to contact form container
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    // Give form card a gold glow highlight pulse
                    const formContainer = document.getElementById('form-container');
                    formContainer.style.boxShadow = '0 0 35px rgba(255, 78, 0, 0.4)';
                    setTimeout(() => {
                        formContainer.style.boxShadow = '';
                    }, 2000);
                    return; // Don't open normal modal since we routed to the page form
                }
            }

            openModal(targetModal);
        });
    });

    // Also bind schedule table book buttons to opening the reservation modal
    const classBookButtons = document.querySelectorAll('.class-book-btn');
    classBookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const className = btn.getAttribute('data-class') || 'Group Workout';
            const classTime = btn.getAttribute('data-time') || 'scheduled slot';
            reserveClassNameSpan.textContent = className;
            reserveClassTimeSpan.textContent = classTime;
            openModal(document.getElementById('reserve-modal'));
        });
    });

    const openModal = (modal) => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400);
    };

    modalCloses.forEach(close => {
        close.addEventListener('click', (e) => {
            const activeModal = close.closest('.custom-modal');
            if (activeModal) {
                closeModal(activeModal);
            }
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            customModals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });


    // --- 7. Toast Notification System & Form Submission mock ---
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-msg');

    const showToast = (message) => {
        toastMsg.textContent = message;
        toast.classList.add('active');
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    };

    // Config: Change this to the owner's mobile number (with country code, no + or spaces)
    const OWNER_WHATSAPP_PHONE = '15558904523'; 

    const redirectWhatsApp = (messageText) => {
        const url = `https://api.whatsapp.com/send?phone=${OWNER_WHATSAPP_PHONE}&text=${encodeURIComponent(messageText)}`;
        window.open(url, '_blank');
    };

    // Bind Forms
    const contactForm = document.getElementById('gym-contact-form');
    const passForm = document.getElementById('modal-pass-form');
    const reserveForm = document.getElementById('modal-reserve-form');
    const joinForm = document.getElementById('modal-join-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const email = document.getElementById('form-email').value;
            const interest = document.getElementById('form-interest').value;
            const trainer = document.getElementById('form-trainer').value;
            const message = document.getElementById('form-message').value;

            const textMsg = `*Apex Fitness - New Enquiry Info*\n` +
                            `• *Name:* ${name}\n` +
                            `• *Phone:* ${phone}\n` +
                            `• *Email:* ${email}\n` +
                            `• *Goal:* ${interest}\n` +
                            `• *Trainer Choice:* ${trainer}\n` +
                            `• *Notes/Goals:* ${message || 'None'}`;
            
            showToast(`Thank you, ${name}! Your request has been formatted. WhatsApp will open to send details.`);
            redirectWhatsApp(textMsg);
            contactForm.reset();
        });
    }

    if (passForm) {
        passForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('pass-name').value;
            const email = document.getElementById('pass-email').value;
            const phone = document.getElementById('pass-phone').value;

            const textMsg = `*Apex Fitness - 3-Day Free Pass Request*\n` +
                            `• *Name:* ${name}\n` +
                            `• *Email:* ${email}\n` +
                            `• *Phone:* ${phone}`;
            
            closeModal(document.getElementById('pass-modal'));
            showToast(`Pass request ready! WhatsApp is opening to submit...`);
            redirectWhatsApp(textMsg);
            passForm.reset();
        });
    }

    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reserve-name').value;
            const email = document.getElementById('reserve-email').value;
            const className = reserveClassNameSpan.textContent;
            const classTime = reserveClassTimeSpan.textContent;

            const textMsg = `*Apex Fitness - Class Spot Reservation*\n` +
                            `• *Class Name:* ${className}\n` +
                            `• *Class Time:* ${classTime}\n` +
                            `• *Client Name:* ${name}\n` +
                            `• *Email:* ${email}`;
            
            closeModal(document.getElementById('reserve-modal'));
            showToast(`Reservation ready! Opening WhatsApp...`);
            redirectWhatsApp(textMsg);
            reserveForm.reset();
        });
    }

    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('join-name').value;
            const email = document.getElementById('join-email').value;
            const phone = document.getElementById('join-phone').value;
            const plan = joinPlanNameSpan.textContent;

            const textMsg = `*Apex Fitness - New Membership Secure Request*\n` +
                            `• *Plan Selected:* ${plan}\n` +
                            `• *Client Name:* ${name}\n` +
                            `• *Email:* ${email}\n` +
                            `• *Phone:* ${phone}`;
            
            closeModal(document.getElementById('join-modal'));
            showToast(`Membership details ready! Opening WhatsApp to register...`);
            redirectWhatsApp(textMsg);
            joinForm.reset();
        });
    }

});
