export interface EventStage {
  start?: number;
  end?: number;
  time?: number;
  label: string;
  order?: number;
}

export interface EventCategory {
  [stageKey: string]: EventStage;
}

export interface EventTimeline {
  lkti?: EventCategory;
  essay?: EventCategory;
  poster?: EventCategory;
}
