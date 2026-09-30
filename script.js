async function analyzeMessage() {
    const message = document.getElementById("message").value;

    if (message.trim() === "") {
        alert("Please enter a message!");
        return;
    }

    document.getElementById("result").innerHTML =
        "🔍 Analyzing message...";

    try {
        const response = await fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        let riskIcon = "🟢";

        if (data.risk === "HIGH") {
            riskIcon = "🔴";
        } else if (data.risk === "MEDIUM") {
            riskIcon = "🟡";
        }

        const words = data.detected.length > 0
            ? data.detected.join(", ")
            : "None detected";

        document.getElementById("result").innerHTML = `
            <h2>${riskIcon} Risk Level: ${data.risk}</h2>

            <h3>📊 Risk Score: ${data.score}%</h3>

            <p><b>🚨 Suspicious Indicators</b></p>
            <p>${words}</p>

            <p><b>🧠 Why is this suspicious?</b></p>

            ${data.reasons.map(reason =>
                `<p>⚠️ ${reason}</p>`
            ).join("")}

            <p><b>🛡️ Safety Advice</b></p>
            <p>${data.advice}</p>
        `;

    } catch (error) {
        document.getElementById("result").innerHTML =
            "❌ Cannot connect to AI Scam Shield server.";
    }
}