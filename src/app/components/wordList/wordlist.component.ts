import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIService } from 'src/services/backendrequest.service';
import { MeaningsService } from 'src/services/getwordmeanings.service';
import { LocalStorageHandlerService } from 'src/services/localstoragehandler.service';
import { MobileCheckService } from 'src/services/mobileCheck.service';
import { EListType, IWord, IWords, IWordsWithIndex } from './wordlist.interface';

@Component({
  selector: 'app-wordlist',
  templateUrl: './wordlist.component.html',
  styleUrls: ['./wordlist.component.scss']
})


export class WordlistComponent implements OnInit {

  @Output() wordToSend = new EventEmitter<any>();
  @Output() openPlayerIfMobile = new EventEmitter<boolean>();
  

  @Input() set listRefresh(listRefresh: number) {
    if (!listRefresh) return
    this.getLocalStorage(EListType.favorite);
  }

  @Input() set previousNext(previousNext: IWordsWithIndex) {
    if (!previousNext) return
      const word = this.listToBeDisplayed.find((data, index) => {
      return index === previousNext.index
    })
    this.handleOption({ item: word, index: previousNext.index });
  }


  public listType = EListType;
  public listToBeDisplayed: IWord[] = [];
  public isMobile: boolean = false

  public Lists: { [key: number]: IWord[] } = {
    [EListType.list]: [],
    [EListType.favorite]: [],
    [EListType.history]: [],
  }

  public listOptions: { [key: number]: boolean } = {
    [EListType.list]: true,
    [EListType.favorite]: false,
    [EListType.history]: false
  };

  public gridButtons = {
    pressed: 0,
    type: EListType.list,
    page: 1,
    error: undefined
  }

  constructor(
    private api: APIService,
    private meanings: MeaningsService,
    private localStorageHandlerService: LocalStorageHandlerService,
    private mobileCheckService: MobileCheckService,
  ) { 
    this.isMobile = this.mobileCheckService.getMobileStatus()
  }

  ngOnInit(): void {
    this.getWords( { page: this.gridButtons.page } );

  }

  public getWords( { page } ): void {
    this.api.getWords( { page } ).then((data) => {
      this.Lists[EListType.list] = this.Lists[EListType.list].concat(data)
      this.listToBeDisplayed = structuredClone(this.Lists[EListType.list])
      this.getLocalStorage(EListType.favorite);
      this.getLocalStorage(EListType.history);
      if ( !this.isMobile ) this.handleOption({ item: this.Lists[EListType.list][0], index: 0 })
    });
  }

  public getLocalStorage(key): void {
    this.localStorageHandlerService.getLocalStorage(key).then((data) => {
      this.Lists[key] = data 
      if ( key === EListType.favorite && this.listOptions[EListType.favorite] ) {
        this.listToBeDisplayed = structuredClone(this.Lists[key])
      }
    });
  }

  public listSelect({ type }: { type: EListType }): void {
    this.listOptions[type] = true;
    for (const key in this.listOptions) {
      if (key !== type.toString()) {
        this.listOptions[key] = false;
      }
    }
    this.listToBeDisplayed = structuredClone(this.Lists[type])
    this.gridButtons.pressed = 0
    if (this.listToBeDisplayed.length && !this.isMobile ) this.handleOption({ item: this.listToBeDisplayed[0], index: 0 })
  }

  public handleOption = ({ item, index }: { item: IWords, index: number }) => {
    this.meanings.getMeanings({ item }).then((data) => {
      if (!data) {
        this.gridButtons.error = `this word does not exist on free dictionary`
        return
      }
      if ( !!this.gridButtons.error ) this.gridButtons.error = undefined
      this.setPressed(index)
      this.wordToSend.emit( { data, index } );
      if (this.listOptions[EListType.list] && !Boolean(this.Lists[EListType.history]?.find((value) => { return value.word === item.word }))) {
        if (!this.Lists[EListType.history] || !Object.keys(this.Lists[EListType.history]).length ) this.Lists[EListType.history] = []
        this.Lists[EListType.history].push(data)
        this.localStorageHandlerService.setLocalStorage(EListType.history, this.Lists[EListType.history])
      }
      if ( this.isMobile ) this.openPlayerIfMobile.emit(true)
    });
  }

  public setPressed(index) {
    if ( this.gridButtons.pressed !== index && this.gridButtons.pressed < this.listToBeDisplayed.length ) {
      this.listToBeDisplayed[this.gridButtons.pressed].isActive = false
    }
    this.listToBeDisplayed[index].isActive = true
    this.gridButtons.pressed = index
  }

  public showMoreItens() {
    this.gridButtons.page+=1
    this.getWords( { page: this.gridButtons.page } )
  }

}
