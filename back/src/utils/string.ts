// Utils for string manipulation - string.ts
import { usernameRegex } from "./regex";
 
export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeFirstLetterOfEachPhrase = (str: string) => {
  return str.replace(/(^\w{1}|\.\s*\w{1})/gi, (match) => match.toUpperCase());
};

export const capitalizeFirstLetterAndLetterAfterEachHyphen = (str: string) => {
  return str.replace(/(^|-)(\w)/g, (match) => match.toUpperCase());
};

export const capitalizeFirstLetterOfEachWord = (str: string) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
};

export const hasSpecialCharacters = (str: string) => {
  return usernameRegex.test(str);
}