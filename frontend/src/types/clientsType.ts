export interface Client {
    identification_id: string;
    alias: string | null;
    type_id: number | null;
    occupation: string | null;
    firstname: string;
    middlename: string | null;
    lastname: string;
    second_lastname: string | null;
    mobile: string | null;
    phone: string | null;
    birthdate: string | null;
    type_id_id: string | null;
    location_id: number;
    email: string | null;
    allow_credit: string;
    note: string | null;
    street: string;
    area: string | null;
    city: string;
    state: string;
    country_id: number;
    profile_picture: File | null;
    identification_pictures: File[];
    contact_types_id: number | null;
}

export const initialClient: Client = {
    identification_id: '',
    occupation: null,
    alias: null,
    type_id: null,
    firstname: '',
    middlename: null,
    lastname: '',
    second_lastname: null,
    mobile: null,
    phone: null,
    birthdate: null,
    type_id_id: null,
    location_id: 0,
    email: null,
    allow_credit: '1',
    note: null,
    street: '',
    area: null,
    city: '',
    state: '',
    country_id: 0,
    profile_picture: null,
    identification_pictures: [],
    contact_types_id: 0
};