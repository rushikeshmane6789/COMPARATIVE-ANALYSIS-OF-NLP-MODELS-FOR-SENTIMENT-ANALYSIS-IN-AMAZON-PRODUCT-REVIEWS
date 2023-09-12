import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'angular-tour-of-heroes';
  inputText: string = '';  
  outputText: string = '';
  sentimentScore: any = null;  // To store the sentiment score
  keywords: any[] = [];  // To store the extracted keywords
  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;
  stringSentimentScore: any;

  handleInput(event: any): void {
    this.inputText = event.target?.value || '';
  }

  constructor(private http: HttpClient) { }

  onSummarize() {
    this.sentimentScore = null;
    this.keywords = [];
    const apiUrl = 'http://127.0.0.1:5000/summarize';

    this.http.post(apiUrl, { text: this.inputText }).subscribe(
        (response: any) => {
            this.outputText = response.summary;
        },
        error => {
            console.error('There was an error!', error);
            this.outputText = 'Error generating the summary.';
        }
    );
  }

  onAnalyzeSentiment() {
    this.outputText = "";
    this.keywords = [];
    const apiUrl = 'http://127.0.0.1:5000/sentiment';

    this.http.post(apiUrl, { review: this.inputText }).subscribe(
        (response: any) => {
            console.log(response);
            this.stringSentimentScore = response;
            this.sentimentScore = {
              compound: parseFloat(response.compound),
              neg: parseFloat(response.neg),
              neu: parseFloat(response.neu),
              pos: parseFloat(response.pos)
            };
        },
        error => {
            console.error('There was an error!', error);
            this.sentimentScore = 'Error analyzing sentiment.';
        }
    );
  }

  onExtractKeywords() {
    this.sentimentScore = null;
    this.outputText = "";
    const apiUrl = 'http://127.0.0.1:5000/keywords';

    this.http.post(apiUrl, { review: this.inputText }).subscribe(
        (response: any) => {
            this.keywords = response.keywords;
        },
        error => {
            console.error('There was an error!', error);
            this.keywords = [];
        }
    );
  }
}
