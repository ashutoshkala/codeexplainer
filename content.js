// Function to highlight code blocks and add "Explain" buttons
function highlightCodeBlocks() {
    const codeSelectors = `
        code.language-cpp,
        code.language-c,
        code.language-java,
        code.language-python3,
        code.language-csharp,
        code.language-javascript,
        code.language-php
    `;
    const codeElements = document.querySelectorAll(codeSelectors);

    codeElements.forEach(codeElement => {
        // Highlight the code block
        codeElement.style.backgroundColor = "#f0f0f0";
        codeElement.style.border = "1px solid #ccc";
        codeElement.style.padding = "10px";
        codeElement.style.display = "block";
        codeElement.style.marginBottom = "10px";
        codeElement.style.whiteSpace = "pre-wrap"; // Ensure code block text wraps correctly

        // Create and append the "Explain" button
        const explainButton = document.createElement("button");
        explainButton.textContent = "Explain";
        explainButton.style.display = "block";
        explainButton.style.marginTop = "5px";
        explainButton.addEventListener("click", () => explainCode(codeElement.textContent));
        codeElement.parentNode.insertBefore(explainButton, codeElement.nextSibling);
    });
}

// Function to handle "Explain" button click and call the API
async function explainCode(code) {
    // const apiUrl = 'http://127.0.0.1:2000/generate'; // Replace with your API endpoint
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3-8b-instruct:free",
                "messages": [
                    { "role": "user", "content": "Explain the given code " + code },
                ],
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const explanation = result.choices[0].message.content;

        alert(explanation);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to explain the code.');
    }
}

// Call the function to highlight code blocks and add buttons
highlightCodeBlocks();
