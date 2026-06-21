export interface GoogleFitDataPoint {
  startTimeNanos: string;
  endTimeNanos: string;
  dataTypeName: string;
  originDataSourceId: string;
  value: {
    fpVal?: number;
    intVal?: number;
    mapVal?: Record<string, { fpVal?: number }>;
  }[];
  modifiedTimeMillis: string;
}

export interface GoogleFitDataset {
  dataSourceId: string;
  point: GoogleFitDataPoint[];
  minStartTimeNs: string;
  maxEndTimeNs: string;
}

export interface GoogleFitBucket {
  startTimeMillis: string;
  endTimeMillis: string;
  dataset: GoogleFitDataset[];
}

export interface GoogleFitAggregateResponse {
  bucket: GoogleFitBucket[];
}

export interface BodyCompositionData {
  date: string;
  weight?: number;
  bodyFatPercentage?: number;
  bmi?: number;
  muscleMass?: number;
}
