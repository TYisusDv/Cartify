export interface Client {
    identification_id: string | null;
    alias: string | null;
    firstname: string | null;
    middlename: string | null;
    lastname: string | null;
    second_lastname: string | null;
    mobile: string | null;
    phone: string | null;
    birthdate: string | null;
    type_of_ids_id: string | null;
    location_id: string | null;
    email: string | null;
    client_class: string | null;
    allow_credit: string | null;
    note: string | null;
    street: string | null;
    area: string | null;
    city: string | null;
    state: string | null;
    country_id: string | null;
}

export const initialClient: Client = {
    identification_id: null,
    alias: null,
    firstname: null,
    middlename: null,
    lastname: null,
    second_lastname: null,
    mobile: null,
    phone: null,
    birthdate: null,
    type_of_ids_id: null,
    location_id: null,
    email: null,
    client_class: null,
    allow_credit: '1',
    note: null,
    street: null,
    area: null,
    city: null,
    state: null,
    country_id: null,
};