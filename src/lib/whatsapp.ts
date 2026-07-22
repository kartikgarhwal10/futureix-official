export const WHATSAPP_NUMBER = "919509109332";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WHATSAPP_NUMBER_2 = "917355024385";
export const WHATSAPP_LINK_2 = `https://wa.me/${WHATSAPP_NUMBER_2}`;

export function buildWhatsAppLink(message: string, number: string = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
