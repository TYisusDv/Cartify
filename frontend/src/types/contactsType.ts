export interface Contact {
    type_id: string;
    type_label: string;
    relationship: string;
    fullname: string;
    phone: string;
    address: string;
    type?: {
        id: number;
        name: string;
    } | null;
}