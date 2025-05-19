document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('question-form');
    const resultContainer = document.getElementById('result-container');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('result-card');
    const resultQuestion = document.getElementById('result-question');
    const resultSpamPrediction = document.getElementById('result-spam-prediction');
    const resultSpamConfidence = document.getElementById('result-spam-confidence');
    const resultSpamIcon = document.getElementById('result-spam-icon');
    const resultCategoryPrediction = document.getElementById('result-category-prediction');
    const resultCategoryConfidence = document.getElementById('result-category-confidence');
    const resultCategoryIcon = document.getElementById('result-category-icon');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Toggle navigation menu on mobile
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close navigation menu when clicking on nav links
    document.querySelectorAll('.nav-links li').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Set active class based on current page
    const currentPage = window.location.pathname;
    document.querySelectorAll('.nav-links li a').forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
            link.parentElement.classList.add('active');
        } else if (currentPage === '/' && link.getAttribute('href') === '/') {
            link.parentElement.classList.add('active');
        }
    });
    // Get category icon class

    function getCategoryIconClass(category) {
        const categoryIcons = {
            'Health': 'fa-heartbeat',
            'Sports': 'fa-futbol',
            'Politics': 'fa-landmark',
            'Entertainment': 'fa-film',
            'Science': 'fa-flask',
            'Education': 'fa-graduation-cap',
            'Spam': 'fa-ban',
            'Business': 'fa-briefcase',
            'Technology': 'fa-microchip'
        };
        
        return categoryIcons[category] || 'fa-tag';
    }
    
    // Only setup AJAX if we're on the index page
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get question value
            const question = document.getElementById('question').value;
            
            // Show loader, hide result
            resultContainer.style.display = 'block';
            loader.style.display = 'flex';
            resultCard.style.display = 'none';
            
            // Send AJAX request
            fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question
                })
            })
            .then(response => response.json())
            .then(data => {
                // Hide loader, show result
                loader.style.display = 'none';
                resultCard.style.display = 'block';
                
                // Update result content
                resultQuestion.textContent = data.question;
                
                // Update spam prediction
                resultSpamPrediction.textContent = data.spam_prediction;
                resultSpamPrediction.className = data.spam_prediction === 'spam' ? 'prediction-label spam' : 'prediction-label not-spam';
                resultSpamConfidence.textContent = data.spam_confidence;
                resultSpamIcon.className = data.spam_prediction === 'spam' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
                
                // Update category prediction
                resultCategoryPrediction.textContent = data.category_prediction;
                resultCategoryPrediction.className = 'category-label ' + data.category_prediction.toLowerCase();
                resultCategoryConfidence.textContent = data.category_confidence;
                resultCategoryIcon.className = 'fas ' + getCategoryIconClass(data.category_prediction);
                
                // Scroll to result
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            }); // Closing brace for the submit event listener
        }); // Closing brace for the form event listener
    } // Closing brace for the DOMContentLoaded event listener
}); // Closing brace for the entire script
