export const textSliced = (text: string, limit: number): string => {
  let outputText = text;
  if (text?.length > limit) {
    outputText = text.slice(0, limit);
    // if (typeof outputText === "string") {
    outputText += "...";
    // }
    // else {
    //   outputText.push("...");
    // }
  }
  return outputText;
};

export const formatFileSize = (bytes: number, decimalPoint?: number) => {
  if(bytes == 0) return '0 Bytes';
  let k = 1000,
    dm = decimalPoint || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
