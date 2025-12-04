import { useState } from 'react';
import { toast } from 'sonner';

export type SpeechVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

interface UseTextToSpeechOptions {
  voice?: SpeechVoice;
}

export const useTextToSpeech = (options?: UseTextToSpeechOptions) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = new Audio();

  const speak = async (text: string, voice: SpeechVoice = 'nova') => {
    if (!text.trim()) {
      toast.error('No text to speak');
      return;
    }

    setIsGenerating(true);
    try {
      // Encode text for URL
      const encodedText = encodeURIComponent(text);
      const url = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.src = audioUrl;
      audioRef.onplay = () => setIsSpeaking(true);
      audioRef.onended = () => setIsSpeaking(false);
      audioRef.onerror = () => {
        toast.error('Failed to play audio');
        setIsSpeaking(false);
      };

      audioRef.play();
      toast.success('Playing audio');
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast.error('Failed to generate speech');
    } finally {
      setIsGenerating(false);
    }
  };

  const stop = () => {
    audioRef.pause();
    audioRef.currentTime = 0;
    setIsSpeaking(false);
  };

  const pause = () => {
    audioRef.pause();
  };

  const resume = () => {
    audioRef.play();
  };

  return {
    isSpeaking,
    isGenerating,
    speak,
    stop,
    pause,
    resume,
  };
};
