import { WeatherService } from '@/main/services/weather.service';
import { IContactRepository } from '../infra/structs';

export class GetContactWithWeatherUseCase {
  constructor(
    private readonly contactRepository: IContactRepository,
    private readonly weatherService: WeatherService
  ) {}
  async execute(id: number) {
    const contact = await this.contactRepository.getById(id);
    const weather = await this.weatherService.byCity(contact!.address);
    return { contact, weather };
  }
}
