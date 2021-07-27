import { get } from './request';

export const getPageData = p => get('login/sendThreeData', p);

export const getGuideData = p => get('sys/sendGuideData', p);

export const getPersonData = p => get('sys/sendPersonData', p);

export const getbranches = p => get('sys/loadNetworkByterminalNo', p);

export const getCultureData = p => get('sys/sendCultureData', p);

export const getProductData = p => get('sys/sendProductData', p);

export const getBankData = p => get('sys/sendBankData', p);

export const getScreenData = p => get('sys/quaryScreensByterminalNo', p);