import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsDateString } from 'class-validator';
export class ScrapeReviewsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://www.hostelworld.com/hosteldetails.php/SomeHostel', description: 'URL of the hostel on Hostel World' })
  url: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-07-10', description: 'Maximum date after which no further scraping should occur' })
  maxDate: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 100, description: 'Maximum number of reviews after which no further scraping should occur' })
  maxReviews: number;
}