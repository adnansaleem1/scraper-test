import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { extractId } from '../helpers/utils';
import { Review } from '../models/review.model';
@Injectable()
export class ScraperService {
    async scrapeReviews(url: string, maxDate: string, maxReviews: number): Promise<Review[]> {
        try {
        const reviews: Review[] = [];
        let page = 1;
        const id = extractId(url);
        if(!id) throw new HttpException("Invalid URL or unable to extract ID", HttpStatus.BAD_REQUEST );
        while (reviews.length < maxReviews) {
          const response = await axios.get(`https://prod.apigee.hostelworld.com/legacy-hwapi-service/2.2/properties/${id}/reviews/?sort=-date&allLanguages=false&page=${page}&monthCount=36&application=web`);
                
            const data = response.data.reviews.filter((review: any)=> new Date(review.date) <= new Date(maxDate));       
    
            reviews.push(...data);
    
          if (response.data.pagination.numberOfPages=== page) break;
          page++;
        }
    
        return reviews;
        } catch (error) {
            console.log(error)
            if (error.message === 'Invalid URL or unable to extract ID') {
                throw new HttpException('Invalid URL or unable to extract ID', HttpStatus.BAD_REQUEST);
              }
            throw new HttpException('Failed to scrape reviews', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
}
