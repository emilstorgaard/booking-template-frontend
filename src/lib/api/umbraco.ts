import { PUBLIC_UMBRACO_URL } from '$env/static/public';
import type { UmbracoMedia } from '$lib/types/umbraco';

const BASE_URL = `${PUBLIC_UMBRACO_URL}/umbraco/delivery/api/v2`;

export async function getContentByPath(path: string, fetchFn: typeof fetch = fetch) {
  const url = `${BASE_URL}/content/item/${path}`;
  const res = await fetchFn(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${res.status}`);
  }

  return res.json();
}

export function getMediaUrl(
  relativeUrl: string,
  withParams = false,
  width = 1000,
  format: 'webp' | 'jpg' = 'webp'
): string {
  if (!relativeUrl) return '';
  const base = relativeUrl.startsWith('http') ? relativeUrl : `${PUBLIC_UMBRACO_URL}${relativeUrl}`;
  return withParams ? `${base}?width=${width}&format=${format}&quality=75` : base;
}

export async function getMediaInFolder(folderId: string, take = 15, skip = 0):
  Promise<{ items: UmbracoMedia[]; total: number }> {
  const res = await fetch(`/api/media/${folderId}?take=${take}&skip=${skip}`);

  if (!res.ok) return { items: [], total: 0 };

  const data = await res.json();

  const items: UmbracoMedia[] = (data.items ?? []).map((item: any) => ({
    id: item.id,
    name: item.name,
    url: item.url ?? '',
    width: item.width ?? 0,
    height: item.height ?? 0,
  }));

  return { items, total: data.total ?? 0 };
}