import { ContactController } from '@/main/controllers/contact.controller';
import { ContactRepository } from '@/infra/repositories';
import {
  CreateContactUseCase,
  GetContactWithWeatherUseCase,
  ListContactUseCase,
} from '@/usecases';
import { WeatherService } from '@/main/services/weather.service';

export function makeContactController() {
  const repository = new ContactRepository();
  const weatherService = new WeatherService();
  const createContact = new CreateContactUseCase(repository);
  const listContact = new ListContactUseCase(repository);
  const getContactWithWeather = new GetContactWithWeatherUseCase(
    repository,
    weatherService
  );
  return new ContactController(
    createContact,
    listContact,
    getContactWithWeather
  );
}
