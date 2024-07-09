import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { extractId } from '../helpers/utils';
import { Review } from '../models/review.model';

jest.mock('axios');
jest.mock('../helpers/utils');

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeReviews', () => {
    const url = 'https://www.hostelworld.com/hosteldetails.php/SomeHostel';
    const maxDate = '2023-12-31';
    const maxReviews = 10;
    const id = '123456';

    beforeEach(() => {
      (extractId as jest.Mock).mockReturnValue(id);
    });

    it('should return reviews on successful scrape', async () => {
      const mockResponse = {
        data: {
          reviews: [
            { date: '2023-01-01', rating: '5', text: 'Great place to stay!' },
            { date: '2023-01-02', rating: '4', text: 'Nice hostel' },
          ],
          pagination: { numberOfPages: 1 },
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.scrapeReviews(url, maxDate, maxReviews);

      expect(result).toEqual([
        { date: '2023-01-01', rating: '5', text: 'Great place to stay!' },
        { date: '2023-01-02', rating: '4', text: 'Nice hostel' },
      ]);
    });

    it('should throw BadRequestException for invalid URL', async () => {
      (extractId as jest.Mock).mockReturnValue(null);

      await expect(service.scrapeReviews(url, maxDate, maxReviews)).rejects.toThrow(
        new HttpException('Invalid URL or unable to extract ID', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw InternalServerErrorException for scraping errors', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      await expect(service.scrapeReviews(url, maxDate, maxReviews)).rejects.toThrow(
        new HttpException('Failed to scrape reviews', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
