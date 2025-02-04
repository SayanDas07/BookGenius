from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app, origins=["https://book-genius-two.vercel.app"])  

# Load the pickled data
popular_df = pickle.load(open('popular.pkl', 'rb'))
pt = pickle.load(open('mainModel.pkl', 'rb'))
books = pickle.load(open('booksModel.pkl', 'rb'))
similarity_scores = pickle.load(open('similarity_scoresModel.pkl', 'rb'))


@app.route('/api/popular-books', methods=['GET'])
def get_popular_books():
    """Return the most popular books"""
    data = popular_df.to_dict(orient='records')
    return jsonify(data)

@app.route('/api/book-titles', methods=['GET'])
def get_book_titles():
    """Return all available book titles for the dropdown"""
    book_titles = sorted(pt.index.unique().tolist())
    return jsonify(book_titles)

@app.route('/api/recommend', methods=['POST'])
def recommend_books():
    """Return recommended books based on a selected book"""
    data = request.get_json()
    selected_book = data.get("book_title")

    if selected_book not in pt.index:
        return jsonify({"error": "Book not found"}), 404

    index = np.where(pt.index == selected_book)[0][0]
    similar_items = sorted(list(enumerate(similarity_scores[index])), key=lambda x: x[1], reverse=True)[1:5]

    recommendations = []
    for i, score in similar_items:
        temp_df = books[books['Book-Title'] == pt.index[i]].drop_duplicates('Book-Title')
        for _, row in temp_df.iterrows():
            recommendations.append({
                "title": row["Book-Title"],
                "author": row["Book-Author"],
                "image_url": row["Image-URL-M"],
                "score": round(score * 100, 2)
            })

    return jsonify(recommendations)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))  
    app.run(host="0.0.0.0", port=port, debug=False)