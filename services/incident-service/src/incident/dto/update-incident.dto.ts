import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { IncidentPriority, IncidentStatus, IncidentCategory } from '@prisma/client';

export class UpdateIncidentDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    subject?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(IncidentPriority)
    priority?: IncidentPriority;

    @IsOptional()
    @IsEnum(IncidentStatus)
    status?: IncidentStatus;

    @IsOptional()
    @IsEnum(IncidentCategory)
    category?: IncidentCategory;

    @IsOptional()
    @IsString()
    assigneeId?: string;

    @IsOptional()
    @IsString()
    assigneeName?: string;
}
