from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "AI Scam Shield Backend Running!"


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    message = data.get("message", "").lower()

    scam_patterns = {
        "otp": "The message asks for an OTP.",
        "urgent": "It creates a sense of urgency.",
        "click": "It asks you to click a link.",
        "prize": "It contains a prize or reward claim.",
        "verify": "It asks you to verify an account.",
        "upi": "It mentions a UPI/payment request.",
        "send money": "It asks you to send money.",
        "refund": "It mentions a refund request."
    }

    detected = []
    reasons = []

    for word, explanation in scam_patterns.items():
        if word in message:
            detected.append(word)
            reasons.append(explanation)

    score = min(len(detected) * 15, 100)

    if score >= 60:
        risk = "HIGH"
        advice = "Do not click links, share OTPs, or send money."
    elif score >= 30:
        risk = "MEDIUM"
        advice = "Verify the sender before taking any action."
    else:
        risk = "LOW"
        advice = "No major scam indicators were detected."

    return jsonify({
        "risk": risk,
        "score": score,
        "detected": detected,
        "reasons": reasons,
        "advice": advice
    })


if __name__ == "__main__":
    app.run(debug=True)