export const generateTicketCode = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now().toString().slice(-5);
  return `TKT-${timestamp}-${random}`;
};
