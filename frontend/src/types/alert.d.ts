export type AlertVariant = 'success' | 'danger' | 'primary';

export interface AlertType {
    id: string;
    text: string;
    type:  AlertVariant;
    timeout?: number; 
    removeAlert?: (id: string) => void;
}