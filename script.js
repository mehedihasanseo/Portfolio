// Smooth scrolling and navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero buttons smooth scrolling
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        if (button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        // Validate form
        if (!validateForm(name, email, subject, message)) {
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Submit form using enhanced contact form functionality
        submitContactForm(formData)
            .then(response => {
                if (response.success) {
                    showFormMessage(response.message, 'success');
                    contactForm.reset();
                } else {
                    showFormMessage(response.message || 'Sorry, there was an error sending your message. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showFormMessage('Sorry, there was an error sending your message. Please contact directly at mehediha106@gmail.com', 'error');
            })
            .finally(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    });
    
    // Form validation
    function validateForm(name, email, subject, message) {
        if (!name) {
            showFormMessage('Please enter your name.', 'error');
            return false;
        }
        
        if (!email) {
            showFormMessage('Please enter your email address.', 'error');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!subject) {
            showFormMessage('Please enter a subject.', 'error');
            return false;
        }
        
        if (!message) {
            showFormMessage('Please enter your message.', 'error');
            return false;
        }
        
        if (message.length < 10) {
            showFormMessage('Message should be at least 10 characters long.', 'error');
            return false;
        }
        
        return true;
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show form message
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Scroll animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const animatedElements = document.querySelectorAll('.skill-card, .timeline-item, .portfolio-item, .education-item, .stat');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .skill-card, .timeline-item, .portfolio-item, .education-item, .stat {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .skill-card.animate-in, .timeline-item.animate-in, .portfolio-item.animate-in, .education-item.animate-in, .stat.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .timeline-item:nth-child(even).animate-in {
            animation: slideInRight 0.6s ease forwards;
        }
        
        .timeline-item:nth-child(odd).animate-in {
            animation: slideInLeft 0.6s ease forwards;
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @media (max-width: 768px) {
            .timeline-item:nth-child(even).animate-in {
                animation: slideInLeft 0.6s ease forwards;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Portfolio links analytics (you can replace with actual analytics)
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim();
            console.log(`Portfolio link clicked: ${linkText}`);
            // In real implementation, you would send this to Google Analytics or similar
        });
    });
    
    // Add typing effect to hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Initialize typing effect for the name
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        setTimeout(() => {
            typeWriter(nameElement, originalText, 150);
        }, 1000);
    }
    
    // Lazy loading for external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
    });
    
    // Performance optimization: Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
    
    preloadCriticalResources();
    
    // Back to top functionality
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    // Back to top styles
    const backToTopStyles = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--shadow);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background-color: var(--primary-color);
            transform: translateY(-3px);
            box-shadow: var(--shadow-hover);
        }
        
        @media (max-width: 768px) {
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    
    const backToTopStyleSheet = document.createElement('style');
    backToTopStyleSheet.textContent = backToTopStyles;
    document.head.appendChild(backToTopStyleSheet);
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Back to top click handler
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize page
    updateActiveNavLink();
    
    // Clean up any previously registered service workers to prevent 404 errors
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        });
    }
});

// Contact form email functionality
async function submitContactForm(formData) {
    const contactData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        subject: formData.get('subject').trim(),
        message: formData.get('message').trim()
    };
    
    try {
        // Send data to our email server endpoint
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('Email sent successfully to mehediha106@gmail.com');
            return {
                success: true,
                message: result.message
            };
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('Email sending failed:', error);
        return {
            success: false,
            message: 'দুঃখিত, বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি mehediha106@gmail.com এ ইমেইল করুন অথবা +8801639021353 এ ফোন করুন।'
        };
    }
}