export type UmbracoMedia = {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
};

export type RichTextValue = {
    markup: string;
    blocks: unknown[];
};