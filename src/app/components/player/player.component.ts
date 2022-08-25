import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LocalStorageHandlerService } from 'src/services/localstoragehandler.service';
import { MobileCheckService } from 'src/services/mobileCheck.service';
import { EListType, IWords, IWordsWithIndex } from '../wordList/wordlist.interface';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnChanges {

  public audioProperty: {
    audio: HTMLAudioElement,
    currentTime: number,
    duration: number,
    paused: boolean,
  } = {
      audio: new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"),
      currentTime: 0,
      duration: 0,
      paused: true,
    };

  public favoriteInfos = {
    hasfavorite: false,
    favorite: [],
  }
  public favoriteIcon: string
  public isMobile: boolean = true

  @Input() public sendWord: IWordsWithIndex;
  @Input() public pauseAudio: IWordsWithIndex;
  @Output() public refreshList = new EventEmitter<number>()
  @Output() public previousNext = new EventEmitter<IWordsWithIndex>()
  @Output() public closeP = new EventEmitter<boolean>()

  constructor(
    private mobileCheckService: MobileCheckService,
    private localStorageHandlerService: LocalStorageHandlerService
  ) {
    this.isMobile = this.mobileCheckService.getMobileStatus()
  }

  ngOnInit(): void {
    this.mediaControl()
  }

  public mediaControl() {
    this.audioProperty.audio.onloadedmetadata = () => {
      this.audioProperty.duration = this.audioProperty.audio.duration;
    }
    this.audioProperty.audio.onplay = () => {
      this.audioProperty.paused = false;
    }
    this.audioProperty.audio.onpause = () => {
      this.audioProperty.paused = true;
    };
    this.audioProperty.audio.onended = () => {
      this.audioProperty.paused = true;
    }
    this.audioProperty.audio.ontimeupdate = () => { this.updateCurrentTime() };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["sendWord"]?.currentValue) {
      this.audioProperty.audio.pause()
      this.audioProperty.audio = new Audio(this.sendWord.data.phonetic.audio)
      this.sendWord.data.phonetic.text = this.sendWord.data.phonetic.text.slice(1, -1)
      this.mediaControl()
      this.checkFavorite()
    }
  }

  public checkFavorite() {
    this.localStorageHandlerService.getLocalStorage(EListType.favorite).then((value: IWords[]) => {
      this.favoriteInfos.favorite = value
      const hasFavorite = Boolean(value?.find((val) => val.word === this.sendWord.data.word ))
      this.favoriteInfos.hasfavorite = hasFavorite
      this.setFavoriteIcon(this.favoriteInfos.hasfavorite)
    })
  }

  public setFavoriteIcon(hasFavorite = this.favoriteInfos.hasfavorite) {
    if (hasFavorite) return this.favoriteIcon = `assets/imgs/Player/remove.png`
    return this.favoriteIcon = `assets/imgs/Player/add.png`
  }

  private updateCurrentTime(): void {
    this.audioProperty.currentTime = Number((this.audioProperty.audio.currentTime / this.audioProperty.duration) * 100)
  }

  public playMusic(): void {
    this.audioProperty.audio.play()
  }
  public pauseMusic(): void {
    this.audioProperty.audio.pause()
  }

  public async addRemoveToFavorite(): Promise<any> {

    const _add = () => {
      if ( !this.favoriteInfos.favorite ) this.favoriteInfos.favorite = []
      this.favoriteInfos.favorite.push(this.sendWord.data)
      this.localStorageHandlerService.setLocalStorage(EListType.favorite, this.favoriteInfos.favorite)
    }

    const _remove = () =>  {
      const index = this.favoriteInfos.favorite.findIndex((value: IWords) => {
        return value.word === this.sendWord.data.word
      })
      this.favoriteInfos?.favorite.splice(index, 1)
      this.localStorageHandlerService.setLocalStorage(EListType.favorite, this.favoriteInfos.favorite)

    }

    this.favoriteInfos.hasfavorite ? _remove() : _add()
    this.checkFavorite()
    this.refreshList.emit(Math.random())
  }

  public previousWord() {
    if ( this.sendWord.index === 0 ) return
    this.sendWord.index = this.sendWord.index - 1
    this.previousNext.emit(this.sendWord)
  }

  public nextWord() {
    this.sendWord.index = this.sendWord.index + 1
    this.previousNext.emit(this.sendWord)
  }

  public closePlayer() {
    this.closeP.emit(false)
  }

}
