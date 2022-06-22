import { Component, ViewChild, ElementRef } from '@angular/core';
import { generateSlug } from "random-word-slugs";
import { FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent{

  @ViewChild('tileContainer') tileContainer : ElementRef;
  @ViewChild('header') header : ElementRef;

  slugWord: string = "";
  tileTop: string = '0px';
  tileLeft: string = '0px';
  randomRGB: string = '';
  wordDisplayInterval: any;

  userInputForm = this.fb.group({       
    numberOfWords: [2000, [Validators.required, Validators.minLength(1), Validators.pattern("/([2-9][0-9][0-9][0-9])|([2-9][0-9][0-9][0-9])|([1-9]\d{3}\d*)/;")]],
    wordsPerMinute: [200, [Validators.required, Validators.minLength(1), Validators.pattern("/([2-9][0-9][0-9])|([2-9][0-9][0-9])|([1-9]\d{3}\d*)/;")]]
  });

  constructor(
    private fb: FormBuilder
  ){
  }

  generate(){
    let index = 0;
    let numberOfWordsByUser = this.userInputForm.value.numberOfWords;
    let wordsPerMinuteByUser = this.userInputForm.value.wordsPerMinute;
    let delay = (60/wordsPerMinuteByUser)*1000;

    let slugArray = generateSlug(numberOfWordsByUser).split('-');

    this.wordDisplayInterval = setInterval(()=> {
      if(index < slugArray.length){
        this.setTilePosition();
        this.rgbGenerator();
        this.slugWord = slugArray[index];
        ++index;
      }
      else{
        clearInterval(this.wordDisplayInterval);
        this.resetGame();
      }  
    }, delay);
  }

  setTilePosition(){
    let pageWidth = window.innerWidth;
    let pageHeight = window.innerHeight;

    let tileContainerWidth = this.tileContainer.nativeElement.offsetWidth;
    let tileContainerHeight = this.tileContainer.nativeElement.offsetHeight;
    let headerHeight = this.header.nativeElement.offsetHeight;
    let refHeight = pageHeight-headerHeight;

    let tileTop = Math.round(Math.random() * refHeight);
    if((tileTop+tileContainerHeight) >= refHeight)
      this.tileTop = refHeight - tileContainerHeight + "px";
    else if(tileTop<=headerHeight)
      this.tileTop = headerHeight + "px";
    else
      this.tileTop = tileTop + "px";

    let tileLeft = Math.round(Math.random() * pageWidth);
    if((tileLeft+tileContainerWidth) >= pageWidth)
      this.tileLeft = pageWidth - tileContainerWidth + "px";
    else
      this.tileLeft = tileLeft + "px";   
  }

  rgbGenerator(){
    const randomBetween = (min: number, max:number) => min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    this.randomRGB = `rgb(${r},${g},${b})`;
  }

  stopReader(){
    clearInterval(this.wordDisplayInterval);
    this.resetGame();
  }

  resetGame(){
    this.tileTop = '0px';
    this.tileLeft = '0px';
    this.slugWord = "";
  }

}
