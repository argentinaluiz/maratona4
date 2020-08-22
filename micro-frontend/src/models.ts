export interface Server{
    id: string;
    name: string;
    logo_url: string;
    owner_id: string;
}

export interface User{
    id: string;
    name: string;
    photo_url: string;
}

export interface Category{
    id: string;
    name: string;
}

export interface Channel{
    id: string;
    name: string;
    join: {parent: string};
}