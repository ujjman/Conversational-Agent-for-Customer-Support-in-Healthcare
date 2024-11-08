import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch past conversations on load
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/conversations');
        setConversation(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    // Scroll to bottom when conversation updates
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert('Please enter a question.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/ask', {
        question: question,
      });

      // Append new conversation
      setConversation((prev) => [...prev, response.data]);
      setQuestion(''); // Clear input
    } catch (error) {
      console.error('Error fetching answer:', error);
      alert('An error occurred while fetching the answer.');
    }
    setLoading(false);
  };

  // Define a custom theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Blue color
      },
      secondary: {
        main: '#f50057', // Pink color
      },
    },
  });

  // Chat message component
  const ChatMessage = ({ isUser, message }) => {
    return (
      <Box
        display="flex"
        justifyContent={isUser ? 'flex-end' : 'flex-start'}
        marginBottom="10px"
      >
        <Paper
          elevation={1}
          style={{
            padding: '10px',
            backgroundColor: isUser ? '#DCF8C6' : '#FFFFFF',
            maxWidth: '60%',
            borderRadius: '15px',
          }}
        >
          <Typography variant="body1">{message}</Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: '20px',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box display="flex" alignItems="center" marginBottom="20px">
            <ChatBubbleOutline color="primary" fontSize="large" />
            <Typography
              variant="h4"
              color="primary"
              style={{ marginLeft: '10px' }}
            >
              Healthcare Conversational Agent
            </Typography>
          </Box>
          <Box
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              paddingRight: '10px',
            }}
          >
            {conversation.map((qa, index) => (
              <React.Fragment key={index}>
                <ChatMessage isUser={true} message={qa.question} />
                <ChatMessage isUser={false} message={qa.answer} />
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        </Paper>
        <Paper elevation={3} style={{ padding: '10px', marginTop: '10px' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Type your healthcare question here..."
              multiline
              rows={2}
              variant="outlined"
              fullWidth
              value={question}
              onChange={handleQuestionChange}
            />
            <Box marginTop="10px" textAlign="right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Send'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
