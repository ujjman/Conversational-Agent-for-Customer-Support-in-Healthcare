from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import uvicorn
import logging
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM

from sqlalchemy import create_engine, Column, Integer, Text, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from datetime import datetime
from typing import List

from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Configure logging
logging.basicConfig(filename="interactions.log", level=logging.INFO)

# Set up the database
engine = create_engine('sqlite:///conversations.db', connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the Conversation model
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    question = Column(Text)
    answer = Column(Text)

Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the prompt template for the conversational chain
template = """Question: {question}

Answer: Let's think step by step."""
prompt = ChatPromptTemplate.from_template(template)

# Load the fine-tuned model from Ollama
model = OllamaLLM(model="<ModelName>")
chain = prompt | model

# Define Pydantic models
class Query(BaseModel):
    question: str

class ConversationBase(BaseModel):
    id: int
    timestamp: datetime
    question: str
    answer: str

    class Config:
        orm_mode = True

# Endpoint to handle questions
@app.post("/ask", response_model=ConversationBase)
async def ask_question(query: Query, db: Session = Depends(get_db)):
    try:
        # Log the user's question
        logging.info(f"User Question: {query.question}")

        # Invoke the model chain to get a response
        response = chain.invoke({"question": query.question})
        
        # Log the model's response
        logging.info(f"Model Response: {response}")
        print(response)
        
        # Save the conversation to the database
        conversation = Conversation(question=query.question, answer=response)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

        return conversation
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing request")

# Endpoint to retrieve past conversations
@app.get("/conversations", response_model=List[ConversationBase])
def get_conversations(db: Session = Depends(get_db)):
    conversations = db.query(Conversation).order_by(Conversation.timestamp).all()
    return conversations

# Run the app if this file is executed directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
