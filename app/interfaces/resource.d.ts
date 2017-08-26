export interface Resource {
    id: number;
    creation_date: Date;
    description: string;
    expiration_date: Date;
    name: string;
    port: number;
    protocol: string;
    type: string;
}