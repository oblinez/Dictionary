import { Component, OnInit, Output } from '@angular/core';
import { MobileCheckService } from 'src/services/mobileCheck.service';
import { IWords, IWordsWithIndex } from './components/wordList/wordlist.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public word: any
  public previousNext: IWordsWithIndex
  public isMobile: any
  public playerState: boolean = false
  @Output() public listRefresh: number

  constructor( 
    private getMobileStatus: MobileCheckService
  ) { }

  ngOnInit(): void {
    if ( !this.getMobileStatus.getMobileStatus() ) this.playerState = true
  }

  public onWord(event): void {
    this.word = event;
  }

  public wordListRefresh(event) {
    this.listRefresh = event
  }

  public previousNextWord(event) {
    this.previousNext = event
  }

  public closePlayer( event ) {
    this.playerState = event
  }

  public openPlayer(event) {
    this.playerState = event
  }
}
