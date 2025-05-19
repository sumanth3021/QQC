document.addEventListener('DOMContentLoaded', function() {
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle animation on scroll
    function handleScrollAnimation() {
        // Get all elements with animation classes
        const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
        
        elements.forEach(element => {
            if (isInViewport(element)) {
                element.style.animationDelay = '0.2s';
                element.style.animationPlayState = 'running';
            }
        });
    }
    
    // Set animation play state to paused initially
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
    animatedElements.forEach((element, index) => {
        element.style.animationPlayState = 'paused';
        element.style.animationDelay = (0.1 * index) + 's';
    });
    
    // Run once on page load
    handleScrollAnimation();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
});