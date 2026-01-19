export const generateResponse = (message: string) => {
  if (!message) return { ok: false, message: "Missing argument 'message'" };
  return {
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: message,
      },
      shouldEndSession: true,
    },
  } as ResponseBody;
};
