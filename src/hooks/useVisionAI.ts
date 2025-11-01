import { useState } from 'react';

export const useVisionAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (
    imageUrl: string,
    prompt: string = 'Analyze this file and provide detailed insights about its content.',
    model: string = 'gpt-5-nano'
  ): Promise<string> => {
    // @ts-ignore - Puter is loaded via script tag
    const puter = (window as any)?.puter;
    if (!puter?.ai?.chat) {
      console.warn('Puter AI not available');
      return '';
    }

    setIsAnalyzing(true);

    // Avoid long hangs and suppress user-facing errors
    const withTimeout = <T,>(p: Promise<T>, ms = 25000) =>
      new Promise<T>((resolve) => {
        const t = setTimeout(() => resolve('' as unknown as T), ms);
        p
          .then((v) => {
            clearTimeout(t);
            resolve(v);
          })
          .catch(() => {
            clearTimeout(t);
            resolve('' as unknown as T);
          });
      });

    try {
      const chatPromise = (async () => {
        const res = await puter.ai.chat(prompt, imageUrl, { model });

        // Streaming response support
        const hasAsyncIter = (res as any)?.[Symbol.asyncIterator]?.bind(res);
        if (hasAsyncIter) {
          let full = '';
          for await (const part of res as any) {
            const text = part?.text ?? part?.delta ?? part?.message?.content ?? '';
            if (typeof text === 'string') full += text;
          }
          return full.trim();
        }

        // Non-streaming fallbacks
        if (typeof res === 'string') return res;
        if (Array.isArray(res)) return res.map((p: any) => p?.text || '').join('');
        if (res && typeof res === 'object' && typeof (res as any).text === 'string') return (res as any).text;

        return '';
      })();

      return await withTimeout(chatPromise);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeImage, isAnalyzing };
};
