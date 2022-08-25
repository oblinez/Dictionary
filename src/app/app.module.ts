import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerModule } from './components/banner/banner.module';
import { PlayerModule } from './components/player/player.module';
import { WordListModule } from './components/wordList/wordlist.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BannerModule,
    PlayerModule,
    WordListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
