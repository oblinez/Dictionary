export enum EListType {
  list,
  favorite,
  history,
}

export interface IWord {
  id: number,
  word: string,
  isActive: boolean
}

export interface IWords {
  id?: number;
  word?: string;
  phonetic?: IPhonetics;
  meaning?: IMeaning;
}

export interface IPhonetics {
  audio?: string;
  text?: string;
}

export interface IMeaning {
  partOfSpeech?: string;
  definitions?: string | {};
}

export interface IWordsWithIndex {
  data: IWords,
  index: number
  
}