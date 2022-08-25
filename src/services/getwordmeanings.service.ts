import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { EListType, IWords } from 'src/app/components/wordList/wordlist.interface';
import { MeaningService } from 'src/helpers/backendrequest.service';
import { LocalStorageHandlerService } from './localstoragehandler.service';


@Injectable({
  providedIn: 'root'
})
export class MeaningsService {

  constructor(
    private http: HttpClient,
    private meaningService: MeaningService,
    private localStorageHandlerService: LocalStorageHandlerService
  ) { }

  public getMeanings = async ({ item }: { item: IWords }): Promise<any> => {

    let meaningList

    const _checkLocalStorage = async () => {
      if (!!meaningList) return
      const hystory: IWords[] = await this.localStorageHandlerService.getLocalStorage(EListType.history)
      const isWordInHistory: IWords = hystory?.find((value) => value.word === item.word )
      if (isWordInHistory) meaningList = isWordInHistory
    }

    const _checkDb = async () => {
      if (!!meaningList) return
      const db = await lastValueFrom(this.http.get(`http://localhost:3000/wordsDefinitions?word=${item.word}`))
      if (Object.keys(db).length) meaningList = db[0]
    }

    const _saveToDb = async () => {
      await lastValueFrom(this.http.post("http://localhost:3000/wordsDefinitions", meaningList ))
    }

    const _getExternal = async () => {
      if (!!meaningList) return
      meaningList = this.meaningService.meaningParser({ words: await lastValueFrom(this.http.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${item.word}`))})
      if ( !!meaningList ) await _saveToDb()
    }

    await _checkLocalStorage()
    await _checkDb()
    await _getExternal()

    if ( meaningList ) return meaningList

  }

}
