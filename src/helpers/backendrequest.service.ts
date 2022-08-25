import { Injectable } from '@angular/core';
import { IWords } from 'src/app/components/wordList/wordlist.interface';

interface IAPIWords extends IWords  {
  meaning?: {
    partOfSpeech?: string;
    definitions?: {
      definition?: string;
    }
  }
}

@Injectable({
  providedIn: 'root'
})

export class MeaningService {

  constructor() { }

  public meaningParser = ({ words }): IWords => {
    let formatedMeaning: IAPIWords = {}
    words.forEach((item) => {
      if (!formatedMeaning.word) formatedMeaning.word = item.word;

      if (!formatedMeaning.phonetic) formatedMeaning.phonetic = item.phonetics.filter((value, i, arr) => {
        if (value.text && value.audio) return value;
      })[0];

      if (!formatedMeaning.meaning) formatedMeaning.meaning = item.meanings.map((meanings) => {
        return {
          partOfSpeech: meanings.partOfSpeech,
          definitions: meanings.definitions.filter((value, i, arr) => {
            if (value.definition) return value.definition;
          })[0]
        }
      })[0]
    });
    if ( !formatedMeaning?.phonetic?.audio || !formatedMeaning?.word ) {
      return undefined
    }
    return {
      word: formatedMeaning.word,
      phonetic: {
        audio: formatedMeaning.phonetic.audio,
        text: formatedMeaning.phonetic.text
      },
      meaning: {
        partOfSpeech: formatedMeaning.meaning.partOfSpeech,
        definitions: formatedMeaning.meaning.definitions.definition
      }
    };
  }
}
