import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScrapeReviewsDto } from './dto/scraper.dto';
import { Review } from '../models/review.model';
@ApiTags('reviews')
@ApiBearerAuth()
@Controller('scraper')
export class ScraperController {
    constructor(private readonly scraperService: ScraperService){}
    
  @Post('scrapeReviews')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Successfully scraped reviews.', type: [Review] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async scrapeReviews(@Body() scrapeReviewsDto: ScrapeReviewsDto): Promise<Review[]> {
    const { url, maxDate, maxReviews } = scrapeReviewsDto;
    return this.scraperService.scrapeReviews(url, maxDate, maxReviews);
  }
}
