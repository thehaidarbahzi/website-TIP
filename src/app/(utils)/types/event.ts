export interface EventStage {
  start?: number | string;
  end?: number | string;
  time?: number | string;
  label: string;
  order?: number;
  startsAt?: string;
  endsAt?: string;
  countdownTitle?: string;
}

export interface EventCategory {
  [stageKey: string]: EventStage;
}

export interface EventTimeline {
  lkti?: EventCategory;
  essay?: EventCategory;
  poster?: EventCategory;
}
