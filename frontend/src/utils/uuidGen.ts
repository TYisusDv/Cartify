
import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => {
    return uuidv4();
};

export const generateKey = (pre: string | number) => {
    return `${pre}_${new Date().getTime()}`;
}