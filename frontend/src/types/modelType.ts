//User
export interface User {
    id?: number;
    password?: string;
    last_login?: string;
    is_superuser?: boolean;
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    is_staff?: boolean;
    is_active?: boolean;
    date_joined?: string;
}

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
    id?: string;
    street?: string;
    area?: string;
    city?: City;
}

//Type ID
export interface TypeID {
    id?: number;
    name?: string;
    status?: boolean | '0' | '1' | 0 | 1;
}

//Person
export interface Person {
    id?: string;
    identification_id?: string;
    identification_images?: string[];
    profile_image?: string;
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
    status?: boolean | '0' | '1' | 0 | 1;
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
    allow_credit?: boolean | '0' | '1' | 0 | 1;
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

//Suppliers
export interface Supplier {
    id?: string;
    company_name?: string;
    company_identification?: string;
    company_email?: string;
    company_phone?: string;
    company_phone_2?: string;
    company_address?: string;
    advisor_fullname?: string;
    advisor_email?: string;
    advisor_phone?: string;
    advisor_phone_2?: string;
}

//Product brand
export interface ProductBrand {
    id?: number;
    name?: string;
    status?: boolean | '0' | '1' | 0 | 1;
}

//Product category
export interface ProductCategory {
    id?: number;
    name?: string;
    status?: boolean | '0' | '1' | 0 | 1;
}

//Tax
export interface Tax {
    id?: number;
    name?: string;
    value?: number;
    status?: boolean | '0' | '1' | 0 | 1;
}

//Product images
export interface ProductImages {
    id?: number;
    image: string;
}

//Product
export interface Product {
    id?: string;
    images?: string[];
    product_images?: ProductImages[];
    barcode?: string;
    name?: string;
    model?: string;
    note?: string;
    cost_price?: number;
    cash_profit?: number;
    cash_price?: number;
    credit_profit?: number;
    credit_price?: number;
    min_stock?: number;
    status?: boolean | '0' | '1' | 0 | 1;
    category?: ProductCategory;
    brand?: ProductBrand;
    supplier?: Supplier;
    tax?: Tax;
}

//Inventory type
export interface InventoryType {
    id?: number;
    name?: string;
    type?: number;
}

//Inventory
export interface Inventory {
    id?: string;
    price?: number;
    cost?: number; 
    quantity?: number;    
    note?: string;
    date_reg?: Date;
    type?: InventoryType;
    product?: Product;
    location?: Location;
    user?: User;      
    location_transfer?: Location;
    user_transfer?: User;
    user_transfer_receives?: User;
    sale?: Sale
}

//PaymentMethod
export interface PaymentMethod {
    id?: number;
    name?: string;
    value?: number;
    status?: boolean | '0' | '1' | 0 | 1;
    allow_discount?: boolean | '0' | '1' | 0 | 1;
    allow_note?: boolean | '0' | '1' | 0 | 1;
}

//Sale
export interface Sale {
    id?: number;    
    total?: number;
    type?: number;  
    quantity_of_payments?: number;
    payment_days?: number;
    date_reg?: Date;  
    client?: Client;
    location?: Location;
    user?: User;
    sale_payments?: SalePayment[];
    inventory?: Inventory[];
}

//Sale payment
export interface SalePayment {
    id?: string;
    no?: number;
    subtotal?: number;
    commission?: number;
    surcharge?: number;
    discount_per?: number;
    discount?: number;
    total?: number;
    pay?: number;  
    change?: number;
    note?: string;
    date_reg?: Date;  
    date_limit?: string;  
    user?: User;    
    location?: Location;
    payment_method?: PaymentMethod;
    sale?: Sale;
    sale_id?: number;
}

//Sale receipt
export interface SaleReceipt {
    id?: number;
    prompter?: string;
    description?: string;
}