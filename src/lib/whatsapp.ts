export const WHATSAPP_NUMBER = "919509109332";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export function buildWhatsAppLink(message: string) {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}
