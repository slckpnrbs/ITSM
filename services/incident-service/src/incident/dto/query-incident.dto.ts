import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { IncidentPriority, IncidentStatus } from '@prisma/client';

export class QueryIncidentDto {
    @IsOptional()
    @Transform(({ value }) => value !== undefined && value !== null ? parseInt(value, 10) : undefined)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => value !== undefined && value !== null ? parseInt(value, 10) : undefined)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsEnum(IncidentStatus)
    status?: IncidentStatus;

    @IsOptional()
    @IsEnum(IncidentPriority)
    priority?: IncidentPriority;

    @IsOptional()
    @IsString()
    assigneeId?: string;

    @IsOptional()
    @IsString()
    search?: string;
}
