import axios from 'axios';

export type WeatherInfo = {
  temperature?: number;
  condition?: string;
  suggestion?: string;
  error?: string;
};

function suggestionFrom(
  temp: number | undefined,
  condition: string | undefined
): string | undefined {
  if (temp === undefined) return undefined;
  const cond = (condition || '').toLowerCase();

  if (temp <= 18) return 'Ofereça um chocolate quente ao seu contato...';
  if (temp >= 30 && (cond.includes('sol') || cond.includes('ensolar')))
    return 'Convide seu contato para ir à praia com esse calor!';
  if (temp >= 30 && (cond.includes('chuva') || cond.includes('chuvis')))
    return 'Convide seu contato para tomar um sorvete';
  if (
    temp > 18 &&
    temp < 30 &&
    (cond.includes('sol') || cond.includes('ensolar'))
  )
    return 'Convide seu contato para fazer alguma atividade ao ar livre';
  if (
    temp > 18 &&
    temp < 30 &&
    (cond.includes('chuva') || cond.includes('chuvis'))
  )
    return 'Convide seu contato para ver um filme';
  return undefined;
}

export class WeatherService {
  baseUrl = 'https://api.hgbrasil.com/weather';
  apiKey = process.env.HGBRASIL_KEY;

  async byCity(city: string): Promise<WeatherInfo> {
    try {
      const url = `${this.baseUrl}?format=json&city_name=${encodeURIComponent(
        city
      )}${this.apiKey ? `&key=${this.apiKey}` : ''}`;
      const { data } = await axios.get(url, { timeout: 5000 });
      const temp = data?.results?.temp;
      const cond = data?.results?.description;
      const suggestion = suggestionFrom(temp, cond);
      return { temperature: temp, condition: cond, suggestion };
    } catch (err) {
      return { error: 'Unable to obtain weather at this time.' };
    }
  }
}
