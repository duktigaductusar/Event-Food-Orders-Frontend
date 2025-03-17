import { Injectable } from "@angular/core"
import { IEventDto } from "@app/models/card.model"
import { type Observable, of } from "rxjs"


@Injectable({
  providedIn: "root",
})
export class EventService {
  private cards: IEventDto[] = [
    {
      id: 1,
      title: "Business Meeting",
      description: "Quarterly review with stakeholders",            
      date: new Date("2023-07-15"),      
    },
    {
      id: 2,
      title: "Team Lunch",
      description: "Casual lunch with the development team",      
      date: new Date("2023-07-20"),     
    },
    {
      id: 3,
      title: "Product Launch",
      description: "New product line introduction to the market",      
      date: new Date("2023-08-05"),      
    },
    {
      id: 4,
      title: "Training Workshop",
      description: "Technical training for new software tools",      
      date: new Date("2023-08-12"),      
    },
    {
      id: 5,
      title: "Client Presentation",
      description: "Presenting new proposals to key clients",            
      date: new Date("2023-08-18"),      
    },
    {
      id: 6,
      title: "Team Building",
      description: "Outdoor activities for team bonding",      
      date: new Date("2023-09-02"),      
    },
    {
      id: 7,
      title: "Conference",
      description: "Annual industry conference with keynote speakers",      
      date: new Date("2023-09-15"),      
    },
    {
      id: 8,
      title: "Strategy Session",
      description: "Planning session for Q4 objectives",      
      date: new Date("2023-09-22"),      
    },
    {
      id: 9,
      title: "Holiday Party",
      description: "End of year celebration for all employees",      
      date: new Date("2023-12-15"),      
    },
    {
      id: 10,
      title: "Webinar",
      description: "Online session about industry trends",      
      date: new Date("2023-10-05"),      
    },
    {
      id: 11,
      title: "Board Meeting",
      description: "Quarterly board meeting with directors",      
      date: new Date("2023-10-12"),      
    },
    {
      id: 12,
      title: "Hackathon",
      description: "48-hour coding challenge for innovation",      
      date: new Date("2023-11-10"),      
    },
  ]

  getCards(): Observable<IEventDto[]> {
    // Simulate HTTP request
    return of(this.cards)
  }

  getCardById(id: number): Observable<IEventDto | undefined> {
    const card = this.cards.find((c) => c.id === id)
    return of(card)
  }
}

