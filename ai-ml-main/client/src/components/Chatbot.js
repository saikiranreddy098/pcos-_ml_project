import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import { sendMessage } from '../services/api';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await sendMessage(input);
      setMessages(prev => [...prev, 
        { type: 'user', content: input },
        { type: 'bot', content: response.message }
      ]);
      setInput('');
    } catch (error) {
      toast({
        title: "Message Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" p={6} rounded="lg" shadow="base">
      <Text fontSize="2xl" mb={4}>PCOS Assistant</Text>
      <VStack spacing={4}>
        <Box 
          w="full" 
          h="400px" 
          overflowY="auto" 
          p={4} 
          borderWidth={1}
          borderRadius="md"
        >
          {messages.map((msg, idx) => (
            <Flex
              key={idx}
              justify={msg.type === 'user' ? 'flex-end' : 'flex-start'}
              mb={2}
            >
              <Box
                maxW="80%"
                bg={msg.type === 'user' ? 'blue.500' : 'gray.100'}
                color={msg.type === 'user' ? 'white' : 'black'}
                p={3}
                rounded="lg"
              >
                {msg.content}
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Flex w="full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            mr={2}
          />
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleSendMessage}
            leftIcon={<FiSend />}
          >
            Send
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Chatbot;
