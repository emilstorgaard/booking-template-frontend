import type { UmbracoMedia } from './umbraco';

export type SeoProperties = {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: UmbracoMedia[];
};