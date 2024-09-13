export interface Contact {
    relationship: string | null;
    fullname: string | null;
    phone: string | null;
    address: string | null;
    type: {
        id: number | null;
        name: string | null;
    };
}

export const initialContact: Contact = {
    relationship: null,
    fullname: null,
    phone: null,
    address: null,
    type: {
        id: null,
        name: null,
    }
};