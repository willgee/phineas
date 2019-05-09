import { SurveyQuestion } from './survey-question.interface';
import { Poc } from './poc.interface';

export interface Survey {
    icon: string;
    projectTitle: string;
    questions: SurveyQuestion[];
    feedback: string;
    timeStamp: number;
    poc: Poc;
}
