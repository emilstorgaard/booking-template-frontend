import type { SeoProperties } from './seo';

export type HomePageProperties = SeoProperties & {
    title: string;
};

export type HomePage = {
    id: string;
    name: string;
    contentType: string;
    properties: HomePageProperties;
};