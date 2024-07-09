import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { ScrapeReviewsDto } from './dto/scraper.dto';

describe('ScraperController', () => {
  let controller: ScraperController;
  let scraperService: ScraperService;

  const mockScraperService = {
    scrapeReviews: jest.fn((url, maxDate, maxReviews) => {
      if (!url) {
        throw new BadRequestException('Invalid URL or unable to extract ID');
      }
      if (!maxDate) {
        throw new BadRequestException('Invalid date');
      }
      if (!maxReviews || maxReviews <= 0) {
        throw new BadRequestException('Invalid max reviews');
      }
      return [
        { date: '2023-01-01', rating: '5', text: 'Great place to stay!' },
        { date: '2023-01-02', rating: '4', text: 'Nice hostel' },
      ];
    }),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { userId: 1, username: 'testuser' };
      return true;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      providers: [
        {
          provide: ScraperService,
          useValue: mockScraperService,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
    scraperService = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('scrapeReviews', () => {
    it('should return an array of reviews on successful scrape', async () => {
      const scrapeReviewsDto: ScrapeReviewsDto = {
        url: 'https://www.hostelworld.com/pwa/wds/hosteldetails.php/The-Local-NYC/New-York/76281',
        maxDate: '2023-12-31',
        maxReviews: 10,
      };

      const result = await controller.scrapeReviews(scrapeReviewsDto);
      expect(result).toEqual([
        { date: '2023-01-01', rating: '5', text: 'Great place to stay!' },
        { date: '2023-01-02', rating: '4', text: 'Nice hostel' },
      ]);
      expect(scraperService.scrapeReviews).toHaveBeenCalledWith(
        scrapeReviewsDto.url,
        scrapeReviewsDto.maxDate,
        scrapeReviewsDto.maxReviews
      );
    });

    it('should throw BadRequestException if URL is missing', async () => {
      const scrapeReviewsDto: ScrapeReviewsDto = {
        url: '',
        maxDate: '2023-12-31',
        maxReviews: 10,
      };

      await expect(controller.scrapeReviews(scrapeReviewsDto)).rejects.toThrow(
        new BadRequestException('Invalid URL or unable to extract ID')
      );
    });

    it('should throw BadRequestException if maxDate is missing', async () => {
      const scrapeReviewsDto: ScrapeReviewsDto = {
        url: 'https://www.hostelworld.com/pwa/wds/hosteldetails.php/The-Local-NYC/New-York/76281',
        maxDate: '',
        maxReviews: 10,
      };

      await expect(controller.scrapeReviews(scrapeReviewsDto)).rejects.toThrow(
        new BadRequestException('Invalid date')
      );
    });

    it('should throw BadRequestException if maxReviews is invalid', async () => {
      const scrapeReviewsDto: ScrapeReviewsDto = {
        url: 'https://www.hostelworld.com/hosteldetails.php/SomeHostel',
        maxDate: '2023-12-31',
        maxReviews: 0,
      };

      await expect(controller.scrapeReviews(scrapeReviewsDto)).rejects.toThrow(
        new BadRequestException('Invalid max reviews')
      );
    });
  });
});
