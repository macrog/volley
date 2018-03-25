import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GameService } from 'services/game.service';
import { HttpService } from 'services/http.service';
import { GetSetPipe } from 'pipes/getset.pipe';

@NgModule({
  declarations: [
    AppComponent, GetSetPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [HttpService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
