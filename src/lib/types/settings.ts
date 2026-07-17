import type { UmbracoMedia } from './umbraco';

export type NavLinkBlock = {
    content: {
        contentType: string;
        id: string;
        properties: {
            label: string;
            link: string;
        };
    };
    settings: unknown | null;
};

export type BlockList<T> = {
    items: T[];
};

export type SettingsProperties = {
    siteName: string;
    logo: UmbracoMedia[];
    ownerName: string;

    phone: string;
    email: string;
    address?: string;

    instagramUrl?: string;
    facebookUrl?: string;

    navLinks: BlockList<NavLinkBlock>;
};

export type Settings = {
    id: string;
    name: string;
    contentType: string;
    properties: SettingsProperties;
};