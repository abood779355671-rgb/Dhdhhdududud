export interface ShareData {
  title: string;
  url: string;
  message?: string;
}

export function buildWhatsappLink(data: ShareData): string {
  const text = data.message
    ? `${data.message}\n\n${data.url}`
    : `${data.title}\n${data.url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildTelegramLink(data: ShareData): string {
  return `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(
    data.message || data.title
  )}`;
}

export function buildSmsLink(data: ShareData): string {
  const text = data.message ? `${data.message} ${data.url}` : `${data.title} ${data.url}`;
  return `sms:?&body=${encodeURIComponent(text)}`;
}

export function buildEmailLink(data: ShareData): string {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(
    (data.message ? data.message + '\n\n' : '') + data.url
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

export function buildXLink(data: ShareData): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    data.message || data.title
  )}&url=${encodeURIComponent(data.url)}`;
}

export function buildFacebookLink(data: ShareData): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export function buildShareMessage(brideName: string | null, groomName: string | null): string {
  const names = [groomName, brideName].filter(Boolean).join(' و ');
  if (names) {
    return `يسعدنا دعوتكم لحضور حفل زفاف ${names}\nنتشرف بحضوركم 💛`;
  }
  return 'يسعدنا دعوتكم لحضور حفل زفافنا 💛';
}
