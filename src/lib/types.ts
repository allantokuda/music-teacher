export interface Peak {
  i: number;
  gain: number;
  height: number;
}

export interface PeakTrack {
  index: number;
  gains: number[];
  gain_steps: number[];
}

export interface Note {
  note_num: number;
  note_name: string;
}
