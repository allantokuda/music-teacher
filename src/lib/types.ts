export interface Peak {
  i: number;
  gain: number;
  height: number;
}

export interface FFTPoint {
  index: number
  gain: number
}

export interface PeakTrack {
  index: number;
  gains: number[];
  gain_steps: number[];
}

export interface Pitch {
  pitch_num: number;
  pitch_name: string;
  freq: number;
  fft_index: number;
}

export interface Measure {
  easyScore: string;
  notes: Pitch[];
}
