import axios from "axios";
import { config } from "../config";

interface Route {
  name: string;
  from: string;
  to: string;
}

interface TravelTime {
  name: string;
  travelTimeMinutes: number;
  trafficDelayMinutes: number;
  distanceKm: string;
}

export default class Traffic {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.mytomtomUrl;
  }

  public async getTravelTime(from: string, to: string): Promise<TravelTime> {
    const url = `${this.baseUrl}/routing/1/calculateRoute/${from}:${to}/json`;

    const response = await axios.get(url, {
      params: {
        key: config.mytomtomKey,
        traffic: "true",
        travelMode: "car",
      },
    });

    const summary = response.data.routes[0].summary;

    return {
      name: "",
      travelTimeMinutes: Math.round(summary.travelTimeInSeconds / 60),
      trafficDelayMinutes: Math.round(summary.trafficDelayInSeconds / 60),
      distanceKm: (summary.lengthInMeters / 1000).toFixed(1),
    };
  }

  public async checkRoutes(routes: Route[]): Promise<TravelTime[]> {
    const results = await Promise.all(
      routes.map(async (route) => {
        const time = await this.getTravelTime(route.from, route.to);
        return { ...time, name: route.name };
      }),
    );
    return results;
  }
}
