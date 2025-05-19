from flask import Flask, render_template, request, jsonify
import pickle
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

app = Flask(__name__)

# Load model and vectorizer
try:
    with open("model.pkl", "rb") as model_file:
        spam_model = pickle.load(model_file)
    
    with open("vectorizer.pkl", "rb") as vectorizer_file:
        vectorizer = pickle.load(vectorizer_file)
    
    # Assuming you have a separate model for category prediction
    # If not, you'll need to train one or use a rule-based approach
    with open("category_model.pkl", "rb") as category_model_file:
        category_model = pickle.load(category_model_file)
    
    # Download NLTK resources
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
    print("Models and vectorizer loaded successfully!")
except Exception as e:
    print(f"Error loading models or vectorizer: {e}")
    # If category model is not available, create a simple rule-based classifier
    category_model = None

# Define categories
CATEGORIES = ['Health', 'Sports', 'Politics', 'Entertainment', 'Science', 'Education', 'Spam', 'Business', 'Technology']

# Preprocessing function (same as in your notebook)
def preprocess_text(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)  # Remove punctuation
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stopwords.words('english')]  # Remove stopwords
    return " ".join(tokens)

# Simple rule-based category prediction (fallback if model is not available)
def predict_category_rule_based(text):
    text = text.lower()
    
    # Define keywords for each category
    keywords = {
        'Health': ['health', 'doctor', 'medical', 'disease', 'treatment', 'medicine', 'wellness', 'fitness'],
        'Sports': ['sports', 'game', 'player', 'team', 'match', 'football', 'basketball', 'baseball', 'soccer', 'cricket'],
        'Politics': ['politics', 'government', 'election', 'president', 'minister', 'law', 'policy', 'vote'],
        'Entertainment': ['entertainment', 'movie', 'music', 'actor', 'film', 'celebrity', 'tv', 'show'],
        'Science': ['science', 'research', 'study', 'scientist', 'discovery', 'experiment', 'theory', 'physics'],
        'Education': ['education', 'school', 'university', 'student', 'teacher', 'learn', 'course', 'degree'],
        'Business': ['business', 'company', 'market', 'finance', 'economy', 'stock', 'investment', 'corporate'],
        'Technology': ['technology', 'tech', 'software', 'computer', 'internet', 'app', 'digital', 'code', 'programming'],
        'Spam': ['spam', 'offer', 'free', 'click', 'buy', 'now', 'limited', 'urgent', 'winner', 'money']
    }
    
    # Count keyword matches for each category
    scores = {category: 0 for category in CATEGORIES}
    
    for category, category_keywords in keywords.items():
        for keyword in category_keywords:
            if keyword in text:
                scores[category] += 1
    
    # Return the category with the highest score
    max_score = 0
    predicted_category = 'Education'  # Default category
    
    for category, score in scores.items():
        if score > max_score:
            max_score = score
            predicted_category = category
    
    return predicted_category

@app.route('/team')
def team():
    return render_template('team.html')

@app.route('/about')

def about():
    return render_template('about.html')

@app.route('/')

def index():
    return render_template('index.html', categories=CATEGORIES)

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        if request.is_json:
            # Handle AJAX request
            data = request.get_json()
            question = data.get('question', '')
            
            # Preprocess the text
            cleaned_text = preprocess_text(question)
            
            # Vectorize the text
            text_vector = vectorizer.transform([cleaned_text])
            
            # Make spam prediction
            spam_prediction = spam_model.predict(text_vector)[0]
            spam_probability = spam_model.predict_proba(text_vector)[0]
            
            # Determine confidence
            spam_confidence = spam_probability[0] if spam_prediction == "not spam" else spam_probability[1]
            spam_confidence = round(spam_confidence * 100, 2)
            
            # Make category prediction
            if category_model is not None:
                category_prediction = category_model.predict(text_vector)[0]
                category_proba = category_model.predict_proba(text_vector)[0]
                category_confidence = round(max(category_proba) * 100, 2)
            else:
                # Use rule-based approach if model not available
                category_prediction = predict_category_rule_based(question)
                category_confidence = 70.0  # Default confidence for rule-based
            
            # Return result as JSON
            return jsonify({
                'question': question,
                'spam_prediction': spam_prediction,
                'spam_confidence': spam_confidence,
                'category_prediction': category_prediction,
                'category_confidence': category_confidence
            })
        else:
            # Handle form submission
            question = request.form.get('question', '')
            
            # Preprocess the text
            cleaned_text = preprocess_text(question)
            
            # Vectorize the text
            text_vector = vectorizer.transform([cleaned_text])
            
            # Make spam prediction
            spam_prediction = spam_model.predict(text_vector)[0]
            spam_probability = spam_model.predict_proba(text_vector)[0]
            
            # Determine confidence
            spam_confidence = spam_probability[0] if spam_prediction == "not spam" else spam_probability[1]
            spam_confidence = round(spam_confidence * 100, 2)
            
            # Make category prediction
            if category_model is not None:
                category_prediction = category_model.predict(text_vector)[0]
                category_proba = category_model.predict_proba(text_vector)[0]
                category_confidence = round(max(category_proba) * 100, 2)
            else:
                # Use rule-based approach if model not available
                category_prediction = predict_category_rule_based(question)
                category_confidence = 70.0  # Default confidence for rule-based
            
            # Return result template
            return render_template('result.html', 
                                  question=question, 
                                  spam_prediction=spam_prediction, 
                                  spam_confidence=spam_confidence,
                                  category_prediction=category_prediction,
                                  category_confidence=category_confidence)

if __name__ == '__main__':
    app.run(debug=True)
