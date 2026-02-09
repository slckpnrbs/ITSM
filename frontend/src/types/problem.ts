export enum ProblemStatus {
    OPEN = 'OPEN',
    RCA_IN_PROGRESS = 'RCA_IN_PROGRESS',
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
}

export enum IncidentPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export interface Problem {
    id: string;
    number: string;
    summary: string;
    description: string;
    status: ProblemStatus;
    priority: IncidentPriority;
    rootCause?: string;
    workaround?: string;
    knownError: boolean;
    assigneeId?: string;
    assigneeName?: string;
    createdById: string;
    createdByName: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    closedAt?: string;
    incidents?: any[];
    _count?: {
        incidents: number;
    };
}

export interface CreateProblemPayload {
    summary: string;
    description: string;
    priority: IncidentPriority;
    incidentIds: string[];
    assigneeId?: string;
    assigneeName?: string;
}

export interface UpdateProblemPayload {
    summary?: string;
    description?: string;
    status?: ProblemStatus;
    priority?: IncidentPriority;
    rootCause?: string;
    workaround?: string;
    knownError?: boolean;
    assigneeId?: string;
    assigneeName?: string;
}
