export interface Client {
    identification_id: string;
    alias: string | null;
    type_id: number | null;
    type: string | null;
    occupation: string | null;
    firstname: string;
    middlename: string | null;
    lastname: string;
    second_lastname: string | null;
    mobile: string | null;
    phone: string | null;
    birthdate: string | null;
    type_id_id: number | null;
    type_id_name: string | null;
    location_id: number;
    location: string | null;
    email: string | null;
    allow_credit: string;
    note: string | null;
    street: string;
    area: string | null;
    city: string;
    state: string;
    country_id: number;
    country: string | null;
    profile_picture: File | null;
    identification_pictures: File[];
    contact_types_id: number | null;
}

export const initialClient: Client = {
    identification_id: '',
    occupation: null,
    alias: null,
    type_id: null,
    type: null,
    firstname: '',
    middlename: null,
    lastname: '',
    second_lastname: null,
    mobile: null,
    phone: null,
    birthdate: null,
    type_id_id: null,
    type_id_name: null,
    location_id: 0,
    location: null,
    email: null,
    allow_credit: '1',
    note: null,
    street: '',
    area: null,
    city: '',
    state: '',
    country_id: 0,
    country: null,
    profile_picture: null,
    identification_pictures: [],
    contact_types_id: 0
};