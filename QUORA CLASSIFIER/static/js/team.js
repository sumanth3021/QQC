/**
 * Team Page JavaScript
 * Handles interactivity for the Quora Question Classifier Team page
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Team card hover effects
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 12px 20px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        });
    });
    
    // Social media link interactions
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#2962ff'; // Primary color
            this.style.transform = 'translateY(-5px) scale(1.2)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '';
            this.style.transform = '';
        });
    });
    
    // Add email popup functionality
    const emailLinks = document.querySelectorAll('.social-links a i.fas.fa-envelope');
    emailLinks.forEach(link => {
        link.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            const teamMember = this.closest('.team-card').querySelector('h3').textContent;
            alert(`Contact ${teamMember} at example@qqclassifier.com`);
        });
    });
    
    // Add random color accent to member images on page load
    const memberImages = document.querySelectorAll('.member-image');
    const colors = [
        'linear-gradient(135deg, #2962ff, #0039cb)',
        'linear-gradient(135deg, #2979ff, #004ecb)',
        'linear-gradient(135deg, #00b0ff, #0081cb)',
        'linear-gradient(135deg, #00b8d4, #0088a3)',
        'linear-gradient(135deg, #00bfa5, #008e76)'
    ];
    
    
    memberImages.forEach(img => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        img.style.background = randomColor;
    });
    
    // Simple animation for page load
    const header = document.querySelector('header');
    const teamSection = document.querySelector('.team-section');
    
    if (header && teamSection) {
        header.style.opacity = '0';
        teamSection.style.opacity = '0';
        
        setTimeout(() => {
            header.style.transition = 'opacity 0.8s ease';
            header.style.opacity = '1';
            
            setTimeout(() => {
                teamSection.style.transition = 'opacity 0.8s ease';
                teamSection.style.opacity = '1';
            }, 200);
        }, 100);
    }
});