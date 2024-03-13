import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

class CreateUrlDto {
    @IsString()
    @IsNotEmpty()
    longUrl: string;
}
export default CreateUrlDto;
