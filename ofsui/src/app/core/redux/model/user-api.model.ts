export interface ApiUser {
    href: string;
    id: string;
    firstName: string;
    lastName: string;
    company: ApiCompany;
    role: string;
    userName: string;
    emailAddress: string
    activeFlag: string;
}

export interface ApiCompany {
    href: string;
    name: string;
    id: string;
}