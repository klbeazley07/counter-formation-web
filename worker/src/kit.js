const KIT_API = 'https://api.convertkit.com/v3';

export async function subscribeToForm(formId, email, apiKey) {
  const res = await fetch(`${KIT_API}/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, email }),
  });
  if (!res.ok) throw new Error(`Kit form subscribe failed: ${res.status}`);
}

export async function subscribeWithTag(tagId, email, apiKey, fields = {}) {
  const res = await fetch(`${KIT_API}/tags/${tagId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, email, fields }),
  });
  if (!res.ok) throw new Error(`Kit tag subscribe failed: ${res.status}`);
}
