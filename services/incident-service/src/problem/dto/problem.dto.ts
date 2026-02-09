import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ArrayMinSize, IsBoolean } from 'class-validator';
import { IncidentPriority, ProblemStatus } from '@prisma/client';

export class CreateProblemDto {
    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(IncidentPriority)
    priority: IncidentPriority;

    @IsArray()
    @ArrayMinSize(1, { message: 'At least one incident must be selected to create a problem' })
    incidentIds: string[];

    @IsOptional()
    @IsString()
    assigneeId?: string;

    @IsOptional()
    @IsString()
    assigneeName?: string;
}

export class UpdateProblemDto {
    @IsOptional()
    @IsString()
    summary?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(ProblemStatus)
    status?: ProblemStatus;

    @IsOptional()
    @IsEnum(IncidentPriority)
    priority?: IncidentPriority;

    @IsOptional()
    @IsString()
    rootCause?: string;

    @IsOptional()
    @IsString()
    workaround?: string;

    @IsOptional()
    @IsBoolean()
    knownError?: boolean;

    @IsOptional()
    @IsString()
    assigneeId?: string;

    @IsOptional()
    @IsString()
    assigneeName?: string;
}
