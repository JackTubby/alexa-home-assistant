interface ResponseBody {
  version: string;
  response: {
    outputSpeech: {
      type: string;
      text: string;
    };
    shouldEndSession: boolean;
  };
}
