import { Container, Heading, Textarea, VStack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ai: any;
  }
}

interface StringStream {
  [Symbol.asyncIterator](): AsyncIterator<string>;
}

interface LLMModel {
  prompt(inputValue: string): Promise<string>;
  promptStreaming(inputValue: string): StringStream;
}

function App() {
  const [userPrompt, setUserPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [model, setModel] = useState<LLMModel | null>(null);

  const initModel = async () => {
    const thisModel = await window.ai.createTextSession();
    setModel(thisModel);
  };

  useEffect(() => {
    initModel();
  }, []);

  const fetchModelReply = async () => {
    if (model == null) {
      return;
    }
    if (!userPrompt) {
      setAiOutput('');
      return;
    }
    const response = model.promptStreaming(userPrompt);
    for await (const chunk of response) {
      setAiOutput(chunk);
    }
  };

  const handleUserPromptChange = (value: string) => {
    setUserPrompt(value);
    fetchModelReply();
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Gemini Nano Playground
        </Heading>
        <Textarea
          value={userPrompt}
          onChange={(e) => handleUserPromptChange(e.target.value)}
          placeholder="Type something..."
          resize="vertical"
          autoFocus
        />
        <VStack align="left" spacing={4}>
          <Heading as="h3" size="md" textAlign={'left'}>
            Gemini Response
          </Heading>
          <Text>{aiOutput}</Text>
        </VStack>
      </VStack>
    </Container>
  );
}

export default App;
