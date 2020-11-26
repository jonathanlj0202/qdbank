import { get } from './request';

export const getGuideData = p => get('sendGuideData', p);

export const getPersonData = p => get('sendPersonData', p);