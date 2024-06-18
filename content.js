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
    chrome.storage.local.get(['apiKey'], async (result) => {
        const apiKey = result.apiKey;
        if (!apiKey) {
            alert('No API key set. Please set the API key in the extension popup.');
            return;
        }

        // Show the loader
        showLoader();

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
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

            showExplanationPopup(explanation);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to explain the code.');
        } finally {
            // Hide the loader
            hideLoader();
        }
    });
}

// Function to show the loader
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'code-explain-loader';
    loader.style.position = 'fixed';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.zIndex = '1000';
    loader.style.border = '16px solid #f3f3f3';
    loader.style.borderRadius = '50%';
    loader.style.borderTop = '16px solid #3498db';
    loader.style.width = '120px';
    loader.style.height = '120px';
    loader.style.animation = 'spin 2s linear infinite';
    document.body.appendChild(loader);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Function to hide the loader
function hideLoader() {
    const loader = document.getElementById('code-explain-loader');
    if (loader) {
        loader.remove();
    }
}

// Function to show the explanation in a popup modal
function showExplanationPopup(explanation) {
    // Create the modal elements
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.zIndex = '1000';
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    modal.style.width = '80%';
    modal.style.maxHeight = '80%';
    modal.style.overflowY = 'auto';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.display = 'block';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        modal.remove();
        hideLoader();
    });

    const explanationText = document.createElement('div');
    explanationText.textContent = explanation;

    modal.appendChild(explanationText);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);

    // Create a backdrop for the modal
    const backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    backdrop.style.zIndex = '999';
    backdrop.addEventListener('click', () => {
        modal.remove();
        hideLoader();
    });

    document.body.appendChild(backdrop);
}

// Call the function to highlight code blocks and add buttons
highlightCodeBlocks();
