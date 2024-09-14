//Country
export interface Country {
    id?: number;
    name?: string;
}

//State
export interface State {
    id?: number;
    name?: string;
    country?: Country;
}

//City
export interface City {
    id?: number;
    name?: string;
    state?: State;
}

//Address
export interface Address {
    id?: number;
    street?: string;
    area?: string;
    city?: City;
}

//Type ID
export interface TypeID {
    id?: number;
    name?: string;
    status?: boolean | '0' | '1';
}

//Person
export interface Person {
    id?: number;
    identification_id?: string;
    profile_picture?: string;
    alias?: string;
    occupation?: string;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    second_lastname?: string;
    mobile?: string;
    phone?: string;
    birthdate?: string;
    type_id?: TypeID;
    addresses?: Address[];
}

//Location
export interface Location {
    id?: number;
    name?: string;
    status?: boolean | '0' | '1';
}

//Client type
export interface ClientType {
    id?: number;
    name?: string;
}

//Client
export interface Client {
    id?: number;
    email?: string;
    allow_credit?: boolean | '0' | '1';
    note?: string;
    date_reg?: string;
    location?: Location;
    person?: Person;
    type?: ClientType;
}

//Client type
export interface ClientType {
    id?: number;
    name?: string;
}

//Client contact
export interface ClientContact {
    id?: number;
    relationship?: string;
    fullname?: string;
    phone?: string;
    address?: string;
    type?: ClientType;
    client?: Client;
}