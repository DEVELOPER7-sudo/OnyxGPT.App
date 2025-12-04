import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface UseSpeechToTextOptions {
  onTranscribed?: (text: string) => void;
}

export const useSpeechToText = (options?: UseSpeechToTextOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);

        // Stop the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Convert audio chunks to wav format
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

        // Transcribe the audio
        await transcribeAudio(audioBlob, resolve);
      };

      mediaRecorderRef.current.stop();
    });
  };

  const transcribeAudio = async (audioBlob: Blob, resolve: (value: string | null) => void) => {
    setIsTranscribing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Audio = (e.target?.result as string).split(',')[1];

        const payload = {
          model: 'openai-audio',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Transcribe this audio:' },
                {
                  type: 'input_audio',
                  input_audio: {
                    data: base64Audio,
                    format: 'wav',
                  },
                },
              ],
            },
          ],
        };

        try {
          const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const data = await response.json();
          const transcribedText = data.choices?.[0]?.message?.content || '';

          if (transcribedText) {
            toast.success('Transcription complete');
            options?.onTranscribed?.(transcribedText);
            resolve(transcribedText);
          } else {
            toast.error('Failed to transcribe audio');
            resolve(null);
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast.error('Failed to transcribe audio');
          resolve(null);
        } finally {
          setIsTranscribing(false);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process audio');
      setIsTranscribing(false);
      resolve(null);
    }
  };

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  };
};
