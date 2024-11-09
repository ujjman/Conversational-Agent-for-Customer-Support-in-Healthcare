# 💬 Customizable Conversational Agent for Customer Support

![Conversational Agent Banner](screenshots/banner.png)

## 📝 Description

A powerful conversational AI application that can be customized to fit different business needs, built using Ollama and LangChain for efficient real-time responses. Currently fine-tuned for healthcare industry support.

![App Demo](screenshots/main-interface.png)

## ✨ Features

- 🌐 **Domain-Specific Fine-Tuning:**
  - Customize the agent for industries like e-commerce, healthcare, etc.
- 📊 **Agent Dashboard:**
  - Track and analyze user interactions and feedback.
- ⚡ **Real-Time Responses:**
  - Efficient and accurate answers to user queries.
- 💾 **Conversation History:**
  - Stores user conversations locally for a persistent chat experience.

## 🖥️ Screenshots

### Chat Interface

![Chat Interface](screenshots/chat-interface1.png)
![Chat Interface](screenshots/chat-interface2.png)
<!-- Add screenshot of the chat interface -->


## 🚀 Getting Started

### Prerequisites

- **Backend:**
  - Python 3.8 or higher
  - Ollama installed and configured
  - LangChain packages
  - SQLAlchemy for database interactions
- **Frontend:**
  - Node.js and npm
- **Git**

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ujjman/Conversational-Agent-for-Customer-Support-in-Healthcare
   cd Conversational-Agent-for-Customer-Support-in-Healthcare

2. **Set up a virtual environment:**

    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # Linux/Mac
    python3 -m venv venv
    source venv/bin/activate
    ```
3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Install Finetuned model from huggingface:**
    ```bash
    git lfs install

    git clone https://huggingface.co/ujjman/llama-3.2-3B-Medical-QnA-unsloth-gguf
    ```

5. **Go to model directory and select your quantized model:**
    - Go to the directeory
        ```bash
        cd llama-3.2-3B-Medical-QnA-unsloth-gguf
         ```
    - Now create a file named 'ModelFile.txt' with below content:
        ```bash
        # Modelfile
        FROM "./<name-of-quantized-model.gguf>"
        ```
        In place of <name-of-quantized-model.gguf>, write the name of your selected model. For eg if you select 8-bit quantized model then your 'ModelFile.txt' content will be:

        ```bash
        # Modelfile
        FROM "./<unsloth.Q8_0.gguf>"
        ```
6. **Now use ollama to build the above model using command:**
    ```bash
    ollama create "llama-3.2-3B-Medical-QnA-unsloth" -f Modelfile.txt
    ```
    Replace "llama-3.2-3B-Medical-QnA-unsloth" with the name you want to give your model, and Modelfile.txt with the path to your Modelfile.


4. **Include the model name in the backend code:**

    ```bash
    #Add the model name same as you saved it in ollama(same as above)
    model = OllamaLLM(model="<ModelName>")
    #For eg if you saved model as "llama-3.2-3B-Medical-QnA-unsloth" then
    model = OllamaLLM(model="llama-3.2-3B-Medical-QnA-unsloth")
    ```

4. **Run the backend server:**

    ```bash
    python backend.py
    ```

5. **Frontend Setup**

    Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

6. **Install dependencies:**

    ```bash
    npm install
    ```

7. **Run the frontend app:**

    ```bash
    npm start
    ```

    
💻 Usage
1. Access the Chat Interface:

    - Open your web browser and navigate to http://localhost:3000.

2. Interact with the Agent:

   - Type in your healthcare-related questions.
Receive real-time responses from the agent.

3. View Conversation History:

    - Previous conversations are stored and displayed upon reopening the app.


🛠️ Technical Architecture

```bash
graph TD
    A[User Interface] --> B[Frontend (React)]
    B --> C[API Calls]
    C --> D[Backend (FastAPI)]
    D --> E{Ollama Model}
    E --> F[LangChain Integration]
    F --> G[Database (SQLAlchemy)]
    G --> D
    D --> B
```

📁 Application Structure
```bash
conversational-agent/
│   ├── backend.py                # Backend application code
│   ├── requirements.txt       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   └── ... other components ...
│   ├── package.json           # Frontend dependencies
│   └── ... other frontend files ...
├── screenshots/
│   ├── banner.png
│   ├── main-interface.png
│   ├── chat-interface1.png
│   ├── chat-interface2.png
├── README.md                  # Project documentation
```

🤝 Contributing
1. Fork the Repository

    ```bash
    git clone https://github.com/ujjman/Conversational-Agent-for-Customer-Support-in-Healthcare
    ```

2. Create a Feature Branch

    ```bash
    git checkout -b feature/YourFeature
    ```

3. Commit Your Changes

    ```bash
    git commit -m "Add your feature"
    ```

4. Push to the Branch

    ```bash
    git push origin feature/YourFeature
    ```

5. Open a Pull Request

🙏 Acknowledgments
- Ollama for providing the model serving capabilities.
- LangChain for language model integration.
- FastAPI for the backend framework.
- React for the frontend framework.
- Community Contributors for their valuable input and support.