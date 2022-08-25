import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordlistComponent } from './wordlist.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    WordlistComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    InfiniteScrollModule,
  ],
  exports: [
    WordlistComponent
  ]
})
export class WordListModule { }
