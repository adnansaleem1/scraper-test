import { ApiProperty } from '@nestjs/swagger';


class GroupInformation {
    @ApiProperty({ example: 'FEMALE' })
    groupTypeCode: string;
  
    @ApiProperty({ example: '25-30' })
    age: string;
  
    @ApiProperty({ type: [String], example: ['WEEKENDAWAY'] })
    tripTypeCodes: string[];
  }
  
  class Rating {
    @ApiProperty({ example: 100 })
    value: number;
  
    @ApiProperty({ example: 80 })
    safety: number;
  
    @ApiProperty({ example: 100 })
    location: number;
  
    @ApiProperty({ example: 100 })
    staff: number;
  
    @ApiProperty({ example: 100 })
    atmosphere: number;
  
    @ApiProperty({ example: 100 })
    cleanliness: number;
  
    @ApiProperty({ example: 100 })
    facilities: number;
  
    @ApiProperty({ example: 97 })
    overall: number;
  }
  
  class Gender {
      @ApiProperty({ example: 'Female' })
      value: string;
    
      @ApiProperty({ example: 'Female' })
      id: string;
    }
    
    class Nationality {
      @ApiProperty({ example: 'US' })
      code: string;
    
      @ApiProperty({ example: 'USA' })
      name: string;
    }
  
  class User {
    @ApiProperty({ example: 29558153 })
    id: number;
  
    @ApiProperty({ type: Gender })
    gender: Gender;
  
    @ApiProperty({ type: Nationality })
    nationality: Nationality;
  
    @ApiProperty({ example: null })
    image: any;
  
    @ApiProperty({ example: 'mbrandt16564' })
    nickname: string;
  
    @ApiProperty({ example: '3' })
    numberOfReviews: string;
  }
  

export class Review {
  @ApiProperty({ example: '15325402' })
  id: string;

  @ApiProperty({ example: '2024-06-29' })
  date: string;

  @ApiProperty({ example: 'Great hostel, good vibes, there was a rooftop DJ party happening the night I arrived. The only downside is that I wish I stayed longer. The room I stayed in was clean, bed was comfortable and I felt safe being there. Very accessible to subway.' })
  notes: string;

  @ApiProperty({ example: true })
  isMachineTranslated: boolean;

  @ApiProperty({ example: 'en' })
  languageCode: string;

  @ApiProperty({ example: null })
  ownerComment: string | null;

  @ApiProperty({ type: GroupInformation })
  groupInformation: GroupInformation;

  @ApiProperty({ type: Rating })
  rating: Rating;

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ example: null })
  liked: any;

  @ApiProperty({ example: null })
  disliked: any;

  @ApiProperty({ example: null })
  recommended: any;
}



