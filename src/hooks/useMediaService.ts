
// Fix the string | string[] type issue
const url = Array.isArray(mediaUrl) ? mediaUrl[0] : mediaUrl;

// Fix the extractMediaUrl call
const extractedUrl = extractMediaUrl(src as any);
