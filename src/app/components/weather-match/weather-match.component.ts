import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WeatherCard {
  icon: string;
  isFlipped: boolean;
}

@Component({
  selector: 'app-weather-match',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-match.component.html',
  styleUrl: './weather-match.component.scss',
})
export class WeatherMatchComponent implements OnInit {
  weatherCards: WeatherCard[] = [];
  firstCard: WeatherCard | null = null;
  secondCard: WeatherCard | null = null;
  matchedPairs: number = 0;
  message: string = '';
  bestScore: number = 0;
  currentScore: number = 0;

  ngOnInit(): void {
    document.documentElement.style.setProperty(
      '--main-bg-color',
      'url("https://w.wallha.com/ws/14/QZI18Wij.png")'
    );
    this.initGame();
  }

  initGame() {
    const icons = [
      'sun',
      'cloudy',
      'storm',
      'snow',
      'rain',
      'moon',
      'hot',
      'cold',
      'sun',
      'cloudy',
      'storm',
      'snow',
      'rain',
      'moon',
      'hot',
      'cold',
    ];
    this.weatherCards = this.shuffle(
      icons.map((icon) => ({ icon, isFlipped: false }))
    );
    this.matchedPairs = 0;
    this.message = '';
    this.currentScore = 0;
    const scoreFromStorage = localStorage.getItem('bestScore');
    if (scoreFromStorage) {
      this.bestScore = JSON.parse(scoreFromStorage);
    } else this.bestScore = 0;
  }

  shuffle(array: WeatherCard[]): WeatherCard[] {
    return array.sort(() => Math.random() - 0.5);
  }

  flipCard(card: WeatherCard) {
    if ((this.firstCard && this.secondCard) || card === this.firstCard) return;

    card.isFlipped = true;

    if (!this.firstCard) {
      this.firstCard = card;
    } else {
      this.secondCard = card;
      this.checkMatch();
    }
  }

  checkMatch() {
    if (this.firstCard && this.secondCard) {
      this.currentScore++;
      if (this.firstCard.icon === this.secondCard.icon) {
        this.matchedPairs++;
        if (this.matchedPairs === this.weatherCards.length / 2) {
          this.message = 'Winner!';
          if (this.currentScore < this.bestScore || this.bestScore === 0) {
            this.bestScore = this.currentScore;
            localStorage.setItem(
              'bestScore',
              JSON.stringify(this.currentScore)
            );
          }
        }
        this.firstCard = null;
        this.secondCard = null;
      } else {
        setTimeout(() => {
          this.firstCard!.isFlipped = false;
          this.secondCard!.isFlipped = false;
          this.firstCard = null;
          this.secondCard = null;
        }, 1000);
      }
    }
  }
}
