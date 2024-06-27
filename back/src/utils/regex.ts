// Utils for regular expressions - regex.ts
export const JWTregex = RegExp(
  /Bearer\s([a-zA-Z0-9-_.]+)\.([a-zA-Z0-9-_.]+)\.([a-zA-Z0-9-_.]+)/,
);

export const usernameRegex = RegExp(/^[a-zA-Z0-9]{3,30}$/);

export const emailRegex = RegExp(
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
);

// Password must contain at least 6 characters, including at least 1 letter, 1 uppercase letter, 1 number and one special character
export const passwordRegex = RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
);

export const urlRegex = RegExp(/^(http|https):\/\/[^ "]+$/);

export const apiKeyRegex = RegExp(
  /^(?=.*[0-9])(?=.*[a-zA-Z0-9@#$!%*?&])[a-zA-Z0-9@#$!%*?&]{32}$/,
);

export const domainRegex = RegExp(
  /^(http|https):\/\/(www\.)?([a-zA-Z0-9-_.]+)\.([a-zA-Z0-9-_.]+)$/,
);

export const apiUrlRegex = RegExp(
  /^(http|https):\/\/([a-zA-Z0-9-_.]+)\.([a-zA-Z0-9-_.]+)(\/[a-zA-Z0-9-_.]+)*$/,
);