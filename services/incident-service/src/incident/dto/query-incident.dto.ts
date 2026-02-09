import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { IncidentPriority, IncidentStatus } from '@prisma/client';

export class QueryIncidentDto {
    @IsOptional()
    @Transform(({ value }) => value !== undefined && value !== null && value !== '' ? parseInt(value, 10) : undefined)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => value !== undefined && value !== null && value !== '' ? parseInt(value, 10) : undefined)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsEnum(IncidentStatus)
    status?: IncidentStatus;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsEnum(IncidentPriority)
    priority?: IncidentPriority;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString()
    assigneeId?: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @IsString()
    search?: string;
}
