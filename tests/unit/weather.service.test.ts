import { WeatherService } from '@/main/services/weather.service';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(() => {
    service = new WeatherService();
    jest.clearAllMocks();
  });

  it('should return suggestion for cold weather', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { results: { temp: 10, description: 'Frio e nublado' } },
    });

    const result = await service.byCity('São Paulo');

    expect(result.temperature).toBe(10);
    expect(result.condition).toBe('Frio e nublado');
    expect(result.suggestion).toBe(
      'Ofereça um chocolate quente ao seu contato...'
    );
  });

  it('should return suggestion for hot and sunny weather', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { results: { temp: 35, description: 'Ensolarado' } },
    });

    const result = await service.byCity('Rio de Janeiro');

    expect(result.suggestion).toBe(
      'Convide seu contato para ir à praia com esse calor!'
    );
  });

  it('should return error when axios throws', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await service.byCity('Curitiba');

    expect(result.error).toBe('Unable to obtain weather at this time.');
  });
});
