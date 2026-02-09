import { IsString, IsOptional, IsEnum, MaxLength, IsEmail } from 'class-validator';
import { IncidentPriority, IncidentCategory } from '@prisma/client';

export class CreateIncidentDto {
    @IsString()
    @MaxLength(200)
    subject: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(IncidentPriority)
    priority?: IncidentPriority;

    @IsOptional()
    @IsEnum(IncidentCategory)
    category?: IncidentCategory;

    @IsString()
    reporterId: string;

    @IsEmail()
    reporterEmail: string;

    @IsString()
    reporterName: string;

    @IsOptional()
    @IsString()
    source?: string;

    @IsOptional()
    @IsString()
    emailMessageId?: string;
}
