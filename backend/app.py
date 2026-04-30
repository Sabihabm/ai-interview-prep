from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

API_KEY = "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"

app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return response

def ask_ai(prompt):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "openrouter/auto",
            "messages": [{"role": "user", "content": prompt}]
        }
    )
    data = response.json()
    print("API RESPONSE:", data)  # This will show us what's coming back
    if "choices" in data:
        return data["choices"][0]["message"]["content"]
    elif "error" in data:
        return f"Error: {data['error']['message']}"
    else:
        return "Something went wrong"

@app.route("/generate-questions", methods=["POST", "OPTIONS"])
def generate_questions():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.json
    role = data.get("role", "Full Stack Developer")
    prompt = f"Generate 5 technical interview questions for a {role} intern position. Return only a numbered list, nothing else."
    result = ask_ai(prompt)
    return jsonify({"questions": result})

@app.route("/evaluate-answer", methods=["POST", "OPTIONS"])
def evaluate_answer():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.json
    question = data.get("question")
    answer = data.get("answer")
    prompt = f"Interview question: {question}\nCandidate's answer: {answer}\n\nEvaluate this answer in 3-4 lines. Mention what was good and what can be improved."
    result = ask_ai(prompt)
    return jsonify({"feedback": result})

if __name__ == "__main__":
    app.run(debug=True, port=5000)